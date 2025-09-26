let currentPage = 1;
let currentEndpoint = "characters";
let allData = []; // full dataset
let filteredData = []; // dataset after search
const pageSize = 21;

function updateCounter() {
  const counter = document.getElementById("resultsCounter");
  if (!counter) return;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredData.length);
  counter.textContent = filteredData.length
    ? `Showing ${start}-${end} of ${filteredData.length} results`
    : "No results found";
}

// Fetch *all* pages for a given endpoint
async function fetchAllData(endpoint) {
  let page = 1;
  let results = [];
  let keepFetching = true;

  while (keepFetching) {
    const res = await fetch(`http://localhost:3000/api/${endpoint}?page=${page}`);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      keepFetching = false;
    } else {
      results = results.concat(data.data);
      page++;
    }
  }

  return results;
}

// Render current page
function renderPage() {
  const container = document.getElementById("results");
  container.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filteredData.slice(start, end);

  if (pageItems.length === 0) {
    container.textContent = "No data found.";
    updateCounter();
    return;
  }

  pageItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    const name = document.createElement("h3");
    name.textContent = item.name || item.appearance || "Unnamed";
    card.appendChild(name);

    const details = document.createElement("div");
    details.classList.add("details");
    details.style.display = "none";

    if (item.description) {
      const desc = document.createElement("p");
      desc.textContent = item.description;
      details.appendChild(desc);
    }

    if (item.gender) {
      const gender = document.createElement("p");
      gender.textContent = `Gender: ${item.gender}`;
      details.appendChild(gender);
    }

    if (item.race) {
      const race = document.createElement("p");
      race.textContent = `Race: ${item.race}`;
      details.appendChild(race);
    }

    if (item.appearances && item.appearances.length > 0) {
      const apps = document.createElement("p");
      apps.textContent = `Appearances: ${item.appearances.join(", ")}`;
      details.appendChild(apps);
    }

    card.appendChild(details);

    card.addEventListener("click", () => {
      details.style.display = details.style.display === "none" ? "block" : "none";
    });

    container.appendChild(card);
  });

  updatePaginationButtons();
  updateCounter();
}

// Update pagination buttons
function updatePaginationButtons() {
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled =
    currentPage * pageSize >= filteredData.length;
}

// Load everything when "Load Data" is clicked
document.getElementById("loadData").addEventListener("click", async () => {
  currentEndpoint = document.getElementById("endpointSelect").value;
  const container = document.getElementById("results");
  container.innerHTML = "Loading...";

  currentPage = 1;
  allData = await fetchAllData(currentEndpoint);
  filteredData = allData; // reset filter
  renderPage();
});

// Search across ALL data
document.querySelector(".search-input").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  filteredData = allData.filter((item) =>
    (item.name || item.appearance || "").toLowerCase().includes(query)
  );
  currentPage = 1;
  renderPage();
});

// Pagination buttons
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * pageSize < filteredData.length) {
    currentPage++;
    renderPage();
  }
});
