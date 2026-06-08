package kr.powerexam.review;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class MainActivity extends Activity {
    private final List<Question> questions = new ArrayList<>();
    private final Map<String, Integer> keywordCounts = new HashMap<>();
    private SharedPreferences prefs;
    private LinearLayout content;
    private String searchText = "";
    private String statusFilter = "all";
    private String frequentSubject = "송배전공학";

    private static final String[] SUBJECTS = {"송배전공학", "발전공학", "계통공학"};
    private static final String[] SONG_KEYWORDS = {
            "송전", "배전", "변전", "케이블", "전선", "피뢰", "접지", "차단", "계전", "분산형전원", "계통연계", "FRT", "전압", "고장"
    };
    private static final String[] GEN_KEYWORDS = {
            "발전", "발전기", "화력", "수력", "원자력", "태양광", "풍력", "터빈", "보일러", "수차", "ESS", "연료전지"
    };
    private static final String[] GRID_KEYWORDS = {
            "계통", "조류", "안정도", "주파수", "무효전력", "고조파", "전력시장", "예비력", "신뢰도", "HVDC", "STATCOM", "SVC"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("review-state", MODE_PRIVATE);
        loadQuestions();
        buildKeywordCounts();
        renderShell();
        renderHome();
    }

    private void renderShell() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(246, 247, 249));

        TextView title = text("발송배전기술사 기출회독", 22, true);
        title.setPadding(dp(18), dp(18), dp(18), dp(8));
        root.addView(title);

        HorizontalScrollView navScroll = new HorizontalScrollView(this);
        navScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout nav = new LinearLayout(this);
        nav.setOrientation(LinearLayout.HORIZONTAL);
        nav.setPadding(dp(12), dp(4), dp(12), dp(10));
        nav.addView(navButton("홈", v -> renderHome()));
        nav.addView(navButton("문제", v -> renderQuestions()));
        nav.addView(navButton("빈출", v -> renderFrequent()));
        nav.addView(navButton("통계", v -> renderStats()));
        navScroll.addView(nav);
        root.addView(navScroll);

        ScrollView scroll = new ScrollView(this);
        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(14), dp(8), dp(14), dp(28));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
    }

    private Button navButton(String label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextSize(15);
        button.setAllCaps(false);
        button.setOnClickListener(listener);
        button.setPadding(dp(12), 0, dp(12), 0);
        return button;
    }

    private void renderHome() {
        clear();
        int done = 0;
        int weak = 0;
        int starred = 0;
        for (Question q : questions) {
            if ("done".equals(status(q))) done++;
            if ("weak".equals(status(q))) weak++;
            if (starred(q)) starred++;
        }

        addSectionTitle("오늘 볼 것");
        addCard("전체 " + questions.size() + "문제\n완료 " + done + " · 취약 " + weak + " · 즐겨찾기 " + starred);
        addButton("미회독 시작", v -> {
            statusFilter = "unseen";
            renderQuestions();
        });
        addButton("취약 문제 보기", v -> {
            statusFilter = "weak";
            renderQuestions();
        });

        addSectionTitle("추천 문제 2개");
        for (Question q : recommended()) {
            Button b = listButton(q.round + " · " + keyword(q) + "\n" + displayQuestion(q.question));
            b.setOnClickListener(v -> renderDetail(q));
            content.addView(b);
        }
    }

    private void renderQuestions() {
        clear();
        addSectionTitle("문제풀이");
        EditText search = new EditText(this);
        search.setHint("키워드, 회차, 문제 검색");
        search.setSingleLine(true);
        search.setText(searchText);
        search.setPadding(dp(12), dp(8), dp(12), dp(8));
        content.addView(search);
        search.addTextChangedListener(new TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchText = s.toString();
                renderQuestionRows();
            }
            public void afterTextChanged(Editable s) {}
        });

        LinearLayout filters = new LinearLayout(this);
        filters.setOrientation(LinearLayout.HORIZONTAL);
        String[] labels = {"all:전체", "unseen:미회독", "weak:취약", "done:완료", "starred:별표"};
        for (String item : labels) {
            String[] parts = item.split(":");
            Button b = navButton(parts[1], v -> {
                statusFilter = parts[0];
                renderQuestions();
            });
            filters.addView(b);
        }
        content.addView(filters);
        hideKeyboard(search);
        renderQuestionRows();
    }

    private void renderQuestionRows() {
        while (content.getChildCount() > 3) {
            content.removeViewAt(3);
        }
        List<Question> rows = filteredQuestions();
        addMuted(rows.size() + "문제");
        int limit = Math.min(rows.size(), 160);
        for (int i = 0; i < limit; i++) {
            Question q = rows.get(i);
            Button b = listButton(q.round + " · " + keyword(q) + " · " + statusLabel(q) + "\n" + displayQuestion(q.question));
            b.setOnClickListener(v -> renderDetail(q));
            content.addView(b);
        }
        if (rows.size() > limit) {
            addMuted("검색어를 입력하면 나머지 문제를 더 좁혀볼 수 있습니다.");
        }
    }

    private void renderDetail(Question q) {
        clear();
        addButton("목록으로", v -> renderQuestions());
        addSectionTitle(q.round);
        addMuted(q.category + " · " + keyword(q) + " · " + statusLabel(q));
        addCard(displayQuestion(q.question));

        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        actions.addView(navButton("완료", v -> setStatus(q, "done")));
        actions.addView(navButton("취약", v -> setStatus(q, "weak")));
        actions.addView(navButton("미회독", v -> setStatus(q, "unseen")));
        actions.addView(navButton(starred(q) ? "별표 해제" : "별표", v -> {
            prefs.edit().putBoolean("star_" + q.id, !starred(q)).apply();
            renderDetail(q);
        }));
        content.addView(actions);

        addSectionTitle("메모");
        EditText memo = new EditText(this);
        memo.setMinLines(4);
        memo.setText(prefs.getString("memo_" + q.id, ""));
        content.addView(memo);
        addButton("메모 저장", v -> {
            prefs.edit().putString("memo_" + q.id, memo.getText().toString()).apply();
            hideKeyboard(memo);
        });

        addSectionTitle("답안 키워드");
        addCard(studyKeywords(q));
    }

    private void renderFrequent() {
        clear();
        addSectionTitle("과목별 빈출문제");
        LinearLayout subjects = new LinearLayout(this);
        subjects.setOrientation(LinearLayout.HORIZONTAL);
        for (String subject : SUBJECTS) {
            subjects.addView(navButton(subject, v -> {
                frequentSubject = ((Button) v).getText().toString();
                renderFrequent();
            }));
        }
        content.addView(subjects);

        Map<String, Integer> counts = new HashMap<>();
        for (Question q : questions) {
            if (!matchesSubject(q, frequentSubject)) continue;
            String k = keyword(q);
            counts.put(k, counts.getOrDefault(k, 0) + 1);
        }
        List<Map.Entry<String, Integer>> rows = new ArrayList<>(counts.entrySet());
        rows.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        int limit = Math.min(rows.size(), 60);
        for (int i = 0; i < limit; i++) {
            Map.Entry<String, Integer> row = rows.get(i);
            Button b = listButton(row.getKey() + " · " + row.getValue() + "문제");
            b.setOnClickListener(v -> {
                searchText = row.getKey();
                statusFilter = "all";
                renderQuestions();
            });
            content.addView(b);
        }
    }

    private void renderStats() {
        clear();
        addSectionTitle("통계");
        Map<String, Integer> status = new HashMap<>();
        Map<String, Integer> category = new HashMap<>();
        for (Question q : questions) {
            status.put(status(q), status.getOrDefault(status(q), 0) + 1);
            category.put(q.category, category.getOrDefault(q.category, 0) + 1);
        }
        addCard("미회독 " + status.getOrDefault("unseen", 0) + "\n완료 " + status.getOrDefault("done", 0) + "\n취약 " + status.getOrDefault("weak", 0));
        addSectionTitle("분야");
        for (Map.Entry<String, Integer> row : category.entrySet()) {
            addMuted(row.getKey() + " · " + row.getValue() + "문제");
        }
    }

    private void setStatus(Question q, String value) {
        SharedPreferences.Editor editor = prefs.edit().putString("status_" + q.id, value);
        if ("done".equals(value)) {
            editor.putString("date_" + q.id, new SimpleDateFormat("yyyy-MM-dd", Locale.KOREA).format(new Date()));
        }
        editor.apply();
        renderDetail(q);
    }

    private List<Question> filteredQuestions() {
        String needle = normalize(searchText);
        List<Question> rows = new ArrayList<>();
        for (Question q : questions) {
            if ("starred".equals(statusFilter) && !starred(q)) continue;
            if (!"all".equals(statusFilter) && !"starred".equals(statusFilter) && !statusFilter.equals(status(q))) continue;
            String haystack = normalize(q.round + " " + q.category + " " + keyword(q) + " " + q.question);
            if (!needle.isEmpty() && !haystack.contains(needle)) continue;
            rows.add(q);
        }
        return rows;
    }

    private List<Question> recommended() {
        List<Question> rows = new ArrayList<>();
        for (Question q : questions) {
            if (matchesSubject(q, "송배전공학") && !"done".equals(status(q))) rows.add(q);
        }
        rows.sort((a, b) -> {
            int scoreA = ("weak".equals(status(a)) ? 100 : 0) + keywordCounts.getOrDefault(keyword(a), 1);
            int scoreB = ("weak".equals(status(b)) ? 100 : 0) + keywordCounts.getOrDefault(keyword(b), 1);
            return Integer.compare(scoreB, scoreA);
        });
        return rows.subList(0, Math.min(2, rows.size()));
    }

    private boolean matchesSubject(Question q, String subject) {
        String text = q.category + " " + q.keyword + " " + q.question;
        String[] words = SONG_KEYWORDS;
        if ("발전공학".equals(subject)) words = GEN_KEYWORDS;
        if ("계통공학".equals(subject)) words = GRID_KEYWORDS;
        for (String word : words) {
            if (text.contains(word)) return true;
        }
        return false;
    }

    private String studyKeywords(Question q) {
        Set<String> result = new HashSet<>();
        result.add(keyword(q));
        String text = q.question;
        String[] terms = {"정의", "원리", "특징", "장점", "단점", "문제점", "대책", "보호장치", "전압", "주파수", "고장전류", "단락용량", "FRT", "단독운전", "피뢰기", "접지"};
        for (String term : terms) {
            if (text.contains(term)) result.add(term);
        }
        return String.join(" · ", result);
    }

    private void loadQuestions() {
        try {
            InputStream input = getAssets().open("questions.json");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) out.write(buffer, 0, read);
            JSONArray array = new JSONArray(out.toString("UTF-8"));
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                questions.add(new Question(
                        obj.optString("id"),
                        obj.optString("round"),
                        obj.optString("category"),
                        obj.optString("keyword"),
                        obj.optString("question")
                ));
            }
        } catch (Exception error) {
            throw new IllegalStateException("questions.json load failed", error);
        }
    }

    private void buildKeywordCounts() {
        for (Question q : questions) {
            String key = keyword(q);
            keywordCounts.put(key, keywordCounts.getOrDefault(key, 0) + 1);
        }
    }

    private String keyword(Question q) {
        if ("고장파급방지장치".equals(q.keyword)) return "SPS";
        if ("전력계통안정화장치".equals(q.keyword)) return "PSS";
        if ("태양광인버터효율".equals(q.keyword)) return "태양광인버터";
        return q.keyword == null || q.keyword.isEmpty() ? "기타" : q.keyword;
    }

    private String status(Question q) {
        return prefs.getString("status_" + q.id, "unseen");
    }

    private boolean starred(Question q) {
        return prefs.getBoolean("star_" + q.id, false);
    }

    private String statusLabel(Question q) {
        String status = status(q);
        if ("done".equals(status)) return "완료";
        if ("weak".equals(status)) return "취약";
        return "미회독";
    }

    private String displayQuestion(String value) {
        return value.replace("설명하시오.", "설명하시오.").replaceAll("\\s+", " ").trim();
    }

    private String normalize(String value) {
        return value == null ? "" : value.replaceAll("\\s+", "").toLowerCase(Locale.KOREA);
    }

    private void clear() {
        content.removeAllViews();
    }

    private void addSectionTitle(String value) {
        TextView view = text(value, 19, true);
        view.setPadding(0, dp(14), 0, dp(8));
        content.addView(view);
    }

    private void addMuted(String value) {
        TextView view = text(value, 14, false);
        view.setTextColor(Color.rgb(91, 102, 117));
        view.setPadding(dp(4), dp(4), dp(4), dp(4));
        content.addView(view);
    }

    private void addCard(String value) {
        TextView view = text(value, 16, false);
        view.setLineSpacing(dp(3), 1.0f);
        view.setTextColor(Color.rgb(23, 33, 45));
        view.setBackgroundColor(Color.WHITE);
        view.setPadding(dp(14), dp(12), dp(14), dp(12));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 0, 0, dp(10));
        content.addView(view, params);
    }

    private void addButton(String label, View.OnClickListener listener) {
        Button b = listButton(label);
        b.setGravity(Gravity.CENTER);
        b.setOnClickListener(listener);
        content.addView(b);
    }

    private Button listButton(String label) {
        Button button = new Button(this);
        button.setText(label);
        button.setAllCaps(false);
        button.setTextSize(15);
        button.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
        button.setPadding(dp(12), dp(10), dp(12), dp(10));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 0, 0, dp(8));
        button.setLayoutParams(params);
        return button;
    }

    private TextView text(String value, int sp, boolean bold) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextSize(sp);
        view.setTextColor(Color.rgb(23, 33, 45));
        if (bold) view.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        return view;
    }

    private void hideKeyboard(View view) {
        view.postDelayed(() -> {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }, 100);
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density + 0.5f);
    }

    static class Question {
        final String id;
        final String round;
        final String category;
        final String keyword;
        final String question;

        Question(String id, String round, String category, String keyword, String question) {
            this.id = id;
            this.round = round;
            this.category = category;
            this.keyword = keyword;
            this.question = question;
        }
    }
}
