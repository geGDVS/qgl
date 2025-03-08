const examSets = {
    "qgl137_144": qgl137_144,
    "qgl145_152": qgl145_152
};

let currentIndex = 0;
// 默认选择考察集 1
let currentExamSet = examSets.qgl145_152;

// 显示当前中文单词及考察类型
function showCurrentWord() {
    const chineseWordElement = document.getElementById('chinese-word');
    const questionTypeElement = document.getElementById('question-type');
    const hintElement = document.getElementById('hint');
    const currentPair = currentExamSet[currentIndex];
    chineseWordElement.textContent = currentPair.chinese;
    questionTypeElement.textContent = `${currentPair.type}`;

    let hint = '';
    if (currentPair.type === '短语' || currentPair.type === '句子') {
        if (currentPair.keyWords) {
            hint = currentPair.keyWords.join(' ');
        }
    } else if (currentPair.type === '单词') {
        // 考察单词时，提示首字母
        hint = `${currentPair.english[0]}-`;
    }
    if (hint) {
        hintElement.textContent = `HINT: ${hint}`;
    } else {
        hintElement.textContent = '';
    }

    const resultElement = document.getElementById('result-message');
    resultElement.textContent = '';
}

// 显示答案
function showAnswer() {
    const resultElement = document.getElementById('result-message');
    const correctAnswer = currentExamSet[currentIndex].english;
    resultElement.textContent = `${correctAnswer}`;
}

// 显示下一个单词
function showNextWord() {
    currentIndex++;
    if (currentIndex >= currentExamSet.length) {
        currentIndex = 0;
    }
    showCurrentWord();
}

// 处理考察集选择事件
function handleExamSetChange() {
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = selectElement.value;
    currentExamSet = examSets[selectedSet];
    currentIndex = 0; // 切换考察集后重置索引
    showCurrentWord();
}

// 初始化页面
showCurrentWord();

// 添加事件监听器
const showAnswerButton = document.getElementById('show-answer-button');
showAnswerButton.addEventListener('click', showAnswer);

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', showNextWord);

const examSetSelect = document.getElementById('exam-set-select');
examSetSelect.addEventListener('change', handleExamSetChange);

// 暗色模式逻辑
const darkModeToggle = document.getElementById('dark-mode-toggle');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('darkMode');

if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
} else if (savedMode === 'disabled') {
    document.body.classList.remove('dark-mode');
} else {
    if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});