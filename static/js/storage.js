/**
 * storage.js — localStorage helpers for itinerary state.
 */
(function () {
  'use strict';
  const Orbitrip = window.Orbitrip || (window.Orbitrip = {});
  const KEY = Orbitrip.STORAGE_KEY;

  const defaultTrip = () => ({
    name: '',
    destination: '',
    days: 3,
    pax: 2,
    daysData: [[], [], []], // array of arrays of activityIds (or full objects)
    activities: {} // id -> activity object cache
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultTrip();
      const parsed = JSON.parse(raw);
      // Ensure daysData length matches days
      if (!Array.isArray(parsed.daysData)) parsed.daysData = [];
      while (parsed.daysData.length < (parsed.days || 1)) parsed.daysData.push([]);
      if (!parsed.activities) parsed.activities = {};
      return parsed;
    } catch (e) {
      console.warn('[Orbitrip] storage load failed', e);
      return defaultTrip();
    }
  }

  function save(trip) {
    try {
      localStorage.setItem(KEY, JSON.stringify(trip));
    } catch (e) {
      console.warn('[Orbitrip] storage save failed', e);
    }
  }

  // Convenience: which activities are currently in the trip
  function getActivityIds(trip) {
    const ids = new Set();
    (trip.daysData || []).forEach(day => day.forEach(id => ids.add(id)));
    return ids;
  }

  function addActivity(trip, dayIndex, activity) {
    if (!trip.daysData[dayIndex]) trip.daysData[dayIndex] = [];
    if (trip.daysData[dayIndex].includes(activity.id)) return false;
    trip.daysData[dayIndex].push(activity.id);
    trip.activities[activity.id] = activity;
    save(trip);
    return true;
  }

  function removeActivity(trip, activityId) {
    let removed = false;
    trip.daysData = (trip.daysData || []).map(day => {
      const before = day.length;
      const next = day.filter(id => id !== activityId);
      if (next.length !== before) removed = true;
      return next;
    });
    if (removed) {
      // Clean up cache if no longer referenced
      const ids = getActivityIds(trip);
      if (!ids.has(activityId)) delete trip.activities[activityId];
      save(trip);
    }
    return removed;
  }

  function moveActivity(trip, activityId, fromDay, toDay) {
    if (!trip.daysData[fromDay] || !trip.daysData[toDay]) return false;
    trip.daysData[fromDay] = trip.daysData[fromDay].filter(id => id !== activityId);
    if (!trip.daysData[toDay].includes(activityId)) trip.daysData[toDay].push(activityId);
    save(trip);
    return true;
  }

  function setDays(trip, days) {
    days = Math.max(1, Math.min(60, parseInt(days, 10) || 1));
    trip.days = days;
    while (trip.daysData.length < days) trip.daysData.push([]);
    while (trip.daysData.length > days) {
      const removed = trip.daysData.pop() || [];
      // Drop dangling activity cache entries
      removed.forEach(id => {
        if (!getActivityIds(trip).has(id)) delete trip.activities[id];
      });
    }
    save(trip);
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  Orbitrip.storage = {
    load, save, addActivity, removeActivity, moveActivity, setDays, clear,
    getActivityIds, defaultTrip
  };
})();