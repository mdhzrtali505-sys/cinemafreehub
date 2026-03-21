const API_KEY = "05902896074695709d7763505bb88b4d";
const BASE = "https://api.themoviedb.org/3";

export const IMG_W500 = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIG = "https://image.tmdb.org/t/p/original";

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

async function fetchTMDB<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const tmdb = {
  trending: (type: "movie" | "tv" = "movie") =>
    fetchTMDB<TMDBResponse>(`/trending/${type}/day`),

  popular: (type: "movie" | "tv" = "movie") =>
    fetchTMDB<TMDBResponse>(`/${type}/popular`),

  topRated: (type: "movie" | "tv" = "movie") =>
    fetchTMDB<TMDBResponse>(`/${type}/top_rated`),

  nowPlaying: () =>
    fetchTMDB<TMDBResponse>(`/movie/now_playing`),

  upcoming: () =>
    fetchTMDB<TMDBResponse>(`/movie/upcoming`),

  discover: (type: "movie" | "tv", params: string = "") =>
    fetchTMDB<TMDBResponse>(`/discover/${type}?sort_by=popularity.desc${params}`),

  search: (query: string) =>
    fetchTMDB<TMDBResponse>(`/search/multi?query=${encodeURIComponent(query)}`),

  movieDetails: (id: number) =>
    fetchTMDB<Movie & { runtime: number; genres: { id: number; name: string }[]; videos?: { results: { key: string; type: string; site: string }[] } }>(`/movie/${id}?append_to_response=videos`),

  tvDetails: (id: number) =>
    fetchTMDB<Movie & { number_of_seasons: number; genres: { id: number; name: string }[]; videos?: { results: { key: string; type: string; site: string }[] } }>(`/tv/${id}?append_to_response=videos`),
};

export function getYear(date?: string) {
  return date ? date.split("-")[0] : "N/A";
}

export function getTitle(item: Movie) {
  return item.title || item.name || "Untitled";
}

export function getStars(rating: number) {
  return Math.round((rating / 10) * 5);
}
