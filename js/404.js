/* ===== 404 PAGE: SUGGEST POSTS ===== */
const suggestionGrid = document.getElementById('errorSuggestions');

if (suggestionGrid) {
  // Pick 3 random posts (or first 3 if fewer)
  const shuffled = [...POSTS].sort(() => 0.5 - Math.random());
  const suggestions = shuffled.slice(0, 3);

  suggestionGrid.innerHTML = suggestions.map(cardHTML).join('');

  // Observe the injected cards for reveal animation
  if (typeof observeReveals === 'function') {
    observeReveals(suggestionGrid);
  } else {
    // Fallback: just add the class
    suggestionGrid.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
}