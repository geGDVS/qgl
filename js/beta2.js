mdui.setColorScheme('#78dc77');

const examSets = {
    "qgl1-15": qgl1_15,
    "qgl16-30": qgl16_30,
    "qgl31-45": qgl31_45,
    "qgl46-60": qgl46_60,
    "qgl61-75": qgl61_75,
    "qgl76-90": qgl76_90,
    "qgl91-105": qgl91_105,
    "qgl106-120": qgl106_120,
    "qgl121-135": qgl121_135,
    "qgl136-150": qgl136_150,
    "qgl151-165": qgl151_165,
    "qgl166-180": qgl166_180,
    "qgl181-195": qgl181_195,
};

// 打乱所有测试集
for (const setKey in examSets) {
    examSets[setKey].sort(() => Math.random() - 0.5);
}

// 前往页面
function goToHomePage() {
    window.location.href = 'index.html';
}
function goToWrongPage() {
    window.location.href = 'wrong.html';
}
// 添加事件监听器
const homeButton = document.getElementById('home-button');
homeButton.addEventListener('click', goToHomePage);
const wrongButton = document.getElementById('wrong-button');
wrongButton.addEventListener('click', goToWrongPage);
const addFab = document.getElementById('wrong-fab');
addFab.addEventListener('click', () => document.getElementById('add-wrong-button') && document.getElementById('add-wrong-button').click());
// 获取并控制“加入错题”按钮（在显示答案前禁用）
var addWrongBtn = document.getElementById('add-wrong-button');

function disableAddWrong(){ 
    addWrongBtn.setAttribute('disabled','disabled'); 
    addFab.setAttribute('disabled','disabled');
}
function enableAddWrong(){ 
    addWrongBtn.removeAttribute('disabled'); 
    addFab.removeAttribute('disabled');
}
let savedExamSet = localStorage.getItem('selectedExamSet2');

// 处理考察集选择事件
function handleExamSetChange() {
    playAudio('exam-set-select');
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = selectElement.value;
    currentExamSet = examSets[selectedSet];
    currentIndex = 0; // 切换考察集后重置索引
    showCurrentWord();
    // 保存用户选择的单词集到本地存储
    localStorage.setItem('selectedExamSet2', selectedSet);
}

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
    // 在显示新题时禁用加入错题按钮，直到显示答案
    disableAddWrong();
}

// 显示答案
function showAnswer() {
    playAudio('show-answer-button');
    const resultElement = document.getElementById('result-message');
    const correctAnswer = currentExamSet[currentIndex].english;
    resultElement.textContent = `${correctAnswer}`;
    disableShowAnswer();
    // 显示答案后允许加入错题
    enableAddWrong();
}
