const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

// Parse ISO 8601 duration (PT1M30S → seconds)
function parseDuration(iso) {
  if (!iso) return 0;

  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = match?.[1] ? parseInt(match[1]) : 0;
  const seconds = match?.[2] ? parseInt(match[2]) : 0;

  return minutes * 60 + seconds;
}

export async function searchYouTube(query) {
  if (!API_KEY) {
    console.error("YouTube API key missing");
    return [];
  }

  // 1️⃣ SEARCH API
  const searchRes = await fetch(
    `${SEARCH_URL}?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
      query
    )}&key=${API_KEY}`
  );

  const searchData = await searchRes.json();
  if (!searchData.items) return [];

  const videoIds = searchData.items
    .map((item) => item.id.videoId)
    .join(",");

  // 2️⃣ VIDEOS API (for duration)
  const videosRes = await fetch(
    `${VIDEOS_URL}?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
  );

  const videosData = await videosRes.json();

  // Map videoId → details
  const detailsMap = {};
  videosData.items.forEach((v) => {
    detailsMap[v.id] = {
      durationInSeconds: parseDuration(v.contentDetails.duration),
      views: v.statistics.viewCount,
    };
  });

  // 3️⃣ MERGE RESULTS
  return searchData.items.map((item) => {
    const id = item.id.videoId;
    const details = detailsMap[id] || {};

    return {
      id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${id}`,
      durationInSeconds: details.durationInSeconds || 0,
      views: details.views || "0",
    };
  });
}
