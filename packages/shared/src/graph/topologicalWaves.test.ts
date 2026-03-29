import { expect, test } from 'vitest';

import { topologicalWaves } from './topologicalWaves.js';

type Node = { id: string; deps: string[] };

function waves(nodes: Node[]) {
  const map = new Map(nodes.map((n) => [n.id, n]));

  return topologicalWaves(
    nodes.map((n) => n.id),
    (id) => map.get(id)?.deps ?? []
  );
}

test('empty input returns empty waves', () => {
  expect(waves([])).toEqual([]);
});

test('single node with no deps', () => {
  expect(waves([{ id: 'a', deps: [] }])).toEqual([['a']]);
});

test('independent nodes all land in wave 1', () => {
  expect(
    waves([
      { id: 'a', deps: [] },
      { id: 'b', deps: [] },
      { id: 'c', deps: [] },
    ])
  ).toEqual([['a', 'b', 'c']]);
});

test('linear chain produces one node per wave', () => {
  expect(
    waves([
      { id: 'a', deps: [] },
      { id: 'b', deps: ['a'] },
      { id: 'c', deps: ['b'] },
    ])
  ).toEqual([['a'], ['b'], ['c']]);
});

test('diamond: a -> b, a -> c, b -> d, c -> d', () => {
  const result = waves([
    { id: 'a', deps: [] },
    { id: 'b', deps: ['a'] },
    { id: 'c', deps: ['a'] },
    { id: 'd', deps: ['b', 'c'] },
  ]);
  expect(result[0]).toEqual(['a']);
  expect(result[1]).toEqual(expect.arrayContaining(['b', 'c']));
  expect(result[1]).toHaveLength(2);
  expect(result[2]).toEqual(['d']);
});

test('node with multiple deps only appears after all deps are done', () => {
  const result = waves([
    { id: 'a', deps: [] },
    { id: 'b', deps: [] },
    { id: 'c', deps: ['a', 'b'] },
  ]);
  expect(result[0]).toEqual(expect.arrayContaining(['a', 'b']));
  expect(result[1]).toEqual(['c']);
});

test('throws on direct cycle (a -> b -> a)', () => {
  expect(() =>
    waves([
      { id: 'a', deps: ['b'] },
      { id: 'b', deps: ['a'] },
    ])
  ).toThrow('Cycle detected in dependency graph');
});

test('throws on indirect cycle (a -> b -> c -> a)', () => {
  expect(() =>
    waves([
      { id: 'a', deps: ['c'] },
      { id: 'b', deps: ['a'] },
      { id: 'c', deps: ['b'] },
    ])
  ).toThrow('Cycle detected in dependency graph');
});
