/**
 * explore.js — Logic for the Explore Activities landing page.
 */
(function () {
  'use strict';
  const Orbitrip = window.Orbitrip;
  const { activityCard, categoryRow, toast } = Orbitrip.components;

  // Filter state
  const state = {
    query: '',
    location: '',
    category: 'all',
    cost: 'any',
    maxDuration: 0,
    sort: 'relevance',
    view: 'grid'
  };

  let allResults = [];

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    renderCategories();
    bindEvents();
    refreshCartCount();
    runSearch();
  }

  function renderCategories() {
    const counts = Orbitrip.api.categoryCounts();
    const list = document.getElementById('cat-list');
    if (!list) return;
    list.innerHTML = Orbitrip.categories
      .map(c => categoryRow(c, counts[c.id] != null ? counts[c.id] : '', c.id === state.category))
      .join('');
  }

  function bindEvents() {
    const form = document.getElementById('search-form');
    const q = document.getElementById('q');
    const loc = document.getElementById('loc');
    const sort = document.getElementById('sort');
    const dur = document.getElementById('dur');
    const durHint = document.getElementById('dur-hint');
    const reset = document.getElementById('reset-filters');
    const emptyReset = document.getElementById('empty-reset');
    const grid = document.getElementById('grid');
    const seg = document.getElementById('cost-seg');
    const cats = document.getElementById('cat-list');
    const view = document.querySelectorAll('[data-view]');
    const cart = document.getElementById('open-cart');
    const tags = document.querySelectorAll('[data-quick]');

    form.addEventListener('submit', (e) => { e.preventDefault(); state.query = q.value; state.location = loc.value; runSearch(); });
    q.addEventListener('input', debounce(() => { state.query = q.value; runSearch(); }, 220));
    loc.addEventListener('input', debounce(() => { state.location = loc.value; runSearch(); }, 220));

    sort.addEventListener('change', () => { state.sort = sort.value; runSearch(); });
    dur.addEventListener('input', () => {
      const v = parseInt(dur.value, 10);
      state.maxDuration = v;
      durHint.textContent = v ? (v >= 12 ? '12+ hr' : `≤ ${v} hr`) : 'any';
      runSearch();
    });

    seg.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cost]');
      if (!btn) return;
      seg.querySelectorAll('button').forEach(b => b.classList.remove('seg__btn--active'));
      btn.classList.add('seg__btn--active');
      state.cost = btn.dataset.cost;
      runSearch();
    });

    cats.addEventListener('click', (e) => {
      const row = e.target.closest('[data-cat]');
      if (!row) return;
      state.category = row.dataset.cat;
      renderCategories();
      runSearch();
    });
    cats.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const row = e.target.closest('[data-cat]');
        if (row) { e.preventDefault(); state.category = row.dataset.cat; renderCategories(); runSearch(); }
      }
    });

    view.forEach(b => b.addEventListener('click', () => {
      view.forEach(x => x.classList.remove('iconbtn--active'));
      b.classList.add('iconbtn--active');
      state.view = b.dataset.view;
      document.getElementById('grid').classList.toggle('grid--list', state.view === 'list');
    }));

    reset.addEventListener('click', resetFilters);
    if (emptyReset) emptyReset.addEventListener('click', resetFilters);

    tags.forEach(t => t.addEventListener('click', () => {
      state.query = t.dataset.quick;
      q.value = t.dataset.quick;
      runSearch();
    }));

    grid.addEventListener('click', onGridClick);

    if (cart) cart.addEventListener('click', () => { window.location.href = '/itinerary.html'; });
  }

  function resetFilters() {
    state.query = ''; state.location = ''; state.category = 'all';
    state.cost = 'any'; state.maxDuration = 0; state.sort = 'relevance';
    document.getElementById('q').value = '';
    document.getElementById('loc').value = '';
    document.getElementById('sort').value = 'relevance';
    document.getElementById('dur').value = 0;
    document.getElementById('dur-hint').textContent = 'any';
    document.querySelectorAll('#cost-seg button').forEach(b => {
      b.classList.toggle('seg__btn--active', b.dataset.cost === 'any');
    });
    renderCategories();
    runSearch();
  }

  async function runSearch() {
    const grid = document.getElementById('grid');
    const empty = document.getElementById('empty');
    const loading = document.getElementById('loading');
    const counter = document.getElementById('result-count');

    grid.classList.add('hidden');
    empty.classList.add('hidden');
    loading.classList.remove('hidden');

    const results = await Orbitrip.api.search(state);
    allResults = results;
    loading.classList.add('hidden');

    if (!results.length) {
      empty.classList.remove('hidden');
      counter.textContent = '0 results';
      return;
    }

    const trip = Orbitrip.storage.load();
    const ids = Orbitrip.storage.getActivityIds(trip);
    grid.innerHTML = results.map(a => activityCard(a, { added: ids.has(a.id) })).join('');
    grid.classList.remove('hidden');
    counter.textContent = `${results.length} ${results.length === 1 ? 'experience' : 'experiences'}`;
  }

  function onGridClick(e) {
    const addBtn = e.target.closest('[data-action="toggle-add"]');
    if (addBtn) {
      e.stopPropagation();
      const id = addBtn.dataset.id;
      const a = Orbitrip.api.getById(id) || allResults.find(x => x.id === id);
      if (!a) return;
      const trip = Orbitrip.storage.load();
      const ids = Orbitrip.storage.getActivityIds(trip);
      if (ids.has(id)) {
        Orbitrip.storage.removeActivity(trip, id);
        addBtn.classList.remove('card__add--added');
        addBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        toast('Removed from itinerary');
      } else {
        Orbitrip.storage.addActivity(trip, 0, a);
        addBtn.classList.add('card__add--added');
        addBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>';
        toast('Added to your itinerary', 'ok');
      }
      refreshCartCount();
      return;
    }

    const card = e.target.closest('.card');
    if (card) {
      const id = card.dataset.id;
      const a = Orbitrip.api.getById(id) || allResults.find(x => x.id === id);
      if (a) Orbitrip.modal.open(a, { onChange: () => { runSearch(); refreshCartCount(); } });
    }
  }

  function refreshCartCount() {
    const trip = Orbitrip.storage.load();
    const ids = Orbitrip.storage.getActivityIds(trip);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = ids.size;
  }

  function debounce(fn, ms) {
    let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
  }
})();