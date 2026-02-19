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
};

// 打乱所有测试集
for (const setKey in examSets) {
    examSets[setKey].sort(() => Math.random() - 0.5);
}

// 前往页面
function goToHomePage() {
    window.location.href = 'index.html';
}

// 添加事件监听器
const homeButton = document.getElementById('home-button');
homeButton.addEventListener('click', goToHomePage);


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