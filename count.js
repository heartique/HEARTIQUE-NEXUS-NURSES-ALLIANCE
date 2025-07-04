document.addEventListener("DOMContentLoaded", () => {
  let paperOneTotal = 0;
  let paperTwoTotal = 0;
  let totalNew = 0;
  let soundPlayed = false;
  const notifySound = new Audio("notify.mp3");

  // Global badge
  const globalBadge = document.createElement("div");
  globalBadge.id = "global-badge";
  Object.assign(globalBadge.style, {
    position: "fixed",
    top: "10px",
    left: "10px",
    background: "crimson",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px",
    boxShadow: "0 0 8px rgba(0,0,0,0.3)",
    zIndex: 9999,
    display: "none"
  });
  document.body.appendChild(globalBadge);

  const showPopup = (message) => {
    const popup = document.createElement("div");
    popup.textContent = message;
    Object.assign(popup.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#333",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      zIndex: 9999
    });
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 4000);
  };

  const createBadge = (count) => {
    const badge = document.createElement("span");
    badge.className = "unit-badge";
    badge.textContent = count;
    Object.assign(badge.style, {
      display: "inline-block",
      marginLeft: "6px",
      padding: "3px 7px",
      background: "red",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "11px",
      fontWeight: "bold",
      animation: "pulse 1s infinite alternate"
    });
    return badge;
  };

  let paperOneNew = 0;
  let paperTwoNew = 0;

  document.querySelectorAll(".unit-tab").forEach(tab => {
    const raw = tab.dataset.json || "";
    const files = raw.split(",").map(f => f.trim()).filter(f => f);
    if (files.length === 0) return;

   Promise.all(files.map(file =>
  fetch(file)
    .then(res => res.json())
    .catch(() => [])
))

    ))
    .then(results => {
      const count = results.reduce((sum, arr) =>
        sum + (Array.isArray(arr) ? arr.length : 0), 0);
      
      // Append count
      tab.textContent += ` (${count} Questions)`;

      // Paper One total
      if (tab.classList.contains("paper-one")) {
        paperOneTotal += count;
        const paperOneTabs = document.querySelectorAll(".paper-one");
        tab.setAttribute('data-counted', 'yes');
        if (document.querySelectorAll(".paper-one[data-counted]").length === paperOneTabs.length) {
          const title = document.getElementById("paper-one-title");
          if (title) {
            title.textContent = `📘 Paper One Units – Total: ${paperOneTotal} Questions`;
            if (paperOneNew > 0) {
              const badge = document.createElement("span");
              badge.textContent = `🔴 ${paperOneNew} NEW`;
              Object.assign(badge.style, {
                marginLeft: "8px",
                background: "crimson",
                color: "#fff",
                padding: "3px 8px",
                fontSize: "12px",
                borderRadius: "15px",
                fontWeight: "bold",
                animation: "pulse 1s infinite alternate"
              });
              title.appendChild(badge);
            }
          }
        }
      }

      // Paper Two total
      if (tab.classList.contains("paper-two")) {
        paperTwoTotal += count;
        const paperTwoTabs = document.querySelectorAll(".paper-two");
        tab.setAttribute('data-counted', 'yes');
        if (document.querySelectorAll(".paper-two[data-counted]").length === paperTwoTabs.length) {
          const title = document.getElementById("paper-two-title");
          if (title) {
            title.textContent = `📘 Paper Two Units – Total: ${paperTwoTotal} Questions`;
            if (paperTwoNew > 0) {
              const badge = document.createElement("span");
              badge.textContent = `🔴 ${paperTwoNew} NEW`;
              Object.assign(badge.style, {
                marginLeft: "8px",
                background: "crimson",
                color: "#fff",
                padding: "3px 8px",
                fontSize: "12px",
                borderRadius: "15px",
                fontWeight: "bold",
                animation: "pulse 1s infinite alternate"
              });
              title.appendChild(badge);
            }
          }
        }
      }

      // 🔴 NEW DETECTION
      const stored = parseInt(localStorage.getItem(`qcount_${raw}`)) || 0;
      const diff = count - stored;

      if (diff > 0) {
        totalNew += diff;

        if (tab.classList.contains("paper-one")) {
          paperOneNew += diff;
        }
        if (tab.classList.contains("paper-two")) {
          paperTwoNew += diff;
        }

        const badge = createBadge(diff);
        tab.appendChild(badge);

        if (!soundPlayed) {
          notifySound.play().catch(() => {});
          soundPlayed = true;
        }

        showPopup(`🆕 ${diff} new question(s) in: ${tab.textContent.trim()}`);
      }

      tab.addEventListener("click", () => {
        localStorage.setItem(`qcount_${raw}`, count);
        const b = tab.querySelector(".unit-badge");
        if (b) b.remove();
        setTimeout(() => location.reload(), 100); // refresh to update total
      });
    })
    .catch(() => {
      tab.textContent += ` (Unavailable)`;
    });
  });

  // Show total global badge
  setTimeout(() => {
    if (totalNew > 0) {
      globalBadge.style.display = "block";
      globalBadge.textContent = `🔔 ${totalNew} new question(s)`;
    }
  }, 1200);
});

  // Reset button logic with confirmation and sound
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmReset = confirm("⚠️ This will mark all units as unread and reset your quiz progress.\n\nDo you want to continue?");
      if (!confirmReset) return;

      const sound = new Audio("notify.mp3");
      sound.play().catch(() => {}); // In case autoplay is blocked

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("qcount_")) {
          localStorage.removeItem(key);
        }
      });

      setTimeout(() => location.reload(), 500); // Let sound play before reload
    });
  }
