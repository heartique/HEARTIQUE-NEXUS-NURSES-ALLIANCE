document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".unit-tab");

  tabs.forEach(tab => {
    const jsonFile = tab.dataset.json;
    if (!jsonFile) return;

    fetch(jsonFile)
      .then(res => res.json())
      .then(data => {
        const count = data.length;
        tab.textContent += ` (${count} Questions)`;
      })
      .catch(() => {
        tab.textContent += ` (Unavailable)`;
      });
  });
});
