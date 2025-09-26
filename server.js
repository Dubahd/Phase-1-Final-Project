import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors()); //this enables cross origin requests

const BASE_URL = "https://zelda.fanapis.com/api";

async function proxyHandler(request, response, endpoint) {
  try {
    let query = new URLSearchParams(request.query);

    // If no page given, default to page=1
    if (!query.has("page")) {
      query.set("page", 1);
    }

    const url = `${BASE_URL}/${endpoint}?${query.toString()}`;

    console.log("Fetching from Zelda API:", url); // log full URL

    const response1 = await fetch(url);
    console.log("Zelda API status:", response1.status); // log status

    if (!response1.ok) throw new Error(`Zelda API error: ${response1.status}`);
    const data = await response1.json();

    console.log("Data received", data);

    // console.log("Zelda API data:", JSON.stringify(data, null, 2).slice(0, 300)); // log preview

    response.json(data);
  } catch (error1) {
    console.error("Proxy error:", error1.message);
    response
      .status(500)
      .json({ error: `Failed to fetch ${endpoint}`, details: error1.message });
  }
}

// Proxy routes
app.get("/api/characters", (request, response) =>
  proxyHandler(request, response, "characters")
);
app.get("/api/items", (request, response) =>
  proxyHandler(request, response, "items")
);
app.get("/api/monsters", (request, response) =>
  proxyHandler(request, response, "monsters")
);
app.get("/api/bosses", (request, response) =>
  proxyHandler(request, response, "bosses")
);
app.get("/api/dungeons", (request, response) =>
  proxyHandler(request, response, "dungeons")
);
app.get("/api/places", (request, response) =>
  proxyHandler(request, response, "places")
);
app.get("/api/games", (request, response) =>
  proxyHandler(request, response, "games")
);
app.get("/api/staff", (request, response) =>
  proxyHandler(request, response, "staff")
);

app.listen(PORT, () => {
  console.log(`Zelda API Proxy running at http://localhost:${PORT}`);
});
