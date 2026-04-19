import {
  SkinsAndAnimationBoundsProvider,
  Spine,
  SpineTexture,
  TextureAtlas,
} from '@esotericsoftware/spine-pixi-v8';
import { handleResponseError, lerp } from '@game-cms/shared';
import {
  Application,
  Assets,
  type RectangleLike,
  type Size,
  Texture,
  Ticker,
} from 'pixi.js';

import { initPixiAssets } from '../../utils/pixi.js';
import type { OnAnimationTimeChanged, SpineData } from './types.js';

type ResolvedSpineContext = {
  atlas: string;
  skeleton: string;
  component: Spine;
};

let globalSpineIndex = 0;

const SETUP_POSE_KEY = Symbol();

const SCALE_FACTOR = 0.9;

type InitialBoundsMap = Partial<
  Record<string | typeof SETUP_POSE_KEY, RectangleLike>
>;

export type SpineApplication = Awaited<
  ReturnType<typeof createSpineApplication>
>;

function getSpineBounds(spine: Spine, animation: string | null) {
  return new SkinsAndAnimationBoundsProvider(animation).calculateBounds(spine);
}

async function loadAtlas(
  atlasUrl: string,
  textureUrls: string[],
  alias: string
) {
  const imageTextures = await Assets.loader.load<Texture>(textureUrls);
  const imageTextureArray = Object.values(imageTextures);

  const response = await fetch(atlasUrl);

  if (!response.ok) {
    await handleResponseError(response, 'Cannot fetch atlas file');
  }

  const atlasText = await response.text();

  const atlas = new TextureAtlas(atlasText);
  const { pages } = atlas;

  for (let i = 0; i < pages.length; i++) {
    pages[i].setTexture(SpineTexture.from(imageTextureArray[i].source));
  }

  Assets.cache.set(alias, atlas);
}

