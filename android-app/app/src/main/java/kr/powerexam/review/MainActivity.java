package kr.powerexam.review;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.graphics.Color;
import android.net.Uri;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class MainActivity extends Activity {
    private static final int REQUEST_EXPORT_BACKUP = 1001;
    private static final int REQUEST_IMPORT_BACKUP = 1002;
    private static final String FILTER_ALL = "all";
    private static final String FILTER_UNSEEN = "unseen";
    private static final String FILTER_WEAK = "weak";
    private static final String FILTER_DONE = "done";
    private static final String FILTER_STARRED = "starred";
    private static final int SUBJECT_SONG = 1;
    private static final int SUBJECT_GEN = 2;
    private static final int SUBJECT_GRID = 4;
    private static final int QUESTION_SEARCH_SCHEMA = 2;

    private static final String[] SUBJECT_NAMES = {"송배전공학", "발전공학", "계통공학"};
    private static final String[] SONG_TERMS = {"송전", "배전", "변전", "케이블", "전선", "피뢰", "접지", "차단", "계전", "보호", "분산형전원", "계통연계", "FRT", "전압", "고장"};
    private static final String[] GEN_TERMS = {"발전", "발전기", "화력", "수력", "원자력", "태양광", "풍력", "터빈", "보일러", "수차", "ESS", "연료전지"};
    private static final String[] GRID_TERMS = {"계통", "조류", "안정도", "주파수", "무효전력", "고조파", "전력시장", "예비력", "신뢰도", "HVDC", "STATCOM", "SVC"};
    private static final String[][] LITERAL_SPACING_FIXES = {
            {"SpecialProtectionSystem", "Special Protection System"},
            {"EnergyStorageSystem", "Energy Storage System"},
            {"FaultRideThrough", "Fault Ride Through"},
            {"PowerSystemStabilizer", "Power System Stabilizer"},
            {"LoadFrequencyControl", "Load Frequency Control"},
            {"HighVoltageDirectCurrent", "High Voltage Direct Current"},
            {"UninterruptiblePowerSupply", "Uninterruptible Power Supply"},
            {"Governorfree", "Governor free"},
            {"GovernorFree", "Governor Free"},
            {"WoodPellet", "Wood Pellet"},
            {"Surgetank", "Surge tank"},
            {"KeySingleLineDiagram", "Key Single Line Diagram"},
            {"Partialdifferentialprotection", "Partial differential protection"},
            {"케이 블", "케이블"},
            {"통 (Cu)", "동(Cu)"},
            {"전압 변 통율", "전압 변동률"},
            {"셜명하시오", "설명하시오"},
            {"콘멘서", "콘덴서"},
            {"바깔지 름", "바깥지름"},
            {"k g!m", "kg/m"}
    };
    private static final String[][] TERM_SPACING_FIXES = {
            {"한시과전류보호계전기", "한시 과전류 보호계전기"},
            {"과전류보호계전기", "과전류 보호계전기"},
            {"고압전동기용과전류계전기", "고압전동기용 과전류계전기"},
            {"비율차동계전방식", "비율차동계전 방식"},
            {"보호계전기상호", "보호계전기 상호"},
            {"상호간의협조시간", "상호 간의 협조시간"},
            {"상호간의협조", "상호 간의 협조"},
            {"협조시간간격", "협조시간 간격"},
            {"시간협조항목", "시간협조 항목"},
            {"공장구내", "공장 구내"},
            {"급공장", "급 공장"},
            {"가공송전선로", "가공송전선로"},
            {"지중송전선로", "지중송전선로"},
            {"배전계통", "배전계통"},
            {"배전선로", "배전선로"},
            {"전력계통", "전력계통"},
            {"전력케이블", "전력케이블"},
            {"지중케이블", "지중케이블"},
            {"전력용변압기", "전력용 변압기"},
            {"단권변압기", "단권변압기"},
            {"3권선변압기", "3권선 변압기"},
            {"동기발전기", "동기발전기"},
            {"수차발전기", "수차발전기"},
            {"터빈발전기", "터빈발전기"},
            {"대용량발전기", "대용량 발전기"},
            {"예방진단시스템", "예방진단 시스템"},
            {"전력시스템", "전력 시스템"},
            {"전원공급", "전원 공급"},
            {"산업플랜트", "산업 플랜트"},
            {"기본신뢰도", "기본 신뢰도"},
            {"저압지중배전계통", "저압 지중배전계통"},
            {"구성방식", "구성 방식"},
            {"부하변동", "부하 변동"},
            {"부하응답모델", "부하응답 모델"},
            {"계통운영상", "계통 운영상"},
            {"동기투입", "동기 투입"},
            {"비동기투입", "비동기 투입"},
            {"용량선정사유", "용량 선정 사유"},
            {"기기사양", "기기 사양"},
            {"발생원인", "발생 원인"},
            {"전력편차", "전력 편차"},
            {"안정도계산법", "안정도 계산법"},
            {"작업순서", "작업 순서"},
            {"조압수조", "조압수조"},
            {"경제부하배분", "경제부하배분"},
            {"분산형전원", "분산형전원"},
            {"단독운전", "단독운전"},
            {"계통연계유지", "계통연계유지"},
            {"순시전압변동", "순시전압변동"},
            {"상시전압변동", "상시전압변동"},
            {"보호장치설치", "보호장치 설치"},
            {"과저전압계전기", "과·저전압계전기"},
            {"과저주파수계전기", "과·저주파수계전기"},
            {"역전력계전기", "역전력계전기"},
            {"수뢰부", "수뢰부"},
            {"보호각법", "보호각법"},
            {"회전구체법", "회전구체법"}
    };
    private static final String[][] REGEX_SPACING_RULES = {
            {"(\\d+(?:\\.\\d+)?)\\s*k\\s*V", "$1kV"},
            {"(\\d+(?:\\.\\d+)?)\\s*k\\s*A", "$1kA"},
            {"(\\d+(?:\\.\\d+)?)\\s*M\\s*W", "$1MW"},
            {"(\\d+(?:\\.\\d+)?)\\s*M\\s*V\\s*A", "$1MVA"},
            {"(\\d+(?:\\.\\d+)?)\\s*k\\s*V\\s*A", "$1kVA"},
            {"(\\d+(?:\\.\\d+)?)kV(?=[가-힣])", "$1kV "},
            {"(\\d+(?:\\.\\d+)?)kA(?=[가-힣])", "$1kA "},
            {"([,;:])(?=\\S)", "$1 "},
            {"([.!?])(?=[가-힣A-Za-z])", "$1 "},
            {"([가-힣])(\\d+[.)])", "$1 $2"},
            {"(\\))(?=[가-힣A-Za-z0-9])", "$1 "},
            {"([가-힣])([A-Z]{2,}[A-Za-z0-9/-]*)", "$1 $2"},
            {"([A-Za-z0-9])([가-힣])", "$1 $2"},
            {"또는(?=\\S)", "또는 "},
            {"그리고(?=\\S)", "그리고 "},
            {"다음(?=\\S)", "다음 "},
            {"아래(?=\\S)", "아래 "},
            {"각각(?=\\S)", "각각 "},
            {"대하여(?=\\S)", "대하여 "},
            {"관하여(?=\\S)", "관하여 "},
            {"비교하여(?=\\S)", "비교하여 "},
            {"제시하고(?=\\S)", "제시하고 "},
            {"설명하고(?=\\S)", "설명하고 "},
            {"사용하는(?=\\S)", "사용하는 "},
            {"적용하는(?=\\S)", "적용하는 "},
            {"설치된(?=\\S)", "설치된 "},
            {"발생하는(?=\\S)", "발생하는 "},
            {"유지하기(?=\\S)", "유지하기 "},
            {"방지하기(?=\\S)", "방지하기 "},
            {"위한(?=\\S)", "위한 "},
            {"따른(?=\\S)", "따른 "},
            {"([가-힣])및(?=[가-힣A-Za-z0-9])", "$1 및 "},
            {"([가-힣])시(?=(검토|고려|발생|보호|운전|조작|사용|적용|설치|접속|정정|계산|측정|선정|설계|주의|유의|공사|사고|전압|전류|계통))", "$1 시 "},
            {"([가-힣])의(?=(구조|형태|특징|기능|종류|역할|목적|용량|사양|차이점|문제점|대책|영향|관계|수식|동작|개요|원리|조건|항목|기준|절차|방법|설계|운영|운전|보호|계산|해석|적용|발생|구성|특성|정정|협조|접속|분리|제어|출력|부하|전압|전류|전력|주파수|리액턴스))", "$1의 "},
            {"([가-힣])에(?=(설치|사용|적용|연결|접속|보인|나타|미치|대한|대해|대하여|관한|관하여|따른|의한|있어|있어서|필요|포함|의해|비해|따라|발생|소요|속한))", "$1에 "},
            {"([가-힣])에서(?=(조압|주파수|수전|송전|배전|발전|변전|계통|선로|차단|보호|전압|전류|전력|고장|단락|사용|발생|나타|검토|정하는|설명|계산|운전|적용))", "$1에서 "},
            {"([가-힣])와(?=(화력|수력|원자력|풍력|태양광|UPS|ESS|송전|배전|변전|발전|계통|전압|전류|전력|보호|고장|단락|차단|변압|케이블|콘덴서|터빈|수차|보일러|피뢰|접지|주파수|경제|무효|유효|전기|기계|설비|방식|특징|문제점|대책))", "$1와 "},
            {"([가-힣])과(?=(화력|수력|원자력|풍력|태양광|UPS|ESS|송전|배전|변전|발전|계통|전압|전류|전력|보호|고장|단락|차단|변압|케이블|콘덴서|터빈|수차|보일러|피뢰|접지|주파수|경제|무효|유효|전기|기계|설비|방식|특징|문제점|대책))", "$1과 "},
            {"(\\d)(기|가지|배|상|선|차측|차|점|회|개)(?=[가-힣])", "$1$2 "}
    };

    private Db db;
    private LinearLayout root;
    private FrameLayout screen;
    private String query = "";
    private String statusFilter = FILTER_ALL;
    private String frequentSubject = SUBJECT_NAMES[0];
    private QuestionAdapter questionAdapter;
    private TextView questionCount;
    private JSONObject referenceIndex = new JSONObject();
    private JSONObject answerKeywordIndex = new JSONObject();
    private JSONObject summaryPointIndex = new JSONObject();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        db = new Db(this);
        db.seedIfNeeded();
        loadReferences();
        loadAnswerKeywords();
        loadSummaryPoints();
        buildShell();
        showHome();
    }

    private void buildShell() {
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(rgb(246, 247, 249));

        TextView title = text("발송배전기술사 기출회독", 21, true);
        title.setPadding(dp(16), dp(16), dp(16), dp(8));
        root.addView(title);

        HorizontalScrollView navScroll = new HorizontalScrollView(this);
        navScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout nav = row();
        nav.setPadding(dp(10), 0, dp(10), dp(8));
        nav.addView(navButton("홈", v -> showHome()));
        nav.addView(navButton("문제", v -> showQuestions()));
        nav.addView(navButton("빈출", v -> showFrequent()));
        nav.addView(navButton("통계", v -> showStats()));
        navScroll.addView(nav);
        root.addView(navScroll);

        screen = new FrameLayout(this);
        root.addView(screen, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
    }

    private void showHome() {
        LinearLayout body = paddedColumn();
        screen.removeAllViews();
        screen.addView(wrapScroll(body));

        Stats stats = db.stats();
        body.addView(section("학습 현황"));
        body.addView(learningCard("전체 " + stats.total + "문제\n미회독 " + stats.unseen + " · 완료 " + stats.done + " · 취약 " + stats.weak + " · 별표 " + stats.starred, 16, true));

        body.addView(section("바로 시작"));
        body.addView(actionButton("미회독 시작", v -> {
            statusFilter = FILTER_UNSEEN;
            showQuestions();
        }));
        body.addView(actionButton("취약 문제 보기", v -> {
            statusFilter = FILTER_WEAK;
            showQuestions();
        }));
        body.addView(actionButton("별표 문제 보기", v -> {
            statusFilter = FILTER_STARRED;
            showQuestions();
        }));

        body.addView(section("오늘 추천 5문제"));
        body.addView(muted("기록이 없으면 빈출/핵심 키워드 기준, 기록이 쌓이면 취약/별표/복습 주기를 반영합니다."));
        for (Question q : db.recommended(5)) {
            body.addView(recommendationButton(q, v -> showDetail(q.id)));
        }
    }

    private void showQuestions() {
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(12), dp(8), dp(12), dp(8));
        screen.removeAllViews();
        screen.addView(body);

        EditText search = new EditText(this);
        search.setHint("키워드, 회차, 문제 검색");
        search.setSingleLine(true);
        search.setText(query);
        search.setTextSize(15);
        search.setPadding(dp(12), dp(8), dp(12), dp(8));
        body.addView(search, new LinearLayout.LayoutParams(-1, -2));

        HorizontalScrollView filterScroll = new HorizontalScrollView(this);
        filterScroll.setHorizontalScrollBarEnabled(false);
        LinearLayout filters = row();
        addFilter(filters, FILTER_ALL, "전체");
        addFilter(filters, FILTER_UNSEEN, "미회독");
        addFilter(filters, FILTER_WEAK, "취약");
        addFilter(filters, FILTER_DONE, "완료");
        addFilter(filters, FILTER_STARRED, "별표");
        filterScroll.addView(filters);
        body.addView(filterScroll);

        questionCount = muted("");
        questionCount.setPadding(dp(4), dp(6), dp(4), dp(6));
        body.addView(questionCount);

        ListView list = new ListView(this);
        list.setDividerHeight(0);
        list.setCacheColorHint(Color.TRANSPARENT);
        questionAdapter = new QuestionAdapter(this);
        list.setAdapter(questionAdapter);
        list.setOnItemClickListener((parent, view, position, id) -> showDetail(questionAdapter.getItem(position).id));
        body.addView(list, new LinearLayout.LayoutParams(-1, 0, 1));

        search.addTextChangedListener(new TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void afterTextChanged(Editable s) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                query = s.toString();
                refreshQuestions();
            }
        });
        search.postDelayed(() -> hideKeyboard(search), 150);
        refreshQuestions();
    }

    private void refreshQuestions() {
        List<Question> rows = db.search(query, statusFilter, 300);
        questionAdapter.setRows(rows);
        questionCount.setText(rows.size() + "문제 표시" + (rows.size() >= 300 ? " · 키워드를 추가하면 더 정확합니다" : ""));
    }

    private void showDetail(String id) {
        Question q = db.find(id);
        if (q == null) {
            showQuestions();
            return;
        }

        LinearLayout detailRoot = new LinearLayout(this);
        detailRoot.setOrientation(LinearLayout.VERTICAL);
        detailRoot.setBackgroundColor(rgb(246, 247, 249));
        LinearLayout body = paddedColumn();
        screen.removeAllViews();
        screen.addView(detailRoot);
        detailRoot.addView(wrapScroll(body), new LinearLayout.LayoutParams(-1, 0, 1));

        body.addView(detailHeader(q));
        body.addView(learningCard(q.displayQuestion, 18, true));

        body.addView(section("답안 키워드"));
        body.addView(learningCard(studyKeywords(q), 15, false));

        String summary = summaryText(q.id);
        if (summary.length() > 0) {
            body.addView(section("교재 요약/암기 포인트"));
            body.addView(learningCard(summary, 15, false));
        }

        String reference = referenceText(q.id);
        if (reference.length() > 0) {
            body.addView(section("참고 페이지"));
            body.addView(learningCard(reference, 14, false));
        }

        body.addView(section("메모"));
        EditText memo = new EditText(this);
        memo.setMinLines(5);
        memo.setText(q.memo);
        memo.setTextSize(15);
        memo.setPadding(dp(12), dp(10), dp(12), dp(10));
        body.addView(memo, new LinearLayout.LayoutParams(-1, -2));
        body.addView(actionButton("메모 저장", v -> {
            db.setMemo(q.id, memo.getText().toString());
            hideKeyboard(memo);
        }));

        detailRoot.addView(studyActionBar(q), new LinearLayout.LayoutParams(-1, -2));
    }

    private void showFrequent() {
        LinearLayout body = paddedColumn();
        screen.removeAllViews();
        screen.addView(wrapScroll(body));

        body.addView(section("과목별 빈출문제"));
        LinearLayout subjects = row();
        for (String subject : SUBJECT_NAMES) {
            final String name = subject;
            subjects.addView(smallButton(name, v -> {
                frequentSubject = name;
                showFrequent();
            }));
        }
        body.addView(subjects);
        body.addView(muted(frequentSubject));

        for (KeywordRow row : db.frequentRows(subjectMask(frequentSubject), 80)) {
            Button button = actionButton(row.keyword + " · " + row.count + "문제", v -> {
                query = row.keyword;
                statusFilter = FILTER_ALL;
                showQuestions();
            });
            body.addView(button);
        }
    }

    private void showStats() {
        LinearLayout body = paddedColumn();
        screen.removeAllViews();
        screen.addView(wrapScroll(body));

        Stats stats = db.stats();
        body.addView(section("통계"));
        body.addView(card("전체 " + stats.total + "\n미회독 " + stats.unseen + "\n완료 " + stats.done + "\n취약 " + stats.weak + "\n별표 " + stats.starred));
        body.addView(section("과목 추정"));
        body.addView(card("송배전공학 " + db.subjectCount(SUBJECT_SONG) + "문제\n발전공학 " + db.subjectCount(SUBJECT_GEN) + "문제\n계통공학 " + db.subjectCount(SUBJECT_GRID) + "문제"));
        body.addView(section("백업"));
        body.addView(actionButton("회독 기록 백업 내보내기", v -> exportBackup()));
        body.addView(actionButton("회독 기록 백업 가져오기", v -> importBackup()));
    }

    private void exportBackup() {
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "power-exam-review-backup.json");
        startActivityForResult(intent, REQUEST_EXPORT_BACKUP);
    }

    private void importBackup() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        startActivityForResult(intent, REQUEST_IMPORT_BACKUP);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null || data.getData() == null) {
            return;
        }
        Uri uri = data.getData();
        try {
            if (requestCode == REQUEST_EXPORT_BACKUP) {
                writeBackup(uri);
                Toast.makeText(this, "백업을 저장했습니다.", Toast.LENGTH_SHORT).show();
            } else if (requestCode == REQUEST_IMPORT_BACKUP) {
                readBackup(uri);
                Toast.makeText(this, "백업을 가져왔습니다.", Toast.LENGTH_SHORT).show();
                showStats();
            }
        } catch (Exception error) {
            Toast.makeText(this, "백업 처리에 실패했습니다.", Toast.LENGTH_LONG).show();
        }
    }

    private void writeBackup(Uri uri) throws Exception {
        OutputStream output = getContentResolver().openOutputStream(uri);
        if (output == null) {
            throw new IllegalStateException("backup output unavailable");
        }
        output.write(db.exportStateJson().toString().getBytes("UTF-8"));
        output.close();
    }

    private void readBackup(Uri uri) throws Exception {
        InputStream input = getContentResolver().openInputStream(uri);
        if (input == null) {
            throw new IllegalStateException("backup input unavailable");
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        int read;
        while ((read = input.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
        input.close();
        db.importStateJson(new JSONObject(out.toString("UTF-8")));
    }

    private void loadReferences() {
        try {
            InputStream input = getAssets().open("references.json");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            input.close();
            JSONObject payload = new JSONObject(out.toString("UTF-8"));
            JSONObject refs = payload.optJSONObject("references");
            if (refs != null) {
                referenceIndex = refs;
            }
        } catch (Exception ignored) {
            referenceIndex = new JSONObject();
        }
    }

    private void loadAnswerKeywords() {
        try {
            InputStream input = getAssets().open("answer-keywords.json");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            input.close();
            JSONObject payload = new JSONObject(out.toString("UTF-8"));
            JSONObject keywords = payload.optJSONObject("keywords");
            if (keywords != null) {
                answerKeywordIndex = keywords;
            }
        } catch (Exception ignored) {
            answerKeywordIndex = new JSONObject();
        }
    }

    private void loadSummaryPoints() {
        try {
            InputStream input = getAssets().open("summary-points.json");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            input.close();
            JSONObject payload = new JSONObject(out.toString("UTF-8"));
            JSONObject summaries = payload.optJSONObject("summaries");
            if (summaries != null) {
                summaryPointIndex = summaries;
            }
        } catch (Exception ignored) {
            summaryPointIndex = new JSONObject();
        }
    }

    private String summaryText(String questionId) {
        JSONArray rows = summaryPointIndex.optJSONArray(questionId);
        if (rows == null || rows.length() == 0) {
            return "";
        }
        StringBuilder text = new StringBuilder();
        for (int i = 0; i < rows.length(); i++) {
            String point = rows.optString(i);
            if (point.length() == 0) continue;
            if (text.length() > 0) text.append("\n");
            text.append(i + 1).append(". ").append(point);
        }
        return text.toString();
    }

    private String referenceText(String questionId) {
        JSONArray rows = referenceIndex.optJSONArray(questionId);
        if (rows == null || rows.length() == 0) {
            return "";
        }
        StringBuilder text = new StringBuilder();
        for (int i = 0; i < rows.length(); i++) {
            JSONObject row = rows.optJSONObject(i);
            if (row == null) continue;
            if (text.length() > 0) text.append("\n\n");
            int start = row.optInt("pdfPageStart");
            int end = row.optInt("pdfPageEnd", start);
            text.append(row.optString("book", "참고자료"))
                    .append(" · PDF p.")
                    .append(start);
            if (end > start) {
                text.append("~").append(end);
            }
            String confidence = row.optString("confidence");
            if ("high".equals(confidence)) {
                text.append("\n신뢰도: 높음");
            } else if ("medium".equals(confidence)) {
                text.append("\n신뢰도: 보통");
            }
            JSONArray terms = row.optJSONArray("terms");
            if (terms != null && terms.length() > 0) {
                text.append("\n매칭 키워드: ");
                for (int t = 0; t < terms.length(); t++) {
                    if (t > 0) text.append(" · ");
                    text.append(terms.optString(t));
                }
            }
        }
        return text.toString();
    }

    private void addFilter(LinearLayout filters, String value, String label) {
        Button button = smallButton(label + (value.equals(statusFilter) ? " *" : ""), v -> {
            statusFilter = value;
            showQuestions();
        });
        filters.addView(button);
    }

    private Button questionButton(Question q, View.OnClickListener listener) {
        Button button = actionButton(q.round + " · " + q.keyword + " · " + statusLabel(q.status) + "\n" + q.displayQuestion, listener);
        button.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
        return button;
    }

    private Button recommendationButton(Question q, View.OnClickListener listener) {
        String reason = q.recommendationReason == null || q.recommendationReason.length() == 0 ? recommendationReason(q) : q.recommendationReason;
        Button button = actionButton(q.round + " · " + q.keyword + " · " + statusLabel(q.status) + "\n추천 이유: " + reason + "\n" + q.displayQuestion, listener);
        button.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
        return button;
    }

    private TextView detailHeader(Question q) {
        String value = q.round + "\n" + q.category + " · " + q.keyword + " · " + statusLabel(q.status) + (q.starred ? " · 별표" : "");
        TextView view = text(value, 14, true);
        view.setTextColor(rgb(47, 62, 80));
        view.setLineSpacing(dp(2), 1.0f);
        view.setPadding(0, dp(4), 0, dp(10));
        return view;
    }

    private LinearLayout studyActionBar(Question q) {
        LinearLayout bar = row();
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(dp(8), dp(8), dp(8), dp(8));
        bar.setBackgroundColor(Color.WHITE);
        addBarButton(bar, "목록", v -> showQuestions());
        addBarButton(bar, "미회독", v -> {
            db.setStatus(q.id, FILTER_UNSEEN);
            showDetail(q.id);
        });
        addBarButton(bar, "완료", v -> {
            db.setStatus(q.id, FILTER_DONE);
            showDetail(q.id);
        });
        addBarButton(bar, "취약", v -> {
            db.setStatus(q.id, FILTER_WEAK);
            showDetail(q.id);
        });
        addBarButton(bar, q.starred ? "별표 해제" : "별표", v -> {
            db.setStarred(q.id, !q.starred);
            showDetail(q.id);
        });
        return bar;
    }

    private void addBarButton(LinearLayout bar, String label, View.OnClickListener listener) {
        Button button = smallButton(label, listener);
        button.setTextSize(13);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(48), 1);
        params.setMargins(dp(3), 0, dp(3), 0);
        bar.addView(button, params);
    }

    private String studyKeywords(Question q) {
        JSONArray rows = answerKeywordIndex.optJSONArray(q.id);
        if (rows != null && rows.length() > 0) {
            List<String> terms = new ArrayList<>();
            for (int i = 0; i < rows.length(); i++) {
                String term = rows.optString(i);
                if (term.length() > 0) terms.add(term);
            }
            return String.join(" · ", terms);
        }
        Set<String> terms = new HashSet<>();
        terms.add(q.keyword);
        String text = q.question + " " + q.keyword;
        String[] candidates = {"정의", "원리", "특징", "장점", "단점", "문제점", "대책", "보호장치", "전압", "주파수", "고장전류", "단락용량", "FRT", "단독운전", "피뢰기", "접지", "계통연계", "무효전력"};
        for (String candidate : candidates) {
            if (text.contains(candidate)) terms.add(candidate);
        }
        return String.join(" · ", terms);
    }

    private String statusLabel(String status) {
        if (FILTER_DONE.equals(status)) return "완료";
        if (FILTER_WEAK.equals(status)) return "취약";
        return "미회독";
    }

    private String recommendationReason(Question q) {
        List<String> reasons = new ArrayList<>();
        if (FILTER_WEAK.equals(q.status)) {
            reasons.add("취약 표시");
        } else if (FILTER_UNSEEN.equals(q.status)) {
            reasons.add("미회독");
        } else if (FILTER_DONE.equals(q.status) && reviewAgeDays(q.reviewedAt) >= 7) {
            reasons.add("복습 주기");
        }
        if (q.starred) reasons.add("별표");
        if (q.frequency >= 3) reasons.add("빈출 키워드");
        if (hasCoreKeyword(q)) reasons.add("핵심 키워드");
        if (q.memo != null && q.memo.trim().length() > 0) reasons.add("메모 있음");
        if (reasons.isEmpty()) reasons.add("기본 추천");
        return String.join(" · ", reasons);
    }

    private boolean hasCoreKeyword(Question q) {
        String text = q.keyword + " " + q.question;
        String[] cores = {"보호", "계전", "전압", "고장", "단락", "접지", "피뢰", "안정도", "무효전력", "주파수", "발전기", "터빈", "보일러", "ESS", "분산형전원", "계통연계"};
        for (String core : cores) {
            if (text.contains(core)) return true;
        }
        return false;
    }

    private int reviewAgeDays(String reviewedAt) {
        if (reviewedAt == null || reviewedAt.length() == 0) return 999;
        try {
            Date reviewed = new SimpleDateFormat("yyyy-MM-dd", Locale.KOREA).parse(reviewedAt);
            if (reviewed == null) return 999;
            long diff = new Date().getTime() - reviewed.getTime();
            return (int) Math.max(0, diff / (1000L * 60L * 60L * 24L));
        } catch (Exception ignored) {
            return 999;
        }
    }

    private String cleanQuestion(String value) {
        String text = String.valueOf(value).replace('\u00a0', ' ').replaceAll("\\s+", " ").trim();
        for (String[] rule : LITERAL_SPACING_FIXES) {
            text = text.replace(rule[0], rule[1]);
        }
        for (String[] rule : REGEX_SPACING_RULES) {
            text = text.replaceAll(rule[0], rule[1]);
        }
        for (String[] rule : TERM_SPACING_FIXES) {
            text = text.replace(rule[0], rule[1]);
        }
        text = text
                .replaceAll("\\s+([,.;:!?])", "$1")
                .replaceAll("([,;:!?])(?=\\S)", "$1 ")
                .replaceAll("(\\d)\\.\\s+(\\d)", "$1.$2")
                .replaceAll("\\s{2,}", " ")
                .trim();
        return text;
    }

    private int subjectMask(String subject) {
        if ("발전공학".equals(subject)) return SUBJECT_GEN;
        if ("계통공학".equals(subject)) return SUBJECT_GRID;
        return SUBJECT_SONG;
    }

    private static int computeSubjectMask(String text) {
        int mask = 0;
        if (containsAny(text, SONG_TERMS)) mask |= SUBJECT_SONG;
        if (containsAny(text, GEN_TERMS)) mask |= SUBJECT_GEN;
        if (containsAny(text, GRID_TERMS)) mask |= SUBJECT_GRID;
        return mask == 0 ? SUBJECT_SONG : mask;
    }

    private static boolean containsAny(String text, String[] terms) {
        for (String term : terms) {
            if (text.contains(term)) return true;
        }
        return false;
    }

    private static String normalize(String value) {
        return String.valueOf(value)
                .replace('\u00a0', ' ')
                .replaceAll("[\\s\\-_/·.,;:()\\[\\]{}<>\"']", "")
                .toLowerCase(Locale.KOREA);
    }

    private List<String> searchTokens(String value) {
        List<String> tokens = new ArrayList<>();
        String whole = normalize(value);
        String[] parts = String.valueOf(value).trim().split("\\s+");
        if (parts.length <= 1 && !whole.isEmpty()) {
            tokens.add(whole);
        }
        for (String part : parts) {
            String token = normalize(part);
            if (token.length() > 0 && !tokens.contains(token)) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private String splitCompactKorean(String value) {
        return String.valueOf(value)
                .replace("과전류", " 과전류 ")
                .replace("보호", " 보호 ")
                .replace("계전기", " 계전기 ")
                .replace("변압기", " 변압기 ")
                .replace("송전", " 송전 ")
                .replace("배전", " 배전 ")
                .replace("발전", " 발전 ")
                .replace("계통", " 계통 ")
                .replace("전압", " 전압 ")
                .replace("전류", " 전류 ")
                .replace("고장", " 고장 ")
                .replace("접지", " 접지 ")
                .replace("피뢰", " 피뢰 ")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }

    private static String sqlLiteral(String value) {
        return String.valueOf(value).replace("'", "''");
    }

    private static String sqlLikeLiteral(String value) {
        return sqlLiteral(value).replace("%", "").replace("_", "");
    }

    private LinearLayout paddedColumn() {
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(14), dp(8), dp(14), dp(28));
        return body;
    }

    private LinearLayout row() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        return row;
    }

    private ScrollView wrapScroll(View view) {
        ScrollView scroll = new ScrollView(this);
        scroll.addView(view);
        return scroll;
    }

    private TextView section(String value) {
        TextView view = text(value, 19, true);
        view.setPadding(0, dp(14), 0, dp(8));
        return view;
    }

    private TextView muted(String value) {
        TextView view = text(value, 14, false);
        view.setTextColor(rgb(83, 94, 110));
        return view;
    }

    private TextView card(String value) {
        TextView view = text(value, 16, false);
        view.setLineSpacing(dp(3), 1.0f);
        view.setBackgroundColor(Color.WHITE);
        view.setPadding(dp(14), dp(12), dp(14), dp(12));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 0, 0, dp(10));
        view.setLayoutParams(params);
        return view;
    }

    private TextView learningCard(String value, int sp, boolean bold) {
        TextView view = text(value, sp, bold);
        view.setLineSpacing(dp(5), 1.08f);
        view.setBackgroundColor(Color.WHITE);
        view.setPadding(dp(16), dp(14), dp(16), dp(14));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.setMargins(0, 0, 0, dp(10));
        view.setLayoutParams(params);
        return view;
    }

    private Button navButton(String label, View.OnClickListener listener) {
        Button button = smallButton(label, listener);
        button.setMinWidth(dp(72));
        return button;
    }

    private Button smallButton(String label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        button.setAllCaps(false);
        button.setTextSize(14);
        button.setOnClickListener(listener);
        button.setPadding(dp(10), 0, dp(10), 0);
        return button;
    }

    private Button actionButton(String label, View.OnClickListener listener) {
        Button button = smallButton(label, listener);
        button.setTextSize(15);
        button.setGravity(Gravity.CENTER);
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
        view.setTextColor(rgb(23, 33, 45));
        if (bold) view.setTypeface(Typeface.DEFAULT_BOLD);
        return view;
    }

    private void hideKeyboard(View view) {
        InputMethodManager manager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        if (manager != null) manager.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density + 0.5f);
    }

    private int rgb(int r, int g, int b) {
        return Color.rgb(r, g, b);
    }

    private static class Question {
        String id;
        String round;
        String category;
        String keyword;
        String question;
        String status;
        boolean starred;
        String memo;
        String reviewedAt;
        int frequency;
        String displayQuestion;
        String recommendationReason;
    }

    private static class KeywordRow {
        String keyword;
        int count;
    }

    private static class Stats {
        int total;
        int unseen;
        int done;
        int weak;
        int starred;
    }

    private class QuestionAdapter extends BaseAdapter {
        private final Context context;
        private final List<Question> rows = new ArrayList<>();

        QuestionAdapter(Context context) {
            this.context = context;
        }

        void setRows(List<Question> next) {
            rows.clear();
            rows.addAll(next);
            notifyDataSetChanged();
        }

        public int getCount() {
            return rows.size();
        }

        public Question getItem(int position) {
            return rows.get(position);
        }

        public long getItemId(int position) {
            return position;
        }

        public View getView(int position, View convertView, android.view.ViewGroup parent) {
            LinearLayout box;
            TextView meta;
            TextView title;
            if (convertView == null) {
                box = new LinearLayout(context);
                box.setOrientation(LinearLayout.VERTICAL);
                box.setPadding(dp(12), dp(10), dp(12), dp(10));
                meta = text("", 12, false);
                meta.setTextColor(rgb(83, 94, 110));
                title = text("", 15, true);
                title.setPadding(0, dp(3), 0, 0);
                box.addView(meta);
                box.addView(title);
                box.setTag(new TextView[]{meta, title});
            } else {
                box = (LinearLayout) convertView;
                TextView[] views = (TextView[]) box.getTag();
                meta = views[0];
                title = views[1];
            }
            Question q = getItem(position);
            meta.setText(q.round + " · " + q.keyword + " · " + statusLabel(q.status) + (q.starred ? " · 별표" : ""));
            title.setText(q.displayQuestion);
            box.setBackgroundColor(position % 2 == 0 ? Color.WHITE : rgb(250, 251, 253));
            return box;
        }
    }

    private class Db extends SQLiteOpenHelper {
        Db(Context context) {
            super(context, "power_exam_review_v2.db", null, 2);
        }

        public void onCreate(SQLiteDatabase database) {
            ensureSchema(database);
        }

        public void onUpgrade(SQLiteDatabase database, int oldVersion, int newVersion) {
            database.execSQL("DROP TABLE IF EXISTS questions");
            database.execSQL("DROP TABLE IF EXISTS metadata");
            ensureSchema(database);
        }

        void seedIfNeeded() {
            SQLiteDatabase database = getWritableDatabase();
            JSONArray array;
            try {
                array = readAssetQuestions();
            } catch (Exception error) {
                throw new IllegalStateException("question asset read failed", error);
            }
            int existing = scalarInt(database, "SELECT COUNT(*) FROM questions");
            int schema = metadataInt(database, "questionSearchSchema");
            if (existing == array.length() && schema == QUESTION_SEARCH_SCHEMA) return;
            database.beginTransaction();
            try {
                rebuildQuestions(database, array);
                setMetadata(database, "questionSearchSchema", String.valueOf(QUESTION_SEARCH_SCHEMA));
                database.setTransactionSuccessful();
            } catch (Exception error) {
                throw new IllegalStateException("question seed failed", error);
            } finally {
                database.endTransaction();
            }
        }

        private void ensureSchema(SQLiteDatabase database) {
            database.execSQL("CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, round TEXT, category TEXT, keyword TEXT, question TEXT, search TEXT, subject INTEGER)");
            database.execSQL("CREATE TABLE IF NOT EXISTS state(id TEXT PRIMARY KEY, status TEXT, starred INTEGER, memo TEXT, reviewedAt TEXT)");
            database.execSQL("CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY, value TEXT)");
            database.execSQL("CREATE INDEX IF NOT EXISTS idx_questions_search ON questions(search)");
            database.execSQL("CREATE INDEX IF NOT EXISTS idx_questions_keyword ON questions(keyword)");
            database.execSQL("CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject)");
            database.execSQL("CREATE INDEX IF NOT EXISTS idx_state_status ON state(status)");
        }

        private void rebuildQuestions(SQLiteDatabase database, JSONArray array) throws Exception {
            database.execSQL("DELETE FROM questions");
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                String id = obj.optString("id");
                String round = obj.optString("round");
                String category = obj.optString("category");
                String keyword = normalizeKeyword(obj.optString("keyword"));
                String question = obj.optString("question");
                String cleaned = cleanQuestion(question);
                String search = normalize(round + " " + category + " " + keyword + " " + splitCompactKorean(keyword) + " " + question + " " + cleaned);
                int subject = computeSubjectMask(category + keyword + question + cleaned);
                ContentValues values = new ContentValues();
                values.put("id", id);
                values.put("round", round);
                values.put("category", category);
                values.put("keyword", keyword);
                values.put("question", question);
                values.put("search", search);
                values.put("subject", subject);
                database.insert("questions", null, values);
            }
        }

        Question find(String id) {
            List<Question> rows = query("q.id = ?", new String[]{id}, "q.round, q.id", 1);
            return rows.isEmpty() ? null : rows.get(0);
        }

        List<Question> search(String query, String status, int limit) {
            List<String> args = new ArrayList<>();
            StringBuilder where = new StringBuilder("1=1");
            String normalized = normalize(query);
            if (!normalized.isEmpty()) {
                for (String token : searchTokens(query)) {
                    where.append(" AND q.search LIKE ?");
                    args.add("%" + token + "%");
                }
            }
            if (FILTER_STARRED.equals(status)) {
                where.append(" AND IFNULL(s.starred,0)=1");
            } else if (!FILTER_ALL.equals(status)) {
                where.append(" AND IFNULL(s.status,'unseen')=?");
                args.add(status);
            }
            String order = "q.round, q.id";
            if (!normalized.isEmpty()) {
                order = "CASE WHEN q.search LIKE '%" + sqlLikeLiteral(normalized) + "%' THEN 0 ELSE 1 END, " +
                        "CASE WHEN q.keyword LIKE '%" + sqlLikeLiteral(query.trim()) + "%' THEN 0 ELSE 1 END, " +
                        "q.round, q.id";
            }
            return query(where.toString(), args.toArray(new String[0]), order, limit);
        }

        List<Question> recommended(int limit) {
            String frequency = "(SELECT COUNT(*) FROM questions k WHERE k.keyword=q.keyword)";
            String core = "(CASE WHEN q.search LIKE '%보호%' OR q.search LIKE '%계전%' OR q.search LIKE '%전압%' OR q.search LIKE '%고장%' OR q.search LIKE '%단락%' OR q.search LIKE '%접지%' OR q.search LIKE '%안정도%' OR q.search LIKE '%주파수%' THEN 45 ELSE 0 END)";
            String recency = "(CASE WHEN IFNULL(s.status,'unseen')='done' AND IFNULL(s.reviewedAt,'') <> '' THEN CAST(julianday('now') - julianday(s.reviewedAt) AS INTEGER) * 4 ELSE 0 END)";
            String score = "(" +
                    "CASE IFNULL(s.status,'unseen') WHEN 'weak' THEN 180 WHEN 'unseen' THEN 100 WHEN 'done' THEN 10 ELSE 60 END + " +
                    "IFNULL(s.starred,0) * 80 + " +
                    "CASE WHEN IFNULL(s.memo,'') <> '' THEN 35 ELSE 0 END + " +
                    "CASE WHEN " + frequency + " >= 5 THEN 70 WHEN " + frequency + " >= 3 THEN 45 WHEN " + frequency + " >= 2 THEN 25 ELSE 0 END + " +
                    core + " + " + recency +
                    ")";
            List<Question> rows = query(
                    "IFNULL(s.status,'unseen') != 'done' OR s.reviewedAt IS NULL OR s.reviewedAt <= date('now','-7 day')",
                    new String[0],
                    score + " DESC, CASE IFNULL(s.status,'unseen') WHEN 'weak' THEN 0 WHEN 'unseen' THEN 1 ELSE 2 END, q.round, q.id",
                    limit
            );
            if (rows.isEmpty()) {
                rows = query("1=1", new String[0], score + " DESC, q.round, q.id", limit);
            }
            for (Question q : rows) {
                q.recommendationReason = recommendationReason(q);
            }
            return rows;
        }

        List<KeywordRow> frequentRows(int subject, int limit) {
            SQLiteDatabase database = getReadableDatabase();
            Cursor cursor = database.rawQuery(
                    "SELECT keyword, COUNT(*) AS c FROM questions WHERE (subject & ?) != 0 GROUP BY keyword HAVING c >= 1 ORDER BY c DESC, keyword LIMIT ?",
                    new String[]{String.valueOf(subject), String.valueOf(limit)}
            );
            List<KeywordRow> rows = new ArrayList<>();
            try {
                while (cursor.moveToNext()) {
                    KeywordRow row = new KeywordRow();
                    row.keyword = cursor.getString(0);
                    row.count = cursor.getInt(1);
                    rows.add(row);
                }
            } finally {
                cursor.close();
            }
            return rows;
        }

        int subjectCount(int subject) {
            return scalarInt(getReadableDatabase(), "SELECT COUNT(*) FROM questions WHERE (subject & " + subject + ") != 0");
        }

        Stats stats() {
            SQLiteDatabase database = getReadableDatabase();
            Stats stats = new Stats();
            stats.total = scalarInt(database, "SELECT COUNT(*) FROM questions");
            stats.done = stateCount(FILTER_DONE);
            stats.weak = stateCount(FILTER_WEAK);
            stats.starred = scalarInt(database, "SELECT COUNT(*) FROM state WHERE starred=1");
            stats.unseen = stats.total - stats.done - stats.weak;
            return stats;
        }

        void setStatus(String id, String status) {
            ContentValues values = stateValues(id);
            values.put("status", status);
            if (FILTER_DONE.equals(status)) {
                values.put("reviewedAt", new SimpleDateFormat("yyyy-MM-dd", Locale.KOREA).format(new Date()));
            }
            getWritableDatabase().insertWithOnConflict("state", null, values, SQLiteDatabase.CONFLICT_REPLACE);
        }

        void setStarred(String id, boolean starred) {
            ContentValues values = stateValues(id);
            values.put("starred", starred ? 1 : 0);
            getWritableDatabase().insertWithOnConflict("state", null, values, SQLiteDatabase.CONFLICT_REPLACE);
        }

        void setMemo(String id, String memo) {
            ContentValues values = stateValues(id);
            values.put("memo", memo);
            getWritableDatabase().insertWithOnConflict("state", null, values, SQLiteDatabase.CONFLICT_REPLACE);
        }

        private ContentValues stateValues(String id) {
            ContentValues existing = existingStateValues(id);
            ContentValues values = new ContentValues();
            values.put("id", id);
            values.put("status", existing.getAsString("status"));
            values.put("starred", existing.getAsInteger("starred"));
            values.put("memo", existing.getAsString("memo"));
            String reviewedAt = existing.getAsString("reviewedAt");
            if (reviewedAt != null) {
                values.put("reviewedAt", reviewedAt);
            }
            return values;
        }

        private ContentValues existingStateValues(String id) {
            ContentValues values = new ContentValues();
            values.put("status", FILTER_UNSEEN);
            values.put("starred", 0);
            values.put("memo", "");
            Cursor cursor = getReadableDatabase().rawQuery("SELECT status,starred,memo,reviewedAt FROM state WHERE id=?", new String[]{id});
            try {
                if (cursor.moveToFirst()) {
                    values.put("status", cursor.getString(0));
                    values.put("starred", cursor.getInt(1));
                    values.put("memo", cursor.getString(2));
                    if (!cursor.isNull(3)) {
                        values.put("reviewedAt", cursor.getString(3));
                    }
                }
            } finally {
                cursor.close();
            }
            return values;
        }

        JSONObject exportStateJson() throws Exception {
            JSONObject root = new JSONObject();
            JSONArray states = new JSONArray();
            Cursor cursor = getReadableDatabase().rawQuery("SELECT id,status,starred,memo,reviewedAt FROM state ORDER BY id", null);
            try {
                while (cursor.moveToNext()) {
                    JSONObject row = new JSONObject();
                    row.put("id", cursor.getString(0));
                    row.put("status", cursor.getString(1));
                    row.put("starred", cursor.getInt(2) == 1);
                    row.put("memo", cursor.getString(3));
                    if (!cursor.isNull(4)) {
                        row.put("reviewedAt", cursor.getString(4));
                    }
                    states.put(row);
                }
            } finally {
                cursor.close();
            }
            root.put("version", 1);
            root.put("exportedAt", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.KOREA).format(new Date()));
            root.put("states", states);
            return root;
        }

        void importStateJson(JSONObject root) throws Exception {
            JSONArray states = root.optJSONArray("states");
            if (states == null) {
                states = root.optJSONArray("questions");
            }
            if (states == null) {
                throw new IllegalArgumentException("backup states missing");
            }
            SQLiteDatabase database = getWritableDatabase();
            database.beginTransaction();
            try {
                database.delete("state", null, null);
                for (int i = 0; i < states.length(); i++) {
                    JSONObject row = states.getJSONObject(i);
                    String id = row.optString("id");
                    if (!questionExists(database, id)) {
                        continue;
                    }
                    ContentValues values = new ContentValues();
                    String status = row.optString("status", FILTER_UNSEEN);
                    if (!FILTER_DONE.equals(status) && !FILTER_WEAK.equals(status)) {
                        status = FILTER_UNSEEN;
                    }
                    values.put("id", id);
                    values.put("status", status);
                    values.put("starred", row.optBoolean("starred", row.optInt("starred", 0) == 1) ? 1 : 0);
                    values.put("memo", row.optString("memo", ""));
                    String reviewedAt = row.optString("reviewedAt", row.optString("date", ""));
                    if (reviewedAt.length() > 0) {
                        values.put("reviewedAt", reviewedAt);
                    }
                    database.insertWithOnConflict("state", null, values, SQLiteDatabase.CONFLICT_REPLACE);
                }
                database.setTransactionSuccessful();
            } finally {
                database.endTransaction();
            }
        }

        private boolean questionExists(SQLiteDatabase database, String id) {
            Cursor cursor = database.rawQuery("SELECT 1 FROM questions WHERE id=? LIMIT 1", new String[]{id});
            try {
                return cursor.moveToFirst();
            } finally {
                cursor.close();
            }
        }

        private int stateCount(String status) {
            Cursor cursor = getReadableDatabase().rawQuery("SELECT COUNT(*) FROM state WHERE status=?", new String[]{status});
            try {
                return cursor.moveToFirst() ? cursor.getInt(0) : 0;
            } finally {
                cursor.close();
            }
        }

        private List<Question> query(String where, String[] args, String order, int limit) {
            SQLiteDatabase database = getReadableDatabase();
            String sql = "SELECT q.id,q.round,q.category,q.keyword,q.question,IFNULL(s.status,'unseen'),IFNULL(s.starred,0),IFNULL(s.memo,''),(SELECT COUNT(*) FROM questions k WHERE k.keyword=q.keyword),IFNULL(s.reviewedAt,'') " +
                    "FROM questions q LEFT JOIN state s ON s.id=q.id WHERE " + where + " ORDER BY " + order + " LIMIT " + limit;
            Cursor cursor = database.rawQuery(sql, args);
            List<Question> rows = new ArrayList<>();
            try {
                while (cursor.moveToNext()) rows.add(readQuestion(cursor));
            } finally {
                cursor.close();
            }
            return rows;
        }

        private Question readQuestion(Cursor cursor) {
            Question q = new Question();
            q.id = cursor.getString(0);
            q.round = cursor.getString(1);
            q.category = cursor.getString(2);
            q.keyword = cursor.getString(3);
            q.question = cursor.getString(4);
            q.status = cursor.getString(5);
            q.starred = cursor.getInt(6) == 1;
            q.memo = cursor.getString(7);
            q.frequency = cursor.getInt(8);
            q.reviewedAt = cursor.getString(9);
            q.displayQuestion = cleanQuestion(q.question);
            return q;
        }

        private JSONArray readAssetQuestions() throws Exception {
            InputStream input = getAssets().open("questions.json");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) out.write(buffer, 0, read);
            return new JSONArray(out.toString("UTF-8"));
        }

        private int scalarInt(SQLiteDatabase database, String sql) {
            Cursor cursor = database.rawQuery(sql, null);
            try {
                return cursor.moveToFirst() ? cursor.getInt(0) : 0;
            } finally {
                cursor.close();
            }
        }

        private int metadataInt(SQLiteDatabase database, String key) {
            Cursor cursor = database.rawQuery("SELECT value FROM metadata WHERE key=?", new String[]{key});
            try {
                if (!cursor.moveToFirst()) return 0;
                return Integer.parseInt(cursor.getString(0));
            } catch (Exception ignored) {
                return 0;
            } finally {
                cursor.close();
            }
        }

        private void setMetadata(SQLiteDatabase database, String key, String value) {
            ContentValues values = new ContentValues();
            values.put("key", key);
            values.put("value", value);
            database.insertWithOnConflict("metadata", null, values, SQLiteDatabase.CONFLICT_REPLACE);
        }

        private String normalizeKeyword(String keyword) {
            if ("고장파급방지장치".equals(keyword)) return "SPS";
            if ("전력계통안정화장치".equals(keyword)) return "PSS";
            if ("태양광인버터효율".equals(keyword)) return "태양광인버터";
            return keyword == null || keyword.length() == 0 ? "기타" : keyword;
        }
    }
}
