import { canvasToBlob } from '@game-cms/shared/browser';
import {
  AmbientLight,
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  AxesHelper,
  Box3,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  Light,
  LoadingManager,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { LightingType } from './constants';
import { AnimationInfo, BackgroundTheme } from './types';

const FOV = 75;
const ASPECT = 2;
const NEAR = 0.1;
const FAR = 50;

export type Application = ReturnType<typeof createApplication>;

export function createApplication() {
  const scene = new Scene();
  let model: Object3D | undefined;
  let activeLights: Light[] = [];

  let mixer: AnimationMixer | undefined;
  let currentAction: AnimationAction | undefined;
  let animationClips: AnimationClip[] = [];
  let onTimeUpdate: ((time: number) => void) | undefined;
  let prevTimestamp = 0;

  const renderer = new WebGLRenderer({ antialias: true });

  const canvas = renderer.domElement;

  const camera = new PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
  camera.position.z = 2;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const axes = new AxesHelper(FAR);
  axes.visible = false;
  scene.add(axes);

  let gridVisible = false;
  let grid = new GridHelper(2, 20);
  grid.visible = false;

  scene.add(grid);

  function setGridVisible(visible: boolean) {
    gridVisible = visible;
    grid.visible = visible;
  }

  function render(timestamp: number) {
    if (mixer) {
      const delta = (timestamp - prevTimestamp) / 1000;
      mixer.update(delta);

      if (onTimeUpdate && currentAction) {
        onTimeUpdate(currentAction.time);
      }
    }

    controls.update();
    prevTimestamp = timestamp;
    renderer.render(scene, camera);
  }

  function fitCameraToModel(target: Object3D) {
    const box = new Box3().setFromObject(target);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    const center = sphere.center;
    const radius = sphere.radius;

    const fovRad = (camera.fov * Math.PI) / 180;
    const distance = radius / Math.sin(fovRad / 2);

    const direction = new Vector3(0, 0.5, 1).normalize();
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();

    scene.remove(grid);

    grid = new GridHelper(radius * 4, 20);
    grid.position.set(center.x, box.min.y, center.z);
    grid.visible = gridVisible;

    scene.add(grid);
  }

  function setBackgroundTheme(theme: BackgroundTheme) {
    const background = theme === 'light' ? 0xff_ff_ff : 0x44_44_44;

    scene.background = new Color(background);
  }

  function setLightingType(type: LightingType) {
    for (const light of activeLights) {
      scene.remove(light);
    }

    if (type === 'ambient') {
      const ambient = new AmbientLight(0xff_ff_ff, 1);

      activeLights = [ambient];
    } else if (type === 'directional') {
      const ambient = new AmbientLight(0xff_ff_ff, 0.4);
      const directional = new DirectionalLight(0xff_ff_ff, 1.5);
      directional.position.set(5, 10, 5);

      activeLights = [ambient, directional];
    } else {
      const hemisphereLight = new HemisphereLight(0x87_ce_eb, 0x8b_73_55, 1.5);

      activeLights = [hemisphereLight];
    }

    for (const light of activeLights) {
      scene.add(light);
    }
  }

  function setModelSource(
    source: string,
    onProgress?: (progress: number) => void,
    abortSignal?: AbortSignal
  ) {
    return new Promise<AnimationInfo[]>((resolve, reject) => {
      const manager = new LoadingManager();

      const loader = new GLTFLoader(manager);
      loader.setWithCredentials(true);

      loader.load(
        source,
        (gltf) => {
          if (abortSignal?.aborted) {
            return;
          }

          if (model) {
            scene.remove(model);
          }

          mixer?.stopAllAction();
          currentAction = undefined;
          animationClips = gltf.animations;

          model = gltf.scene;
          scene.add(model);
          fitCameraToModel(model);

          mixer =
            animationClips.length > 0 ? new AnimationMixer(model) : undefined;

          resolve(
            animationClips.map((clip) => ({
              name: clip.name,
              duration: clip.duration,
            }))
          );
        },
        (event) => {
          if (onProgress && event.lengthComputable) {
            onProgress(event.loaded / event.total);
          }
        },
        reject
      );
    });
  }

  function playAnimation(index: number, play: boolean) {
    if (!mixer || index < 0 || index >= animationClips.length) return;

    currentAction?.stop();
    currentAction = mixer.clipAction(animationClips[index]);
    currentAction.play();

    if (!play) {
      currentAction.paused = true;
    }
  }

  function pauseAnimation() {
    if (currentAction) {
      currentAction.paused = true;
    }
  }

  function resumeAnimation() {
    if (currentAction) {
      currentAction.paused = false;
    }
  }

  function seekAnimation(time: number) {
    if (currentAction && mixer) {
      currentAction.time = time;
      mixer.update(0);
    }
  }

  function setAutoRotate(enabled: boolean) {
    controls.autoRotate = enabled;
  }

  function setAxesVisible(visible: boolean) {
    axes.visible = visible;
  }

  function setOnTimeUpdate(callback: ((time: number) => void) | undefined) {
    onTimeUpdate = callback;
  }

  function setSize(width: number, height: number) {
    if (width > 0 && height > 0) {
      renderer.setSize(width, height, true);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    }
  }

  function renderImmediate() {
    renderer.render(scene, camera);
  }

  function screenshot() {
    renderer.render(scene, camera);

    return canvasToBlob(renderer.domElement);
  }

  function destroy() {
    renderer.dispose();
    controls.removeEventListener('change', renderImmediate);
  }

  renderer.setAnimationLoop(render);
  controls.addEventListener('change', renderImmediate);

  setBackgroundTheme('light');
  setLightingType('directional');

  return {
    canvas,
    setModelSource,
    setSize,
    setBackgroundTheme,
    setLightingType,
    playAnimation,
    pauseAnimation,
    resumeAnimation,
    seekAnimation,
    setAutoRotate,
    setAxesVisible,
    setGridVisible,
    setOnTimeUpdate,
    screenshot,
    destroy,
  };
}
