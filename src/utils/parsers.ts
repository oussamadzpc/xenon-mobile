import { COUNTRY_DATA, detectBeinLanguage, detectCountry } from "./countryData";

export interface ParsedXtream {
  baseUrl: string;
  username: string;
  password: string;
}

export const parseXtreamUrl = (url: string): ParsedXtream | null => {
  try {
    // React Native doesn't have URL constructor in some environments
    // So we parse manually
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    let baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const pathParts = urlObj.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart.includes(".php")) {
      baseUrl += pathParts.slice(0, -1).join("/");
    } else {
      baseUrl += urlObj.pathname;
    }
    baseUrl = baseUrl.replace(/\/$/, "");

    return {
      baseUrl,
      username: params.get("username") || "",
      password: params.get("password") || "",
    };
  } catch (e) {
    // Fallback manual parsing for React Native
    try {
      const match = url.match(/^(https?:\/\/[^\/]+)(.*)[?&]username=([^&]+).*password=([^&]+)/);
      if (match) {
        return {
          baseUrl: (match[1] + match[2]).replace(/\/$/, ""),
          username: match[3],
          password: match[4],
        };
      }
    } catch (e2) {
      return null;
    }
    return null;
  }
};

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    throw error.name === "AbortError" ? new Error("Request timeout") : error;
  }
};

export const getRemainingDays = (date: string): number => {
  if (!date) return 0;
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export const isExpired = (date: string): boolean => {
  if (!date) return true;
  return new Date(date).getTime() < new Date().getTime();
};

// Channel parser
export interface Channel {
  name: string;
  url: string;
  logo: string;
  group: string;
  groupId: string;
  type: string;
  streamId: string;
  country: ReturnType<typeof detectCountry>;
  beinLanguage: string | null;
  isBeinSport: boolean;
}

export const parseChannels = (data: any[], parsed: ParsedXtream): Channel[] => {
  return data.map((item) => {
    const countryData = detectCountry(item.name || "", item.category_name || "");
    const beinLang = detectBeinLanguage(item.name || "", item.category_name || "");

    return {
      name: item.name || "Unknown",
      url: `${parsed.baseUrl}/live/${parsed.username}/${parsed.password}/${item.stream_id}.m3u8`,
      logo: item.stream_icon || "",
      group: item.category_name || "General",
      groupId: item.category_id || "0",
      type: "live",
      streamId: String(item.stream_id),
      country: countryData,
      beinLanguage: beinLang,
      isBeinSport:
        (item.name || "").toLowerCase().includes("bein") ||
        (item.name || "").toLowerCase().includes("ssc") ||
        (item.category_name || "").toLowerCase().includes("bein") ||
        (item.category_name || "").toLowerCase().includes("ssc"),
    };
  });
};

// Movie parser
export interface Movie {
  name: string;
  url: string;
  logo: string;
  plot: string;
  genre: string;
  rating: string;
  year: string;
  type: string;
  streamId: string;
}

export const parseMovies = (data: any[], parsed: ParsedXtream): Movie[] => {
  return data.map((item) => ({
    name: item.name || item.title || "Unknown",
    url: `${parsed.baseUrl}/movie/${parsed.username}/${parsed.password}/${item.stream_id}.${item.container_extension || "mp4"}`,
    logo: item.stream_icon || item.cover || "",
    plot: item.plot || "",
    genre: item.genre || "",
    rating: item.rating || "",
    year: item.year || "",
    type: "movie",
    streamId: String(item.stream_id),
  }));
};

// Series parser
export interface Series {
  name: string;
  seriesId: string;
  logo: string;
  plot: string;
  genre: string;
  rating: string;
  year: string;
  type: string;
  numEpisodes: number;
}

export const parseSeries = (data: any[]): Series[] => {
  return data.map((item) => ({
    name: item.name || item.title || "Unknown",
    seriesId: String(item.series_id),
    logo: item.cover || item.stream_icon || "",
    plot: item.plot || "",
    genre: item.genre || "",
    rating: item.rating || "",
    year: item.year || "",
    type: "series",
    numEpisodes: item.num || 0,
  }));
};

// Episode parser
export interface Episode {
  episode_num: string;
  title: string;
  url: string;
  season: string;
  duration: string;
  plot: string;
  streamId: string;
}

export const parseEpisodes = (data: any, parsed: ParsedXtream): Episode[] => {
  const allEpisodes: Episode[] = [];
  if (data?.episodes) {
    Object.keys(data.episodes).forEach((seasonNum) => {
      data.episodes[seasonNum].forEach((ep: any) => {
        allEpisodes.push({
          episode_num: String(ep.episode_num || ep.num || "?"),
          title: ep.title || `S${seasonNum}E${ep.episode_num || ep.num}`,
          url:
            ep.url ||
            `${parsed.baseUrl}/series/${parsed.username}/${parsed.password}/${ep.id}.${ep.container_extension || "mp4"}`,
          season: seasonNum,
          duration: ep.info?.duration || "",
          plot: ep.info?.plot || "",
          streamId: String(ep.id),
        });
      });
    });
  }

  allEpisodes.sort((a, b) => {
    if (a.season !== b.season) return parseInt(a.season) - parseInt(b.season);
    return parseInt(a.episode_num) - parseInt(b.episode_num);
  });

  return allEpisodes;
};
