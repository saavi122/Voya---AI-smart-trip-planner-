/**
 * Orbitrip — Bootstrap.
 * Wires up search, filters, grid rendering, and the reusable modal.
 */

import { searchCities } from './cities-api.js';

const els = {
  searchForm:   document.getElementById('searchForm'),
  searchInput:  document.getElementById('searchInput'),
  grid:         document.getElementById('cityGrid'),
  empty:        document.getElementById('emptyState'),
  countryChips: document.getElementById('countryChips'),
  viewChips:    document.getElementById('viewChips'),
  statTotal:    document.getElementById('statTotal'),
  statTrip:     document.getElementById('statTrip'),
  statSaved:    document.getElementById('statSaved'),
  toast:        document.getElementById('toast'),
  openPicker:   document.getElementById('openPickerBtn'),
  modalRoot:    document.getElementById('cityPickerModal'),
};

const state = {
  country: 'all',
  view: 'all',     // 'all' | 'trip' | 'saved'
};

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const grid = document.getElementById("cityGrid");

const cities = [
    {
        name: "Tokyo",
        country: "Japan"
    },
    {
        name: "Paris",
        country: "France"
    },
    {
        name: "Bali",
        country: "Indonesia"
    },
    {
        name: "New York",
        country: "USA"
    },
    {
        name: "Rome",
        country: "Italy"
    },
    {
        name: "Dubai",
        country: "UAE"
    }
];

function renderCities(cityList){

    grid.innerHTML = "";

    cityList.forEach(city => {

        const div = document.createElement("div");

        div.className = "city-card";

        div.innerHTML = `
            <h3>${city.name}</h3>
            <p>${city.country}</p>

            <div class="card-actions">

                <button class="add-btn">
                    Add to Trip
                </button>

                <button class="itinerary-btn">
                    See Itinerary
                </button>

            </div>
        `;

        // ADD TO TRIP
        const addBtn = div.querySelector(".add-btn");

        addBtn.addEventListener("click", () => {

            const STORAGE_KEY = "wayfare.itinerary.v1";

            let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

            if (!data) {
                data = {
                    stops: [],
                    viewMode: "calendar"
                };
            }

            const alreadyExists = data.stops.some(
                stop => stop.city.toLowerCase() === city.name.toLowerCase()
            );

            if (!alreadyExists) {

                data.stops.push({
                    id: Date.now().toString(),
                    city: city.name,
                    startDate: "",
                    endDate: "",
                    activities: [],
                    _draftTime: "",
                    _draftTitle: ""
                });

                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

                alert(`${city.name} added to itinerary`);
            }
        });

        // SEE ITINERARY
        const itineraryBtn = div.querySelector(".itinerary-btn");

        itineraryBtn.addEventListener("click", () => {
            window.location.href = "/itinerary/";
        });

        grid.appendChild(div);
    });
}

// SEARCH
form.addEventListener("submit", (e) => {

    e.preventDefault();

    const query = input.value.toLowerCase();

    const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(query)
    );

    renderCities(filtered);
});

// INITIAL LOAD
renderCities(cities);