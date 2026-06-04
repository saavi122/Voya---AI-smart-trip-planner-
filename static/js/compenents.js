/**
 * components.js — Reusable HTML builders for activity card, tile, drawer item.
 * Pure functions returning HTML strings (Django-template-friendly idiom).
 */
(function () {
  'use strict';
  const Orbitrip = window.Orbitrip || (window.Orbitrip = {});

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function priceLabel(a) {
    if (!a.cost || a.costTier === 'free') return { label: 'Free', isFree: true };
    return { label: `$${a.cost}`, isFree: false };
  }

  function categoryLabel(id) {
    const c = (Orbitrip.categories || []).find(x => x.id === id);
    return c ? c.label : (id || 'Experience');
  }

  /** Activity grid card */
  function activityCard(a, opts = {}) {
    const { added = false } = opts;
    const price = priceLabel(a);
    const addedClass = added ? 'card__add--added' : '';
    const addedAria = added ? 'Remove from itinerary' : 'Add to itinerary';
    const addedIcon = added
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

    return `
      <article class="card" data-id="${escapeHtml(a.id)}" data-testid="activity-card-${escapeHtml(a.id)}">
        <div class="card__media">
          <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" loading="lazy" onerror="this.style.opacity=0.2;this.src='https://placehold.co/800x540/181d2e/6b7290?text=Orbitrip';" />
          <span class="card__cat-pill">${escapeHtml(categoryLabel(a.category))}</span>
          <button class="card__add ${addedClass}" data-action="toggle-add" data-id="${escapeHtml(a.id)}" aria-label="${addedAria}" data-testid="card-add-${escapeHtml(a.id)}">${addedIcon}</button>
          <span class="card__rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            ${a.rating} <span class="muted">(${a.reviews})</span>
          </span>
        </div>
        <div class="card__body">
          <h3 class="card__title">${escapeHtml(a.title)}</h3>
          <div class="card__location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(a.city || '')}${a.country ? ', ' + escapeHtml(a.country) : ''}
          </div>
          <div class="card__meta">
            <div class="card__meta-left">
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${escapeHtml(a.durationLabel)}</span>
            </div>
            <span class="card__price ${price.isFree ? 'card__price--free' : ''}">${price.label}</span>
          </div>
        </div>
      </article>`;
  }

  /** Drawer (search results) item */
  function drawerItem(a, opts = {}) {
    const { added = false } = opts;
    const price = priceLabel(a);
    const addLabel = added
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    return `
      <div class="drawer-item" data-id="${escapeHtml(a.id)}" data-testid="drawer-item-${escapeHtml(a.id)}">
        <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" loading="lazy" />
        <div>
          <h4>${escapeHtml(a.title)}</h4>
          <div class="meta">
            <span>${escapeHtml(a.city || '')}${a.country ? ', ' + escapeHtml(a.country) : ''}</span>
            <span>${escapeHtml(a.durationLabel)}</span>
            <span>${price.label}</span>
          </div>
        </div>
        <button class="add" data-action="drawer-add" data-id="${escapeHtml(a.id)}" aria-label="Add" data-testid="drawer-add-${escapeHtml(a.id)}" ${added ? 'style="background:var(--teal);"' : ''}>${addLabel}</button>
      </div>`;
  }

  /** Itinerary day tile */
  function dayTile(a) {
    const price = priceLabel(a);
    return `
      <div class="tile" data-id="${escapeHtml(a.id)}" data-testid="tile-${escapeHtml(a.id)}">
        <img class="tile__img" src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" loading="lazy" />
        <div class="tile__info">
          <h4 class="tile__title">${escapeHtml(a.title)}</h4>
          <div class="tile__meta">
            <span>${escapeHtml(categoryLabel(a.category))}</span>
            <span>${escapeHtml(a.durationLabel)}</span>
            <span class="tile__price">${price.label}</span>
          </div>
        </div>
        <div class="tile__actions">
          <button class="iconbtn" data-action="preview" data-id="${escapeHtml(a.id)}" title="Preview" data-testid="tile-preview-${escapeHtml(a.id)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="iconbtn" data-action="remove" data-id="${escapeHtml(a.id)}" title="Remove" data-testid="tile-remove-${escapeHtml(a.id)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
  }

  /** Category list row */
  function categoryRow(c, count, active) {
    return `
      <div class="cat-row ${active ? 'cat-row--active' : ''}" data-cat="${escapeHtml(c.id)}" role="button" tabindex="0" data-testid="cat-row-${escapeHtml(c.id)}">
        <div class="cat-row__name">
          <span class="cat-row__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${c.icon}"/></svg>
          </span>
          ${escapeHtml(c.label)}
        </div>
        <span class="cat-row__count">${count == null ? '' : count}</span>
      </div>`;
  }

  /** Toast helper */
  function toast(msg, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ` toast--${type}` : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.className = 'toast'; }, 2400);
  }

  Orbitrip.components = { activityCard, drawerItem, dayTile, categoryRow, escapeHtml, toast, priceLabel, categoryLabel };
})();