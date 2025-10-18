let currentIndex = 0;
let savedExamSet = localStorage.getItem('selectedExamSet');
let currentExamSet = savedExamSet ? examSets[savedExamSet] : examSets[Object.keys(examSets)[Object.keys(examSets).length - 1]];
let isMuted = localStorage.getItem('isMuted') === 'true';
const volumeButton = document.getElementById('volume-toggle');
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', handleDarkModeToggle);
volumeButton.icon = isMuted ? 'volume_off' : 'volume_up';


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
    
    hintElement.textContent = hint ? `HINT: ${hint}` : '';
    document.getElementById('result-message').textContent = '';
}

// 显示答案
function showAnswer() {
    playAudio('show-answer-button');
    const resultElement = document.getElementById('result-message');
    const correctAnswer = currentExamSet[currentIndex].english;
    resultElement.textContent = `${correctAnswer}`;
}

// 显示下一个单词
function showNextWord() {
    playAudio('next-button');
    currentIndex++;
    if (currentIndex >= currentExamSet.length) {
        currentIndex = 0;
    }
    showCurrentWord();
}

// 处理考察集选择事件
function handleExamSetChange() {
    playAudio('exam-set-select');
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = selectElement.value;
    currentExamSet = examSets[selectedSet];
    currentIndex = 0; // 切换考察集后重置索引
    showCurrentWord();
    // 保存用户选择的单词集到本地存储
    localStorage.setItem('selectedExamSet', selectedSet);
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

// 处理暗色模式切换
function handleDarkModeToggle() {
    playAudio('dark-mode-toggle');
    document.documentElement.classList.toggle('mdui-theme-dark');
    if (document.documentElement.classList.contains('mdui-theme-dark')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.icon = 'dark_mode';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.icon = 'brightness_5';
    }
}

// 处理音量开关
function handleVolumeToggle() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    volumeButton.icon = isMuted ? 'volume_off' : 'volume_up';
}

// 前往页面
function goToBook() {
    const selectElement = document.getElementById('exam-set-select');
    window.open(`static/book/全攻略P${selectElement.value.slice(3)}.pdf`, '_blank');
}

function goToOldPage() {
    window.location.href = 'old.html';
}

// 初始化页面
function initPage() {
    // 设置 select 元素的选中项
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = savedExamSet || Object.keys(examSets)[Object.keys(examSets).length - 1];
    selectElement.value = selectedSet;

    showCurrentWord();
}

// 添加事件监听器
const bookButton = document.getElementById('book-button');
bookButton.addEventListener('click', goToBook);

const oldButton = document.getElementById('old-button');
oldButton.addEventListener('click', goToOldPage);

const showAnswerButton = document.getElementById('show-answer-button');
showAnswerButton.addEventListener('click', showAnswer);

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', showNextWord);

const examSetSelect = document.getElementById('exam-set-select');
examSetSelect.addEventListener('change', handleExamSetChange);

const volumeToggle = document.getElementById('volume-toggle');
volumeToggle.addEventListener('click', handleVolumeToggle);

// 侧边栏逻辑
const navigationDrawer = document.querySelector("mdui-navigation-drawer");
const openButton = document.getElementById("choose-button");
const closeButton = document.getElementById("close-button");

openButton.addEventListener("click", () => navigationDrawer.open = true);
closeButton.addEventListener("click", () => navigationDrawer.open = false);

// 键盘事件监听
document.addEventListener('keydown', function(e) {
    // 按S键触发显示答案（不区分大小写）
    if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.getElementById('show-answer-button').click();
    }
    
    // 按N键触发下一题（不区分大小写）
    if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        document.getElementById('next-button').click();
    }
});

// 暗色模式逻辑
const savedMode = localStorage.getItem('darkMode');

if (savedMode === 'enabled') {
    document.documentElement.classList.add('mdui-theme-dark');
    darkModeToggle.icon = 'dark_mode';
} else if (savedMode === 'disabled') {
    document.documentElement.classList.remove('mdui-theme-dark');
    darkModeToggle.icon = 'brightness_5';
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('mdui-theme-dark');
        darkModeToggle.icon = 'dark_mode';
    } else {
        document.documentElement.classList.remove('mdui-theme-dark');
        darkModeToggle.icon = 'brightness_5';
    }
}

// 初始化页面
initPage();
