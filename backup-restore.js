(() => {
  const restoreJsonFile = document.querySelector("#restoreJsonFile");
  const restoreJson = document.querySelector("#restoreJson");
  const importMessage = document.querySelector("#importMessage");

  if (!restoreJsonFile || !restoreJson || !importMessage) {
    return;
  }

  function normalizeBackupQuestion(item) {
    if (!item || !String(item.question || "").trim()) {
      return null;
    }

    const status = ["unseen", "done", "weak"].includes(item.status) ? item.status : "unseen";
    const reviews = Array.isArray(item.reviews)
      ? item.reviews
          .filter((review) => review && review.date)
          .map((review) => ({
            date: String(review.date),
            label: String(review.label || "")
          }))
      : [];

    return {
      id: item.id || crypto.randomUUID(),
      round: String(item.round || ""),
      category: String(item.category || ""),
      question: String(item.question || "").trim(),
      status,
      starred: Boolean(item.starred),
      memo: String(item.memo || ""),
      reviews
    };
  }

  function parseBackupState(text) {
    const parsed = JSON.parse(text);
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.map(normalizeBackupQuestion).filter(Boolean)
      : [];

    if (!questions.length) {
      throw new Error("empty backup");
    }

    return {
      questions,
      dailyGoal: Number(parsed.dailyGoal) || 20
    };
  }

  restoreJson.addEventListener("click", async () => {
    const file = restoreJsonFile.files?.[0];
    if (!file) {
      importMessage.textContent = "가져올 백업 JSON 파일을 선택하세요.";
      return;
    }

    try {
      const restored = parseBackupState(await file.text());
      if (!confirm(`${restored.questions.length}문제와 회독 기록을 백업 파일 내용으로 교체할까요?`)) {
        return;
      }

      state.questions = restored.questions;
      state.dailyGoal = restored.dailyGoal;
      selectedId = state.questions[0]?.id ?? null;
      restoreJsonFile.value = "";
      saveState();
      renderAll();
      importMessage.textContent = `${restored.questions.length}문제와 회독 기록을 가져왔습니다.`;
    } catch (error) {
      importMessage.textContent = "백업 JSON 파일을 읽지 못했습니다. 내보낸 백업 파일인지 확인하세요.";
    }
  });
})();
