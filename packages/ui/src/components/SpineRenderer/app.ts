import {
  SkinsAndAnimationBoundsProvider,
  Spine,
} from '@esotericsoftware/spine-pixi-v8';
import { lerp } from '@game-cms/shared';
import {
  Application,
  Assets,
  Graphics,
  type PointData,
  type RectangleLike,
  type Size,
  Ticker,
} from 'pixi.js';

import type { OnAnimationTimeChanged, SpineData } from './types';

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

function createRectGraphics() {
  const component = new Graphics();

  const currentWidth = 0;
  const currentHeight = 0;

  return {
    component,
    setSize: (size: Size) => {
      if (currentWidth !== size.width || currentHeight !== size.height) {
        component.clear();
        component
          .rect(0, 0, size.width, size.height)
          .stroke({ width: 1, color: '#ff0000' });
      }
    },
    setPosition: (position: PointData) => {
      component.position.copyFrom(position);
    },
  };
}

function getSpineBounds(spine: Spine, animation: string | null) {
  return new SkinsAndAnimationBoundsProvider(animation).calculateBounds(spine);
}

export async function createSpineApplication(container: HTMLElement) {
  const app = new Application();
  await app.init({
    autoDensity: true,
    resizeTo: container,
    backgroundAlpha: 0,
    antialias: true,
  });

  let initialBoundsMap: InitialBoundsMap | undefined;
  let currentAnimation: string | undefined;
  let currentAnimationRunning = true;
  let onAnimationTimeChanged: OnAnimationTimeChanged | undefined;

  let isTickerRunning: boolean;

  let resolvedSpine: ResolvedSpineContext | undefined;
  const boundsRect = createRectGraphics();

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

      boundsRect.setPosition({ x: cx, y: cy });
      boundsRect.setSize({ width: worldSpineWidth, height: worldSpineHeight });

      spine.skeleton.x = cx - x;
      spine.skeleton.y = cy - y;
      spine.scale = scale;
    }
  }

  function refreshAnimation() {
    const state = resolvedSpine?.component.state;

    if (state) {
      if (currentAnimation !== undefined) {
        if (state.tracks[0]?.animation?.name !== currentAnimation) {
          state.setAnimation(0, currentAnimation, true);
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

        onAnimationTimeChanged?.(time);
      }
    }
  }

  function onTick(ticker: Ticker) {
    resolvedSpine?.component.update(ticker.deltaMS / 1000);

    invokeAnimationTimeCallback();
  }

  async function setSpine(data: SpineData) {
    const { stage } = app;

    if (resolvedSpine) {
      await Assets.unload([resolvedSpine.atlas, resolvedSpine.skeleton]);

      if (stage.children.length > 0) {
        stage.removeChildren();
      }
    }

    const prefix = `spine-app-${globalSpineIndex++}`;
    const atlasAlias = `${prefix}-atlas`;
    const skeletonAlias = `${prefix}-skel`;

    await Assets.load([
      { alias: atlasAlias, src: data.atlas },
      { alias: skeletonAlias, src: data.skeleton },
    ]);

    const spine = Spine.from({
      atlas: atlasAlias,
      skeleton: skeletonAlias,
      autoUpdate: false,
    });

    stage.addChild(spine);
    stage.addChild(boundsRect.component);

    resolvedSpine = {
      atlas: atlasAlias,
      skeleton: skeletonAlias,
      component: spine,
    };

    if (!isTickerRunning) {
      isTickerRunning = true;
      app.ticker.add(onTick);
    }

    refreshAnimation();
    onSizeChanged();
  }

  function destroy() {
    app.destroy({ releaseGlobalResources: true, removeView: true });
  }

  function getAnimations() {
    const spine = getSpineComponent();

    return spine.skeleton.data.animations.map(({ name }) => name);
  }

  function setAnimation(name: string | undefined) {
    currentAnimation = name;

    refreshAnimation();
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

  function setOnAnimationTimeChanged(
    value: OnAnimationTimeChanged | undefined
  ) {
    onAnimationTimeChanged = value;
  }

  function setTime(relativeTime: number) {
    const track = getFirstTrack();

    if (track) {
      const duration = track.animation?.duration;

      if (duration) {
        track.trackTime = lerp(0, duration, relativeTime);

        getSpineComponent().update(0);

        onAnimationTimeChanged?.(relativeTime);
      }
    }
  }

  function setSpeed(value: number) {
    const firstTrack = getFirstTrack();

    if (firstTrack) {
      firstTrack.timeScale = value;
    }
  }

  return {
    pixiApp: app,
    setSpine,
    onSizeChanged,
    getAnimations,
    destroy,
    setAnimation,
    setAnimationRunning,
    setOnAnimationTimeChanged,
    setTime,
    setSpeed,
  };
}
