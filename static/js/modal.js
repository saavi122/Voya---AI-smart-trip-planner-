/**
 * modal.js — Reusable activity preview modal.
 * Renders into #modal-root and manages focus/escape.
 */
(function () {
  'use strict';
  const Orbitrip = window.Orbitrip || (window.Orbitrip = {});
  const { escapeHtml, categoryLabel, priceLabel, toast } = Orbitrip.components;

  let lastFocus = null;

  function open(activity, ctx = {}) {
    if (!activity) return;
    lastFocus = document.activeElement;
    const root = document.getElementById('modal-root');
    if (!root) return;

    const trip = Orbitrip.storage.load();
    const ids = Orbitrip.storage.getActivityIds(trip);
    const isAdded = ids.has(activity.id);
    const price = priceLabel(activity);

    root.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(activity.title)}" data-testid="activity-modal">
        <div class="modal__backdrop" data-close="modal"></div>
        <div class="modal__panel" role="document">
          <button class="modal__close" data-close="modal" aria-label="Close" data-testid="modal-close-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="modal__hero">
            <img src="${escapeHtml(activity.imageLarge || activity.image)}" alt="${escapeHtml(activity.title)}" onerror="this.style.opacity=0.25;this.src='https://placehold.co/1400x700/181d2e/6b7290?text=Orbitrip';"/>
            <span class="modal__cat">${escapeHtml(categoryLabel(activity.category))}</span>
          </div>
          <div class="modal__body">
            <h2 class="modal__title">${escapeHtml(activity.title)}</h2>
            <div class="modal__loc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${escapeHtml(activity.location || (activity.city + ', ' + activity.country))}
            </div>
            <div class="modal__stats">
              <div class="modal__stat">
                <div class="modal__stat-label">Duration</div>
                <div class="modal__stat-value">${escapeHtml(activity.durationLabel)}</div>
              </div>
              <div class="modal__stat">
                <div class="modal__stat-label">Cost</div>
                <div class="modal__stat-value ${price.isFree ? 'modal__stat-value--teal' : ''}">${price.label}</div>
              </div>
              <div class="modal__stat">
                <div class="modal__stat-label">Best time</div>
                <div class="modal__stat-value">${escapeHtml(activity.bestTime || 'Year-round')}</div>
              </div>
              <div class="modal__stat">
                <div class="modal__stat-label">Group</div>
                <div class="modal__stat-value">${escapeHtml(activity.groupSize || 'Open')}</div>
              </div>
            </div>
            <p class="modal__desc">${escapeHtml(activity.longDescription || activity.description)}</p>
            ${activity.highlights && activity.highlights.length ? `
              <div class="modal__highlights">
                <h4>What's included</h4>
                <ul>${activity.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
              </div>` : ''}
            <div class="modal__cta">
              <button class="btn ${isAdded ? 'btn--ghost' : 'btn--primary'} btn--lg" data-modal-action="add" data-id="${escapeHtml(activity.id)}" data-testid="modal-add-btn">
                ${isAdded
                  ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg> In your itinerary'
                  : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to itinerary'}
              </button>
              <a class="btn btn--ghost btn--lg" href="/itinerary.html" data-testid="modal-view-trip">View trip →</a>
            </div>
          </div>
        </div>
      </div>`;

    // Bind events
    const modal = root.querySelector('.modal');
    modal.addEventListener('click', (e) => {
      const closeT = e.target.closest('[data-close="modal"]');
      if (closeT) close();
      const addBtn = e.target.closest('[data-modal-action="add"]');
      if (addBtn) {
        const id = addBtn.getAttribute('data-id');
        const act = Orbitrip.api.getById(id) || ctx.activity || activity;
        const trip = Orbitrip.storage.load();
        const idsNow = Orbitrip.storage.getActivityIds(trip);
        if (idsNow.has(id)) {
          Orbitrip.storage.removeActivity(trip, id);
          toast('Removed from itinerary');
        } else {
          // default to day 0
          Orbitrip.storage.addActivity(trip, 0, act);
          toast('Added to itinerary', 'ok');
        }
        if (typeof ctx.onChange === 'function') ctx.onChange();
        close();
      }
    });

    document.addEventListener('keydown', escListener);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = '';
    document.removeEventListener('keydown', escListener);
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch {}
    }
  }

  function escListener(e) {
    if (e.key === 'Escape') close();
  }

  Orbitrip.modal = { open, close };
})();