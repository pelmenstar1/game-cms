import {
  AmbientLight,
  AxesHelper,
  Color,
  LoadingManager,
  Object3D,
  PerspectiveCamera,
  Scene,
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

  function setBackgroundTheme(theme: BackgroundTheme) {
    scene.background =
      theme === 'light' ? new Color(0xff_ff_ff) : new Color(0x44_44_44);
  }

  renderer.setAnimationLoop(render);
  controls.addEventListener('change', render);

  setBackgroundTheme('light');

  return {
    canvas,
    setModelSource: (
      source: string,
      onProgress?: (progress: number) => void,
      abortSignal?: AbortSignal
    ) => {
      return new Promise<void>((resolve, reject) => {
        const manager = new LoadingManager();

        const loaderAbort = () => {
          manager.abort();
        };

        const detachAbortListener = () => {
          abortSignal?.removeEventListener('abort', loaderAbort);
        };

        abortSignal?.addEventListener('abort', loaderAbort);

        const loader = new GLTFLoader(manager);

        loader.load(
          source,
          (gltf) => {
            if (model) {
              scene.remove(model);
            }

            model = gltf.scene;
            scene.add(model);

            resolve();

            detachAbortListener();
          },
          (event) => {
            if (event.lengthComputable && onProgress) {
              onProgress(event.loaded / event.total);
            }
          },
          (error) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(error);

            detachAbortListener();
          }
        );
      });
    },
    setSize: (width: number, height: number) => {
      if (width > 0 && height > 0) {
        renderer.setSize(width, height, true);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        render();
      }
    },
    setBackgroundTheme,
    destroy: () => {
      renderer.dispose();
      controls.removeEventListener('change', render);
    },
  };
}