export async function createSpineApplication() {
  const app = new Application();
  await app.init({
    autoDensity: true,
    backgroundAlpha: 0,
    antialias: true,
  });

  await initPixiAssets();

  let initialBoundsMap: InitialBoundsMap | undefined;
  let currentAnimation: string | undefined;
  let currentSkin: string | undefined;
  let currentLoop = true;
  let currentAnimationRunning = true;
  let onAnimationTimeChanged: OnAnimationTimeChanged | undefined;

  let isTickerRunning: boolean;

  let resolvedSpine: ResolvedSpineContext | undefined;

  function getSpineComponent() {
    const spine = resolvedSpine?.component;
    if (!spine) {
      throw new Error('Spine is not loaded');
    }

    return spine;
  }

  function getInitialBounds(animation: string | undefined) {
    if (!initialBoundsMap) {
      const spine = getSpineComponent();

      initialBoundsMap = { [SETUP_POSE_KEY]: getSpineBounds(spine, null) };

      for (const { name } of spine.skeleton.data.animations) {
        initialBoundsMap[name] = getSpineBounds(spine, name);
      }
    }

    const rect = initialBoundsMap[animation ?? SETUP_POSE_KEY];
    if (!rect) {
      throw new Error(`Unknown animation: ${animation}`);
    }

    return rect;
  }

  function setSize(size: Size) {
    app.renderer.resize(size.width, size.height);

    onSizeChanged();
  }

  function onSizeChanged() {
    const { screen } = app;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (resolvedSpine && screen) {
      const spine = resolvedSpine.component;

      const currentAnimation = spine.state.tracks[0]?.animation?.name;

      const initialBounds = getInitialBounds(currentAnimation);

      const { width: spineWidth, height: spineHeight, x, y } = initialBounds;
      const { width: screenWidth, height: screenHeight } = screen;

      const scale =
        SCALE_FACTOR *
        (Math.min(screenWidth, screenHeight) /
          Math.max(spineWidth, spineHeight));

      const worldSpineWidth = spineWidth * scale;
      const worldSpineHeight = spineHeight * scale;

      const cx = (screenWidth - worldSpineWidth) * 0.5;
      const cy = (screenHeight - worldSpineHeight) * 0.5;

      spine.skeleton.x = cx - x;
      spine.skeleton.y = cy - y;
      spine.scale = scale;
    }
  }

  function refreshAnimation() {
    const component = resolvedSpine?.component;

    if (component) {
      const { state } = component;

      if (currentAnimation !== undefined) {
        const firstTrack = state.tracks[0];

        if (
          firstTrack?.animation?.name !== currentAnimation ||
          firstTrack.loop !== currentLoop
        ) {
          state.setAnimation(0, currentAnimation, currentLoop);
          component.update(0);
        }
      } else {
        state.clearTracks();
      }
    }
  }

  function getFirstTrack() {
    return resolvedSpine?.component.state.tracks[0];
  }

  function invokeAnimationTimeCallback() {
    const firstTrack = getFirstTrack();

    if (firstTrack) {
      const duration = firstTrack.animation?.duration;

      // Also checks for 0, which is also not valid.
      if (duration) {
        const time = firstTrack.getAnimationTime() / duration;

        onAnimationTimeChanged?.(time, duration);
      }
    }
  }
  function onTick(ticker: Ticker) {
    resolvedSpine?.component.update(ticker.deltaMS / 1000);

    invokeAnimationTimeCallback();
  }

  async function createSpine(data: SpineData): Promise<ResolvedSpineContext> {
    const prefix = `spine-app-${globalSpineIndex++}`;
    const atlasAlias = `${prefix}-atlas`;
    const skeletonAlias = `${prefix}-skel`;

    await loadAtlas(data.atlas, data.images, atlasAlias);
    await Assets.load({ alias: skeletonAlias, src: data.skeleton });

    const spine = Spine.from({
      atlas: atlasAlias,
      skeleton: skeletonAlias,
      autoUpdate: false,
    });

    return {
      atlas: atlasAlias,
      skeleton: skeletonAlias,
      component: spine,
    };
  }

  async function setSpine(data: SpineData) {
    const { stage } = app;

    if (resolvedSpine) {
      await Assets.unload([resolvedSpine.atlas, resolvedSpine.skeleton]);

      if (stage.children.length > 0) {
        stage.removeChildren();
      }
    }

    resolvedSpine = await createSpine(data);

    stage.addChild(resolvedSpine.component);

    if (!isTickerRunning) {
      isTickerRunning = true;
      app.ticker.add(onTick);
    }

    refreshAnimation();
    refreshSkin();
    onSizeChanged();
  }

  function destroy() {
    app.destroy({ releaseGlobalResources: true, removeView: true });
  }

  function getAnimations() {
    const spine = resolvedSpine?.component;
    if (!spine) {
      return [];
    }

    return spine.skeleton.data.animations.map(({ name }) => name);
  }

  function getSkins() {
    const spine = resolvedSpine?.component;
    if (!spine) {
      return [];
    }

    return spine.skeleton.data.skins.map(({ name }) => name);
  }

  function refreshSkin() {
    if (!currentSkin) return;

    const spine = resolvedSpine?.component;
    if (!spine) return;

    spine.skeleton.setSkinByName(currentSkin);
    spine.skeleton.setSlotsToSetupPose();
    spine.update(0);
  }

  function setSkin(name: string | undefined) {
    currentSkin = name;
    refreshSkin();
  }

  function setAnimation(name: string | undefined) {
    currentAnimation = name;

    refreshAnimation();
    setTime(0);
    onSizeChanged();
  }

  function setAnimationRunning(state: boolean) {
    if (currentAnimationRunning !== state) {
      currentAnimationRunning = state;

      if (state) {
        app.ticker.add(onTick);
      } else {
        app.ticker.remove(onTick);
      }
    }
  }

  function setLoop(value: boolean) {
    currentLoop = value;
    refreshAnimation();
  }

  function setOnAnimationTimeChanged(
    value: OnAnimationTimeChanged | undefined
  ) {
    onAnimationTimeChanged = value;
  }

  function setTime(relativeTime: number) {
    const track = getFirstTrack();

    if (track) {
      const duration = track.animation?.duration;

      if (duration !== undefined) {
        track.trackTime = lerp(0, duration, relativeTime);

        getSpineComponent().update(0);

        onAnimationTimeChanged?.(relativeTime, duration);
      }
    }
  }

  function setSpeed(value: number) {
    const firstTrack = getFirstTrack();

    if (firstTrack) {
      firstTrack.timeScale = value;
    }
  }

  function exportFrame(): Promise<Blob | null> {
    app.renderer.render(app.stage);

    const canvas = app.renderer.extract.canvas(app.stage) as HTMLCanvasElement;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }

  return {
    pixiApp: app,
    setSpine,
    setSize,
    onSizeChanged,
    getAnimations,
    getSkins,
    destroy,
    setAnimation,
    setLoop,
    setSkin,
    setAnimationRunning,
    setOnAnimationTimeChanged,
    setTime,
    setSpeed,
    exportFrame,
  };
}
