document.addEventListener("DOMContentLoaded", () => {
  let paperOneTotal = 0;
  let paperTwoTotal = 0;

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

        const paperOneTabs = document.querySelectorAll(".paper-one");
        tab.setAttribute('data-counted', 'yes');
        if (document.querySelectorAll(".paper-one[data-counted]").length === paperOneTabs.length) {
          const title = document.getElementById("paper-one-title");
          if (title) title.textContent += ` – Total: ${paperOneTotal} Questions`;
        }
      }

      // Sum for Paper Two
      if (tab.classList.contains("paper-two")) {
        paperTwoTotal += count;

        const paperTwoTabs = document.querySelectorAll(".paper-two");
        tab.setAttribute('data-counted', 'yes');
        if (document.querySelectorAll(".paper-two[data-counted]").length === paperTwoTabs.length) {
          const title = document.getElementById("paper-two-title");
          if (title) title.textContent += ` – Total: ${paperTwoTotal} Questions`;
        }
      }
    })
    .catch(() => {
      tab.textContent += ` (Unavailable)`;
    });
  });
});
