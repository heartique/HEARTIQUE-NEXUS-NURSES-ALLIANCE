<script>
  const fileList = [
    { name: "Part 1", file: "communityhealth.json" },
    { name: "Part 2", file: "communityhealth1.json" },
    { name: "Part 3", file: "communityhealth2.json" },
    { name: "Part 4", file: "communityhealth3.json" },
    { name: "Part 5", file: "communityhealth4.json" },
    { name: "Part 6", file: "communityhealth5.json" }
  ];

  const tabsDiv = document.getElementById('quiz-tabs');
  const container = document.getElementById('quiz-container');
  const resultDiv = document.getElementById('result');

  // Load tabs
  fileList.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = item.name;
    btn.onclick = () => {
      const previousFile = document.querySelector('.tab-btn.active')?.textContent;
      if (previousFile && window.lastScoreData) {
        showScorePopup(previousFile, window.lastScoreData.score, window.lastScoreData.total);
      }
      loadQuiz(item.file, btn);
    };
    tabsDiv.appendChild(btn);
    if (i === 0) btn.click(); // load first tab by default
  });

  function loadQuiz(file, activeBtn) {
    container.innerHTML = '';
    resultDiv.innerHTML = '';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    let score = 0;
    let total = 0;
    const progressKey = `progress_${file}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    const filterOn = document.getElementById('filter-unanswered')?.checked || false;
    window.lastScoreData = { score: 0, total: 0 };

    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then(data => {
        total = data.length;

        const normalize = (q) => {
          const question = q.question || q.q || q.title || q.ques || "Untitled question";
          const options = q.options || q.option || q.choices || {};
          let answer = q.answer || q.answers || q.correct || q.key || "";
          const explanation = q.explanation || q.reason || q.why || "";
          const additional = q.additional || q.notes || q.more || "";

          const match = answer.match(/\(?([A-D])\)?/i);
          if (match) answer = match[1].toUpperCase();

          return { question, options, answer, explanation, additional };
        };

        const progressCounter = document.createElement('div');
        progressCounter.id = 'progress-counter';
        progressCounter.style.textAlign = 'right';
        progressCounter.style.fontWeight = 'bold';
        progressCounter.style.marginBottom = '10px';
        container.appendChild(progressCounter);

        function updateProgressDisplay() {
          const completed = Object.keys(savedProgress).length;
          progressCounter.innerHTML = `🧮 Progress: ${completed} / ${total} questions answered`;
        }

        data.forEach((raw, index) => {
          const q = normalize(raw);
          const qid = `Q${index}`;

          if (filterOn && savedProgress[qid]) return;

          const div = document.createElement('div');
          div.className = 'question-box';
          div.innerHTML = `<strong>Q${index + 1}:</strong><br>${q.question.replace(/\n/g, "<br>")}<br><br>`;

          Object.entries(q.options).forEach(([key, value]) => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = `${key}) ${value}`;

            if (savedProgress[qid]) {
              btn.disabled = true;
              if (key === savedProgress[qid].selected) {
                if (key === q.answer) {
                  btn.classList.add('highlight-correct');
                } else {
                  btn.classList.add('highlight-wrong');
                }
              }
              if (key === q.answer) {
                btn.classList.add('highlight-correct');
              }
            }

            btn.onclick = () => {
              div.querySelectorAll('button').forEach(b => b.disabled = true);
              const result = document.createElement('div');

              if (key === q.answer) {
                result.innerHTML = `<p class="correct">✅ Correct!</p><p>${q.explanation.replace(/\n/g, "<br>")}</p>`;
                score++;
                btn.classList.add('highlight-correct');
              } else {
                result.innerHTML = `<p class="wrong">❌ Wrong!</p><p>Correct is ${q.answer}) ${q.options[q.answer]}.<br>${q.explanation.replace(/\n/g, "<br>")}</p>`;
                btn.classList.add('highlight-wrong');
                div.querySelectorAll('button').forEach(b => {
                  if (b.textContent.startsWith(q.answer + ")")) {
                    b.classList.add('highlight-correct');
                  }
                });
              }

              if (q.additional) {
                const extra = document.createElement('div');
                extra.className = 'additional';
                extra.innerHTML = `📌 ${q.additional.replace(/\n/g, "<br>")}`;
                result.appendChild(extra);
              }

              savedProgress[qid] = { selected: key };
              localStorage.setItem(progressKey, JSON.stringify(savedProgress));

              div.appendChild(result);
              updateProgressDisplay();

              if (Object.keys(savedProgress).length === total) {
                showFinalResult(score, total);
              }

              window.lastScoreData = { score, total };
            };

            div.appendChild(btn);
            div.appendChild(document.createElement('br'));
          });

          container.appendChild(div);
        });

        updateProgressDisplay();
      })
      .catch(() => {
        container.innerHTML = `<p style="color:red;text-align:center;">⚠️ Couldn't load <strong>${file}</strong>. Make sure it exists and is a valid JSON file.</p>`;
      });
  }

  function showFinalResult(score = 0, total = 0) {
    const percent = total ? Math.round((score / total) * 100) : 0;
    let reaction = percent >= 90 ? "🌟 Excellent!" :
                   percent >= 70 ? "🙂 Fair effort!" :
                   percent >= 50 ? "😐 Needs more review." :
                                   "😢 Keep going—you got this!";

    document.getElementById('result').innerHTML =
      `You got <strong>${score}</strong> out of <strong>${total}</strong> (${percent}%)<br><div class="reaction">${reaction}</div>`;
  }

  function showScorePopup(name, score, total) {
    const popup = document.getElementById('score-popup');
    const percent = total ? Math.round((score / total) * 100) : 0;
    popup.innerHTML = `🎉 You had ${score} / ${total} on ${name} (${percent}%)`;
    popup.style.display = 'block';
    popup.style.animation = 'slideFade 3s ease forwards';
    setTimeout(() => {
      popup.style.display = 'none';
      popup.style.animation = '';
    }, 3000);
  }

  document.getElementById('reset-progress').onclick = () => {
    const currentFile = document.querySelector('.tab-btn.active').textContent;
    const match = fileList.find(f => f.name === currentFile);
    if (match) {
      localStorage.removeItem(`progress_${match.file}`);
      alert("Progress cleared! Reloading quiz...");
      loadQuiz(match.file, document.querySelector('.tab-btn.active'));
    }
  };

  document.getElementById('filter-unanswered').onchange = () => {
    const currentFile = document.querySelector('.tab-btn.active').textContent;
    const match = fileList.find(f => f.name === currentFile);
    if (match) {
      loadQuiz(match.file, document.querySelector('.tab-btn.active'));
    }
  };
</script>
