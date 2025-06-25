document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".unit-tab").forEach(tab => {
    const raw = tab.dataset.json || "";
    const files = raw.split(",").map(f => f.trim()).filter(f => f);
    if (files.length === 0) return;

    Promise.all(files.map(file =>
      fetch(file)
        .then(res => res.json())
        .catch(() => [])
    ))
    .then(results => {
      const total = results.reduce((sum, arr) =>
        sum + (Array.isArray(arr) ? arr.length : 0),
      0);
      tab.textContent += ` (${total} Questions)`;
    })
    .catch(() => {
      tab.textContent += ` (Unavailable)`;
    });
  });
});
