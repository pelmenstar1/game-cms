import type { Size } from '@game-cms/shared';

import { isContainedIn } from '../internal/rect.js';
import type {
  Rect,
  RotatedRect,
  SpritesheetMappingAlgorithm,
  TaggedRect,
  TaggedSize,
} from '../types.js';

function checkedPop(values: unknown[], index: number) {
  values[index] = values[values.length - 1];
  values.pop();
}

function maxRectsPipeline<Tag>(limits: Size) {
  const usedRectangles: Rect[] = [];
  const freeRectangles: Rect[] = [
    {
      x: 0,
      y: 0,
      width: limits.width,
      height: limits.height,
    },
  ];

  let newFreeRectangles: Rect[] = [];
  let newFreeRectanglesLastSize: number = 0;

  function scoreRect(width: number, height: number) {
    const bestNode: RotatedRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    let bestAreaFit: number = Number.MAX_VALUE;
    let bestShortSideFit: number = Number.MAX_VALUE;

    for (const freeRect of freeRectangles) {
      const areaFit = freeRect.width * freeRect.height - width * height;

      const shortSideFit = Math.min(
        Math.abs(freeRect.width - width),
        Math.abs(freeRect.height - height)
      );

      if (
        freeRect.width >= width &&
        freeRect.height >= height &&
        (areaFit < bestAreaFit ||
          (areaFit == bestAreaFit && shortSideFit < bestShortSideFit))
      ) {
        bestNode.x = freeRect.x;
        bestNode.y = freeRect.y;
        bestNode.width = width;
        bestNode.height = height;
        bestNode.rotated = false;

        bestShortSideFit = shortSideFit;
        bestAreaFit = areaFit;
      }

      if (
        freeRect.width >= height &&
        freeRect.height >= width &&
        (areaFit < bestAreaFit ||
          (areaFit == bestAreaFit && shortSideFit < bestShortSideFit))
      ) {
        bestNode.x = freeRect.x;
        bestNode.y = freeRect.y;
        bestNode.width = height;
        bestNode.height = width;
        bestNode.rotated = true;

        bestShortSideFit = shortSideFit;
        bestAreaFit = areaFit;
      }
    }

    return { bestNode, bestAreaFit, bestShortSideFit };
  }

  function insertNewFreeRectangle(newFreeRect: Rect) {
    for (let i = 0; i < newFreeRectanglesLastSize; ) {
      // This new free rectangle is already accounted for?
      if (isContainedIn(newFreeRect, newFreeRectangles[i])) return;

      // Does this new free rectangle obsolete a previous new free rectangle?
      if (isContainedIn(newFreeRectangles[i], newFreeRect)) {
        // Remove i'th new free rectangle, but do so by retaining the order
        // of the older vs newest free rectangles that we may still be placing
        // in calling function SplitFreeNode().
        newFreeRectangles[i] = newFreeRectangles[--newFreeRectanglesLastSize];

        checkedPop(newFreeRectangles, newFreeRectanglesLastSize);
      } else {
        ++i;
      }
    }

    newFreeRectangles.push(newFreeRect);
  }

  function splitFreeNode(freeNode: Rect, usedNode: Rect) {
    // Test with SAT if the rectangles even intersect.
    if (
      usedNode.x >= freeNode.x + freeNode.width ||
      usedNode.x + usedNode.width <= freeNode.x ||
      usedNode.y >= freeNode.y + freeNode.height ||
      usedNode.y + usedNode.height <= freeNode.y
    )
      return false;

    // We add up to four new free rectangles to the free rectangles list below. None of these
    // four newly added free rectangles can overlap any other three, so keep a mark of them
    // to avoid testing them against each other.
    newFreeRectanglesLastSize = newFreeRectangles.length;

    if (
      usedNode.x < freeNode.x + freeNode.width &&
      usedNode.x + usedNode.width > freeNode.x
    ) {
      // New node at the top side of the used node.
      if (
        usedNode.y > freeNode.y &&
        usedNode.y < freeNode.y + freeNode.height
      ) {
        insertNewFreeRectangle({
          ...freeNode,
          height: usedNode.y - freeNode.y,
        });
      }

      // New node at the bottom side of the used node.
      if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
        const newNode = {
          ...freeNode,
          y: usedNode.y + usedNode.height,
          height: freeNode.y + freeNode.height - (usedNode.y + usedNode.height),
        };

        insertNewFreeRectangle(newNode);
      }
    }

    if (
      usedNode.y < freeNode.y + freeNode.height &&
      usedNode.y + usedNode.height > freeNode.y
    ) {
      // New node at the left side of the used node.
      if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
        insertNewFreeRectangle({ ...freeNode, width: usedNode.x - freeNode.x });
      }

      // New node at the right side of the used node.
      if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
        insertNewFreeRectangle({
          ...freeNode,
          x: usedNode.x + usedNode.width,
          width: freeNode.x + freeNode.width - (usedNode.x + usedNode.width),
        });
      }
    }

    return true;
  }

  function pruneFreeList() {
    for (let i = 0; i < freeRectangles.length; i++) {
      const freeRect = freeRectangles[i];

      for (let j = 0; j < newFreeRectangles.length; ) {
        if (isContainedIn(newFreeRectangles[j], freeRect)) {
          checkedPop(newFreeRectangles, j);
        } else {
          if (isContainedIn(freeRect, newFreeRectangles[j])) {
            throw new Error('Old free rect is contained in new free rects');
          }

          j++;
        }
      }
    }

    freeRectangles.push(...newFreeRectangles);
    newFreeRectangles = [];
  }

  function placeRect(node: Rect) {
    for (let i = 0; i < freeRectangles.length; ) {
      if (splitFreeNode(freeRectangles[i], node)) {
        checkedPop(freeRectangles, i);
      } else {
        i++;
      }
    }

    pruneFreeList();
    usedRectangles.push(node);
  }

  function insertRects(_rects: TaggedSize<Tag>[]) {
    const rects = [..._rects];
    const result: TaggedRect<Tag>[] = [];

    while (rects.length > 0) {
      let bestScore1 = Number.MAX_VALUE;
      let bestScore2 = Number.MAX_VALUE;
      let bestRectIndex = -1;
      let bestNode: TaggedRect<Tag> | undefined;

      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        const {
          bestNode: newNode,
          bestAreaFit: score1,
          bestShortSideFit: score2,
        } = scoreRect(rect.width, rect.height);

        if (
          score1 < bestScore1 ||
          (score1 == bestScore1 && score2 < bestScore2)
        ) {
          bestScore1 = score1;
          bestScore2 = score2;
          bestNode = { ...newNode, tag: rect.tag };
          bestRectIndex = i;
        }
      }

      if (bestNode === undefined) {
        return;
      }

      placeRect(bestNode);
      result.push(bestNode);

      checkedPop(rects, bestRectIndex);
    }

    return result;
  }

  return { insertRects };
}

export const maxRects: SpritesheetMappingAlgorithm = <Tag>(
  rects: TaggedSize<Tag>[],
  limits: Size
) => {
  const pipeline = maxRectsPipeline<Tag>(limits);
  const result = pipeline.insertRects(rects);

  if (result === undefined) {
    throw new Error('Failed to pack rects');
  }

  return { rects: result };
};
