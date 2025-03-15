const examSets = {
    "qgl137_144": qgl137_144,
    "qgl145_152": qgl145_152,
    "qgl153_160": qgl153_160,
};

let currentIndex = 0;
let currentExamSet = examSets.qgl153_160;
let isMuted = localStorage.getItem('isMuted') === 'true';
const volumeButton = document.getElementById('volume-toggle');
volumeButton.textContent = isMuted ? 'Unmute🔊' : 'Mute🔇';

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
    playAudio('show-answer-button');
}

// 显示下一个单词
function showNextWord() {
    currentIndex++;
    if (currentIndex >= currentExamSet.length) {
        currentIndex = 0;
    }
    showCurrentWord();
    playAudio('next-button');
}

// 处理考察集选择事件
function handleExamSetChange() {
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = selectElement.value;
    currentExamSet = examSets[selectedSet];
    currentIndex = 0; // 切换考察集后重置索引
    showCurrentWord();
}

// 播放音频函数
function playAudio(buttonId) {
    if (isMuted) return;
    const button = document.getElementById(buttonId);
    const audioSrc = button.getAttribute('data-audio');
    if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play();
    }
}

function handleDarkModeToggle() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
    playAudio('dark-mode-toggle');
}

// 处理音量开关
function handleVolumeToggle() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    volumeButton.textContent = isMuted ? 'Unmute🔊' : 'Mute🔇';
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

const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', handleDarkModeToggle);

const volumeToggle = document.getElementById('volume-toggle');
volumeToggle.addEventListener('click', handleVolumeToggle);

// 暗色模式逻辑
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
