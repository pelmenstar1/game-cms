import {
  AmbientLight,
  AxesHelper,
  Box3,
  Color,
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

import { BackgroundTheme } from './types';

const FOV = 75;
const ASPECT = 2;
const NEAR = 0.1;
const FAR = 50;

export type Application = ReturnType<typeof createApplication>;

export function createApplication() {
  const scene = new Scene();
  let model: Object3D | undefined;

  const renderer = new WebGLRenderer({ antialias: true });

  const canvas = renderer.domElement;

  const camera = new PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
  camera.position.z = 2;

  const light = new AmbientLight(0xff_ff_ff, 1);
  scene.add(light);

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
    scene.background =
      theme === 'light' ? new Color(0xff_ff_ff) : new Color(0x44_44_44);
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

  return {
    canvas,
    setModelSource,
    setSize,
    setBackgroundTheme,
    destroy,
  };
}
