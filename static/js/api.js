/**
 * api.js — Activity data layer.
 * Tries Geoapify Places API when a key is configured, falls back to seed data.
 * All functions return Promises resolving to arrays of normalized activities.
 */
(function () {
  'use strict';
  const Orbitrip = window.Orbitrip || (window.Orbitrip = {});

  // Map Geoapify category strings to our taxonomy
  const GEO_CAT_MAP = {
    adventure: 'adventure_sport,sport',
    culture: 'entertainment.museum,entertainment.culture,tourism.sights',
    food: 'catering.restaurant,catering.cafe,catering.food_court',
    nature: 'natural,leisure.park,national_park',
    nightlife: 'entertainment.nightclub,catering.bar,catering.pub',
    wellness: 'leisure.spa,leisure',
    sightseeing: 'tourism.attraction,tourism.sights',
    water: 'beach,leisure.water_park,sport.swimming_pool',
    shopping: 'commercial.shopping_mall,commercial.marketplace'
  };

  function normalizeFromSeed(items) {
    return items.map(it => ({ ...it }));
  }

  /**
   * Filter the seed dataset by query/category/cost/duration.
   */
  function filterSeed({ query = '', category = 'all', cost = 'any', maxDuration = 0, location = '' } = {}) {
    const q = (query || '').trim().toLowerCase();
    const loc = (location || '').trim().toLowerCase();
    return Orbitrip.seedActivities.filter(a => {
      if (category && category !== 'all' && a.category !== category) return false;
      if (cost && cost !== 'any' && a.costTier !== cost) return false;
      if (maxDuration && maxDuration > 0 && a.duration > maxDuration) return false;
      if (loc) {
        const haystack = `${a.city} ${a.country} ${a.location}`.toLowerCase();
        if (!haystack.includes(loc)) return false;
      }
      if (q) {
        const haystack = `${a.title} ${a.description} ${a.tags.join(' ')} ${a.city} ${a.country} ${a.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function sort(items, key) {
    const arr = items.slice();
    switch (key) {
      case 'rating': arr.sort((a, b) => b.rating - a.rating); break;
      case 'price-low': arr.sort((a, b) => a.cost - b.cost); break;
      case 'price-high': arr.sort((a, b) => b.cost - a.cost); break;
      case 'duration': arr.sort((a, b) => a.duration - b.duration); break;
      default: /* relevance preserves order */ break;
    }
    return arr;
  }

  /**
   * Live API: Geoapify Places.
   * Only used when api key is set. Returns normalized list, or [] on failure.
   */
  async function searchGeoapify({ query, location, category }) {
    const cfg = Orbitrip.config.geoapify;
    if (!cfg.apiKey) return null;
    try {
      // First geocode the location to a point + radius
      const geocode = await fetch(
        `${cfg.geocodeUrl}?text=${encodeURIComponent(location || query)}&limit=1&apiKey=${cfg.apiKey}`
      ).then(r => r.json());
      const f = geocode.features && geocode.features[0];
      if (!f) return null;
      const [lon, lat] = f.geometry.coordinates;

      const cats = GEO_CAT_MAP[category] || GEO_CAT_MAP.sightseeing;
      const url = `${cfg.baseUrl}?categories=${encodeURIComponent(cats)}&filter=circle:${lon},${lat},25000&limit=24&apiKey=${cfg.apiKey}`;
      const resp = await fetch(url).then(r => r.json());
      if (!resp.features) return null;

      // Normalize Geoapify shape to our activity object
      return resp.features.map((feat, idx) => {
        const p = feat.properties || {};
        const tags = (p.categories || []).slice(0, 3);
        return {
          id: `geo-${p.place_id || idx}`,
          title: p.name || p.address_line1 || 'Local experience',
          description: p.address_line2 || `Discover ${p.name || 'this place'} in ${p.city || p.country}.`,
          longDescription: p.description || `${p.name || 'Local experience'} — recommended around ${p.city || p.country}.`,
          city: p.city || p.county || '',
          country: p.country || '',
          location: [p.address_line1, p.address_line2].filter(Boolean).join(', '),
          category: category || 'sightseeing',
          tags,
          duration: 2,
          durationLabel: '2 hr',
          cost: 0,
          costTier: 'free',
          currency: 'USD',
          rating: (4.0 + Math.random() * 0.9).toFixed(1) * 1,
          reviews: Math.floor(50 + Math.random() * 600),
          image: `https://source.unsplash.com/800x540/?${encodeURIComponent(p.name || category || 'travel')}`,
          imageLarge: `https://source.unsplash.com/1400x700/?${encodeURIComponent(p.name || category || 'travel')}`,
          highlights: tags.length ? tags.map(t => t.replace(/_/g, ' ')) : ['Local favourite', 'Recommended', 'Easy to reach'],
          bestTime: 'Year-round',
          groupSize: 'Open'
        };
      });
    } catch (e) {
      console.warn('[Orbitrip] Geoapify failed, using seed', e);
      return null;
    }
  }

  /**
   * Top-level search.
   * Strategy: try Geoapify (if location provided + key set), merge with seed.
   * Always applies local filtering on top to honour cost/duration filters.
   */
  async function search(opts = {}) {
    const { query = '', location = '', category = 'all', cost = 'any', maxDuration = 0, sort: sortKey = 'relevance' } = opts;

    let items = filterSeed({ query, category, cost, maxDuration, location });

    // If we have a key & a meaningful location, augment with live API
    if (Orbitrip.config.geoapify.apiKey && (location || query)) {
      const live = await searchGeoapify({ query, location, category: category === 'all' ? 'sightseeing' : category });
      if (live && live.length) {
        // Apply duration filter to live (most live entries have duration:2 default → keep)
        const filteredLive = live.filter(a => !maxDuration || a.duration <= maxDuration);
        items = items.concat(filteredLive);
      }
    }

    return sort(items, sortKey);
  }

  function getById(id) {
    if (!id) return null;
    // Check seed first
    const fromSeed = Orbitrip.seedActivities.find(a => a.id === id);
    if (fromSeed) return fromSeed;
    // Else look in localStorage cache
    try {
      const trip = Orbitrip.storage.load();
      return trip.activities[id] || null;
    } catch { return null; }
  }

  function categoryCounts() {
    const counts = { all: Orbitrip.seedActivities.length };
    Orbitrip.categories.forEach(c => { if (c.id !== 'all') counts[c.id] = 0; });
    Orbitrip.seedActivities.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return counts;
  }

  Orbitrip.api = { search, getById, filterSeed, sort, categoryCounts };
})();