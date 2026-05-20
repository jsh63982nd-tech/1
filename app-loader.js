(() => {
  const request = new XMLHttpRequest();
  request.open("GET", "app.js?v=14", false);
  request.send(null);

  let source = request.responseText;

  function replaceSection(startMarker, endMarker, replacement) {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start);
    if (start === -1 || end === -1) {
      return;
    }
    source = `${source.slice(0, start)}${replacement}${source.slice(end)}`;
  }

  if (!source.includes("window.nativeVisibleRenderReady")) {
    replaceSection(
      "function getRecommendedQuestions() {",
      "\nfunction renderStats()",
      `function getRecommendedQuestions() {
  const today = todayKey();
  const subjectPattern = /(송전|배전|변전|계통|전압|전류|전력|케이블|접지|차단|계전|보호|고장|무효|조류|안정도|HVDC|FACTS|SVC|STATCOM)/i;

  return state.questions
    .filter((item) => !item.reviews.some((review) => review.date.slice(0, 10) === today))
    .map((item, index) => {
      const haystack = \`\${item.category || ""} \${item.keyword || ""} \${item.question || ""}\`;
      const subjectScore = subjectPattern.test(haystack) ? 12 : 0;
      const weakScore = item.status === "weak" ? 35 : 0;
      const unseenScore = item.status === "unseen" ? 24 : 0;
      const starredScore = item.starred ? 8 : 0;
      const score = weakScore + unseenScore + starredScore + subjectScore;
      const primaryKeyword = keywordCorrections.get(item.id) || item.keyword || item.category || "기출";
      const reasonParts = [];
      if (item.status === "weak") {
        reasonParts.push("취약 표시");
      } else if (item.status === "unseen") {
        reasonParts.push("미회독");
      }
      if (subjectScore) {
        reasonParts.push("송배전 핵심");
      }
      return {
        item,
        score,
        primaryKeyword,
        frequency: { label: primaryKeyword, levelKey: item.status === "weak" ? "high" : "medium" },
        reason: reasonParts.join(" · "),
        index
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2);
}
`
    );

    replaceSection(
      "function renderAll() {",
      "\nfunction updateQuestion",
      `function activeViewName() {
  const activeView = [...elements.views].find((view) => view.classList.contains("active"));
  return activeView?.id.replace(/View$/, "") || "home";
}

function renderVisibleView(viewName = activeViewName()) {
  if (viewName === "study") {
    renderList();
    renderDetail();
    return;
  }
  if (viewName === "add") {
    renderRegisteredList();
    return;
  }
  if (viewName === "frequent") {
    renderFrequentProblems();
    return;
  }
  if (viewName === "subject") {
    renderSubjectView();
    return;
  }
  if (viewName === "stats") {
    renderStats();
    return;
  }
  renderHome();
}

function renderAll() {
  renderCategoryFilter();
  renderFrequentSubjectFilter();
  renderVisibleView();
}

window.nativeVisibleRenderReady = true;
`
    );

    replaceSection(
      "function activateView(viewName, activeNavItem = null) {",
      "\nfunction openStudyWithStatus",
      `function activateView(viewName, activeNavItem = null) {
  elements.navItems.forEach((nav) => {
    const isActive = activeNavItem
      ? nav === activeNavItem
      : nav.dataset.view === viewName && !nav.dataset.subject;
    nav.classList.toggle("active", isActive);
  });
  elements.views.forEach((view) => view.classList.toggle("active", view.id === \`\${viewName}View\`));
  elements.toolbar.classList.toggle("hidden", viewName !== "study");
  renderVisibleView(viewName);
}
`
    );
  }

  document.write(`<script>${source.replace(/<\/script/gi, "<\\/script")}<\/script>`);
})();
