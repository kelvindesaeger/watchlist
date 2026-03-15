import { MediaItem } from "../context/MediaContext";

const MY_API_FILMS_TOKEN = "";

export async function searchMediaByType(
  title: string,
  type: string,
): Promise<MediaItem | null> {
  if (type === "Serie") {
    // Use TVMaze for series
    try {
      const res = await fetch(
        `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(
          title,
        )}&embed=episodes`,
      );

      if (res.ok) {
        const show = await res.json();
        const episodes = show._embedded?.episodes || [];

        const seasonMap: Record<number, number> = {};

        episodes.forEach((ep: any) => {
          seasonMap[ep.season] = (seasonMap[ep.season] || 0) + 1;
        });

        const totalSeasons = Object.keys(seasonMap).length;

        // convert to "10,8,12"
        const episodeString = Object.keys(seasonMap)
          .sort((a, b) => Number(a) - Number(b))
          .map((s) => seasonMap[Number(s)])
          .join(",");

        const mediaItem: MediaItem = {
          id: ".",
          name: show.name,
          type: "Serie",
          platform: show.network?.name || show.webChannel?.name || "Unknown",
          schedule: show.schedule?.days?.join(", ") || ".",
          status: show.status || "Unknown",
          priority: "Medium",
          season: totalSeasons,
          episode: episodeString,
          current_season: 1,
          current_episode: 1,
          notes: show.summary ? show.summary.replace(/<[^>]*>?/gm, "") : ".",
          image: show.image?.original || show.image?.medium || ".",
        };
        return mediaItem;
      }
    } catch (err) {
      console.warn("TVMaze lookup failed:", err);
    }
  }

  if (type === "Movie") {
    // Use MyApiFilms for movies
    try {
      const res = await fetch(
        `https://www.myapifilms.com/imdb/idIMDB?title=${encodeURIComponent(
          title,
        )}&token=${MY_API_FILMS_TOKEN}&format=json&language=en-us&limit=1`,
      );
      const data = await res.json();
      const movie = data?.data?.movies?.[0];
      if (movie) {
        const mediaItem: MediaItem = {
          id: ".",
          name: movie.title,
          type: "Movie",
          platform: "Cinema / Streaming",
          schedule: ".",
          season: -1,
          episode: "-1",
          current_season: -1,
          current_episode: -1,
          status: "Planned",
          priority: "Medium",
          notes: movie.plot || ".",
          image: movie.urlPoster || ".",
        };
        return mediaItem;
      }
    } catch (err) {
      console.error("MyApiFilms lookup failed:", err);
    }
  }

  return null;
}
