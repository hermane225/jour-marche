// Market data - sample data for French markets
const markets = [
    {
        name: "Marché de Paris - Bastille",
        location: "Paris, Île-de-France",
        days: ["jeudi", "dimanche"]
    },
    {
        name: "Marché de Lyon - Croix-Rousse",
        location: "Lyon, Auvergne-Rhône-Alpes",
        days: ["mardi", "vendredi", "dimanche"]
    },
    {
        name: "Marché de Marseille - Noailles",
        location: "Marseille, Provence-Alpes-Côte d'Azur",
        days: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Toulouse - Victor Hugo",
        location: "Toulouse, Occitanie",
        days: ["mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Nice - Cours Saleya",
        location: "Nice, Provence-Alpes-Côte d'Azur",
        days: ["mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Bordeaux - Capucins",
        location: "Bordeaux, Nouvelle-Aquitaine",
        days: ["mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Nantes - Talensac",
        location: "Nantes, Pays de la Loire",
        days: ["mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Strasbourg",
        location: "Strasbourg, Grand Est",
        days: ["mercredi", "vendredi", "samedi"]
    },
    {
        name: "Marché de Montpellier - Plan Cabanes",
        location: "Montpellier, Occitanie",
        days: ["mardi", "samedi"]
    },
    {
        name: "Marché de Lille - Wazemmes",
        location: "Lille, Hauts-de-France",
        days: ["mardi", "jeudi", "dimanche"]
    },
    {
        name: "Marché de Rennes - Lices",
        location: "Rennes, Bretagne",
        days: ["samedi"]
    },
    {
        name: "Marché de Reims",
        location: "Reims, Grand Est",
        days: ["mercredi", "vendredi", "samedi"]
    },
    {
        name: "Marché de Saint-Étienne - Roubaud",
        location: "Saint-Étienne, Auvergne-Rhône-Alpes",
        days: ["jeudi", "dimanche"]
    },
    {
        name: "Marché de Toulon",
        location: "Toulon, Provence-Alpes-Côte d'Azur",
        days: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Grenoble - Estacade",
        location: "Grenoble, Auvergne-Rhône-Alpes",
        days: ["mardi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Dijon - Halles",
        location: "Dijon, Bourgogne-Franche-Comté",
        days: ["mardi", "jeudi", "vendredi", "samedi"]
    },
    {
        name: "Marché d'Angers",
        location: "Angers, Pays de la Loire",
        days: ["samedi"]
    },
    {
        name: "Marché de Nîmes - Halles",
        location: "Nîmes, Occitanie",
        days: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    },
    {
        name: "Marché de Villeurbanne",
        location: "Villeurbanne, Auvergne-Rhône-Alpes",
        days: ["mardi", "jeudi", "samedi", "dimanche"]
    },
    {
        name: "Marché d'Aix-en-Provence",
        location: "Aix-en-Provence, Provence-Alpes-Côte d'Azur",
        days: ["mardi", "jeudi", "samedi"]
    }
];

// State management
let currentFilter = "all";
let searchQuery = "";

// Initialize the application
function init() {
    displayMarkets(markets);
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterAndDisplayMarkets();
    });

    // Day filter buttons
    const dayButtons = document.querySelectorAll(".day-btn");
    dayButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all buttons
            dayButtons.forEach(b => b.classList.remove("active"));
            
            // Add active class to clicked button
            e.target.classList.add("active");
            
            // Update filter
            currentFilter = e.target.dataset.day;
            filterAndDisplayMarkets();
        });
    });

    // Set "Tous" as active by default
    document.querySelector('[data-day="all"]').classList.add("active");
}

// Filter and display markets based on current filters
function filterAndDisplayMarkets() {
    let filteredMarkets = markets;

    // Filter by day
    if (currentFilter !== "all") {
        filteredMarkets = filteredMarkets.filter(market => 
            market.days.includes(currentFilter)
        );
    }

    // Filter by search query
    if (searchQuery) {
        filteredMarkets = filteredMarkets.filter(market => 
            market.name.toLowerCase().includes(searchQuery) ||
            market.location.toLowerCase().includes(searchQuery)
        );
    }

    displayMarkets(filteredMarkets);
}

// Display markets
function displayMarkets(marketsToDisplay) {
    const marketList = document.getElementById("marketList");
    const resultsCount = document.getElementById("resultsCount");

    // Update results count
    const count = marketsToDisplay.length;
    resultsCount.textContent = `${count} marché${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}`;

    // Clear previous results
    marketList.innerHTML = "";

    if (marketsToDisplay.length === 0) {
        marketList.innerHTML = `
            <div class="no-results">
                <h2>Aucun marché trouvé</h2>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    // Create market cards
    marketsToDisplay.forEach(market => {
        const card = createMarketCard(market);
        marketList.appendChild(card);
    });
}

// Create a market card element
function createMarketCard(market) {
    const card = document.createElement("div");
    card.className = "market-card";

    const daysHTML = market.days
        .map(day => `<span class="day-tag">${capitalizeFirstLetter(day)}</span>`)
        .join("");

    card.innerHTML = `
        <div class="market-name">${market.name}</div>
        <div class="market-days">${daysHTML}</div>
        <div class="market-location">${market.location}</div>
    `;

    return card;
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
