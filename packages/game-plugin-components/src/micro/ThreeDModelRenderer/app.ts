import {
  AmbientLight,
  AxesHelper,
  Box3,
  Color,
  DirectionalLight,
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
import { BackgroundTheme } from './types';

const FOV = 75;
const ASPECT = 2;
const NEAR = 0.1;
const FAR = 50;

export type Application = ReturnType<typeof createApplication>;

export function createApplication() {
  const scene = new Scene();
  let model: Object3D | undefined;
  let activeLights: Light[] = [];

  const renderer = new WebGLRenderer({ antialias: true });

  const canvas = renderer.domElement;

  const camera = new PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
  camera.position.z = 2;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const axes = new AxesHelper(FAR);
  scene.add(axes);

  function render() {
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
    return new Promise<void>((resolve, reject) => {
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

          model = gltf.scene;
          scene.add(model);
          fitCameraToModel(model);

          resolve();
        },
        (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress(event.loaded / event.total);
          }
        },
        reject
      );
    });
  }

  function setSize(width: number, height: number) {
    if (width > 0 && height > 0) {
      renderer.setSize(width, height, true);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      render();
    }
  }

  function destroy() {
    renderer.dispose();
    controls.removeEventListener('change', render);
  }

  renderer.setAnimationLoop(render);
  controls.addEventListener('change', render);

  setBackgroundTheme('light');
  setLightingType('directional');

  return {
    canvas,
    setModelSource,
    setSize,
    setBackgroundTheme,
    setLightingType,
    destroy,
  };
}
