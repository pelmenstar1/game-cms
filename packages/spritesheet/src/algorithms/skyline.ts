import type { Size } from '@game-cms/shared';

import type {
  SpriteRect,
  SpritesheetMappingAlgorithm,
  TaggedSize,
} from '../types.js';

type Segment = { x: number; y: number; width: number };

function skylinePipeline<Tag>(limits: Size) {
  const skyline: Segment[] = [{ x: 0, y: 0, width: limits.width }];

  // Returns the y at which a rect of given width starting at segment index fits,
  // or undefined if it doesn't fit within limits.
  function fitAtSegment(
    segIndex: number,
    width: number,
    height: number
  ): number | undefined {
    let x = skyline[segIndex].x;
    let maxY = skyline[segIndex].y;
    let remaining = width;

    for (let i = segIndex; i < skyline.length && remaining > 0; i++) {
      if (skyline[i].x !== x) return undefined; // gap — shouldn't happen
      maxY = Math.max(maxY, skyline[i].y);
      if (maxY + height > limits.height) return undefined;
      remaining -= skyline[i].width;
      if (remaining > 0) x = skyline[i].x + skyline[i].width;
    }

    if (remaining > 0) return undefined; // not enough width
    return maxY;
  }

  function findBestPosition(
    width: number,
    height: number
  ): { x: number; y: number; segIndex: number } | undefined {
    let bestY = Number.MAX_VALUE;
    let bestX = 0;
    let bestSeg = -1;

    for (let i = 0; i < skyline.length; i++) {
      if (skyline[i].x + width > limits.width) continue;

      const y = fitAtSegment(i, width, height);
      if (y !== undefined && y < bestY) {
        bestY = y;
        bestX = skyline[i].x;
        bestSeg = i;
      }
    }

    if (bestSeg === -1) return undefined;
    return { x: bestX, y: bestY, segIndex: bestSeg };
  }

  function addSkylineLevel(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const newY = y + height;
    const rectRight = x + width;

    // Collect segments that are fully or partially covered by the new rect.
    const newSkyline: Segment[] = [];
    let inserted = false;

    for (const seg of skyline) {
      const segRight = seg.x + seg.width;

      if (segRight <= x || seg.x >= rectRight) {
        // Segment is entirely outside — keep as-is.
        newSkyline.push(seg);
      } else {
        // Insert the new segment before the first overlapping one.
        if (!inserted) {
          newSkyline.push({ x, y: newY, width });
          inserted = true;
        }

        // Left portion that sticks out.
        if (seg.x < x) {
          newSkyline.push({ x: seg.x, y: seg.y, width: x - seg.x });
        }

        // Right portion that sticks out.
        if (segRight > rectRight) {
          newSkyline.push({
            x: rectRight,
            y: seg.y,
            width: segRight - rectRight,
          });
        }
      }
    }

    if (!inserted) newSkyline.push({ x, y: newY, width });

    // Sort by x and merge adjacent segments at the same height.
    newSkyline.sort((a, b) => a.x - b.x);

    skyline.length = 0;
    for (const seg of newSkyline) {
      const last = skyline.at(-1);

      if (last && last.y === seg.y && last.x + last.width === seg.x) {
        last.width += seg.width;
      } else {
        skyline.push(seg);
      }
    }
  }

  function insertRects(
    _rects: TaggedSize<Tag>[]
  ): SpriteRect<Tag>[] | undefined {
    // Sort largest area first for better fill rate.
    const rects = _rects.toSorted(
      (a, b) => b.width * b.height - a.width * a.height
    );

    const result: SpriteRect<Tag>[] = [];

    for (const rect of rects) {
      const pos = findBestPosition(rect.width, rect.height);
      if (pos === undefined) return undefined;

      addSkylineLevel(pos.x, pos.y, rect.width, rect.height);
      result.push({
        x: pos.x,
        y: pos.y,
        width: rect.width,
        height: rect.height,
        tag: rect.tag,
      });
    }

    return result;
  }

  return { insertRects };
}

export const skyline: SpritesheetMappingAlgorithm = <Tag>(
  rects: TaggedSize<Tag>[],
  limits: Size
) => {
  const pipeline = skylinePipeline<Tag>(limits);
  const result = pipeline.insertRects(rects);

  if (result === undefined) {
    throw new Error('Failed to pack rects');
  }

  return { rects: result };
};
