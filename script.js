console.log("javascript connected");

// ---------- Theme toggle ----------
const themeButton = document.getElementById("themeToggle");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Switch to Light Mode";
    } else {
        themeButton.textContent = "Switch to Dark Mode";
    }

});

// ---------- Weather API ----------
const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");
weatherButton.addEventListener("click", getWeather);

async function getWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = "Please enter a city.";
        return;
    }

    weatherResult.textContent = "Loading weather...";

    const apiKey = "9488c3dd0ad18d2941c6743522c10988";

    const url =
  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        weatherResult.innerHTML = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Condition: ${data.weather[0].description}</p>
        `;

    } catch (error) {

        weatherResult.textContent =
            "Unable to fetch weather. Please try again.";

        console.error(error);
    }
}

// ---------- Project search ----------
(function () {
    const searchInput = document.getElementById("projectSearch");
    const projectItems = document.querySelectorAll("#projectList .project-item");
    const noResults = document.getElementById("noResults");
    const projectCount = document.getElementById("projectCount");

    if (!searchInput || projectItems.length === 0) return;

    function filterProjects() {
        const term = searchInput.value.trim().toLowerCase();
        const words = term.split(/\s+/).filter(Boolean);
        let visible = 0;

        projectItems.forEach(function (item) {
            const title = item.querySelector("a").textContent.toLowerCase();
            const description = item.querySelector("p").textContent.toLowerCase();
            const tags = (item.dataset.tags || "").toLowerCase();
            const searchable = title + " " + description + " " + tags;

            // Every word typed must appear in the title, description or tags.
            const matches = words.every(function (word) {
                return searchable.includes(word);
            });

            item.hidden = !matches;
            if (matches) visible++;
        });

        noResults.hidden = visible !== 0;
        projectCount.textContent = term
            ? "Showing " + visible + " of " + projectItems.length + " projects"
            : "";
    }

    searchInput.addEventListener("input", filterProjects);
})();