document.addEventListener("DOMContentLoaded", () => {
  let paperOneTotal = 0;

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
      const count = results.reduce((sum, arr) =>
        sum + (Array.isArray(arr) ? arr.length : 0), 0);
      tab.textContent += ` (${count} Questions)`;

      // Sum for Paper One
      if (tab.classList.contains("paper-one")) {
        paperOneTotal += count;

        // After all Paper One tabs are processed, update the heading
        const remaining = document.querySelectorAll(".paper-one").length;
        tab.setAttribute('data-counted', 'yes');
        if (document.querySelectorAll(".paper-one[data-counted]").length === remaining) {
          const title = document.getElementById("paper-one-title");
          if (title) title.textContent += ` – Total: ${paperOneTotal} Questions`;
        }
      }
    })
    .catch(() => {
      tab.textContent += ` (Unavailable)`;
    });
  });
});
