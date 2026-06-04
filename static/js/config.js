/**
 * config.js — Orbitrip configuration & taxonomy
 * Pure module exposed via window.Orbitrip namespace (Django-friendly).
 */
(function () {
  'use strict';

  const Orbitrip = window.Orbitrip || (window.Orbitrip = {});

  Orbitrip.config = {
    /**
     * Geoapify Places API config.
     * To enable live data, sign up at https://www.geoapify.com/ (free 3k req/day)
     * and paste your key below. Without a key, the app uses the curated seed
     * dataset (data.js) — fully functional out of the box.
     */
    geoapify: {
      apiKey: '', // <- paste your Geoapify key here to enable live API
      baseUrl: 'https://api.geoapify.com/v2/places',
      geocodeUrl: 'https://api.geoapify.com/v1/geocode/search'
    },
    seed: {
      enabled: true // always allow seed as a fallback
    }
  };

  // Activity category taxonomy (icon = inline SVG path data)
  Orbitrip.categories = [
    { id: 'all', label: 'All experiences', icon: 'M3 12h18M3 6h18M3 18h18' },
    { id: 'adventure', label: 'Adventure', icon: 'M14 6l-4 4M5 13l-2 2 6 6 2-2M14 6l5-5 4 4-5 5M14 6l4 4' },
    { id: 'culture', label: 'Culture & Arts', icon: 'M3 22h18M5 22V8l7-5 7 5v14M9 22V12h6v10' },
    { id: 'food', label: 'Food & Drink', icon: 'M5 12V3h2v9a3 3 0 0 1-3 3v7M11 3v6a3 3 0 0 0 3 3v10M14 9V3' },
    { id: 'nature', label: 'Nature & Outdoor', icon: 'M3 21h18M12 3v18M5 21l3-9 4 6 4-6 3 9' },
    { id: 'nightlife', label: 'Nightlife', icon: 'M21 12a9 9 0 1 1-9-9 7 7 0 0 0 9 9z' },
    { id: 'wellness', label: 'Wellness & Spa', icon: 'M12 2v6l4-4M12 2v6l-4-4M2 12h6l-4-4M2 12h6l-4 4M22 12h-6l4-4M22 12h-6l4 4M12 22v-6l4 4M12 22v-6l-4 4' },
    { id: 'sightseeing', label: 'Sightseeing', icon: 'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z M12 12a3 3 0 1 0 0-.01' },
    { id: 'water', label: 'Water sports', icon: 'M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0' },
    { id: 'shopping', label: 'Shopping', icon: 'M3 6h18l-2 13H5L3 6zM8 6V4a4 4 0 0 1 8 0v2' }
  ];

  // Cost tiers in USD
  Orbitrip.costTiers = {
    free: { label: 'Free', max: 0 },
    '$': { label: '$', min: 1, max: 30 },
    '$$': { label: '$$', min: 30, max: 80 },
    '$$$': { label: '$$$', min: 80, max: 200 },
    '$$$$': { label: '$$$$', min: 200, max: Infinity }
  };

  Orbitrip.STORAGE_KEY = 'orbitrip.itinerary.v1';
})();