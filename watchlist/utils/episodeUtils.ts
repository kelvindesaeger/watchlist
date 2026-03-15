export const parseEpisodeString = (episode?: string): number[] => {
  if (!episode) return [1];
  return episode
    .split(",")
    .map((e) => parseInt(e.trim()))
    .filter((n) => !isNaN(n) && n > 0);
};

/**
 * Generates season options based on total seasons.
 * @param totalSeasons Total number of seasons (user input or parsed)
 */
export const getSeasonOptions = (totalSeasons: number) => {
  const count = totalSeasons > 0 ? totalSeasons : 1;
  return Array.from({ length: count }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));
};

/**
 * Generates episode options for a given season
 * @param seasonEpisodes array of episode counts per season
 * @param currentSeason the season number (1-indexed)
 */
export const getEpisodeOptions = (
  seasonEpisodes: number[],
  currentSeason: number,
) => {
  const episodeCount = seasonEpisodes[currentSeason - 1] || 1;
  return Array.from({ length: episodeCount }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));
};
