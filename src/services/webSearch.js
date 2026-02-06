// export async function searchWeb(query) {
//   const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
//     query
//   )}&format=json&no_html=1&skip_disambig=1`;

//   const res = await fetch(url);
//   const data = await res.json();

//   const results = [];

//   if (data.AbstractURL) {
//     results.push({
//       title: data.Heading || query,
//       snippet: data.AbstractText,
//       url: data.AbstractURL,
//       source: "DuckDuckGo",
//     });
//   }

//   if (data.RelatedTopics) {
//     data.RelatedTopics.slice(0, 6).forEach((item) => {
//       if (item.Text && item.FirstURL) {
//         results.push({
//           title: item.Text.split(" - ")[0],
//           snippet: item.Text,
//           url: item.FirstURL,
//           source: "DuckDuckGo",
//         });
//       }
//     });
//   }

//   return results;
// }


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function searchWeb(query) {
  const res = await fetch(
    `${API_BASE_URL}/api/web-search?q=${encodeURIComponent(query)}`
  );

  const data = await res.json();
  return data;
}

