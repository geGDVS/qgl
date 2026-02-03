let currentIndex = 0;
// 如果保存的单词集不存在或为空，则使用最新单词集
let currentExamSet = (savedExamSet && examSets[savedExamSet]) ? examSets[savedExamSet] : examSets[0];
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


// 初始化页面
function initPage() {
    // 设置 select 元素的选中项
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = (savedExamSet && examSets[savedExamSet]) ? savedExamSet : Object.keys(examSets)[0];
    selectElement.value = selectedSet;

    showCurrentWord();
}

// 添加事件监听器
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

// 根据设备/视口切换移动模式：隐藏分段按钮，显示底部 FAB
function adjustForMobile() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 600;
    if (isMobile) {
        document.body.classList.add('mobile-mode');
    } else {
        document.body.classList.remove('mobile-mode');
    }
}

// 绑定 FAB（如果存在）到已有的操作
const showFab = document.getElementById('show-fab');
if (showFab) showFab.addEventListener('click', () => document.getElementById('show-answer-button') && document.getElementById('show-answer-button').click());
const nextFab = document.getElementById('next-fab');
if (nextFab) nextFab.addEventListener('click', () => document.getElementById('next-button') && document.getElementById('next-button').click());

window.addEventListener('resize', adjustForMobile);
adjustForMobile();

// 初始化页面
initPage();
