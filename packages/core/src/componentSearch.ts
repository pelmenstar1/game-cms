export function searchScoreComposer() {
  let _result = 0;

  return {
    include: (score: number) => {
      _result = Math.max(_result, score);
    },
    result: () => _result,
  };
}
