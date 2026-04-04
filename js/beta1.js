// 前往页面
function goToBook() {
    const selectElement = document.getElementById('exam-set-select');
    window.open(`static/book/全攻略P${selectElement.value.slice(3)}.pdf`, '_blank');
}

function goToNewPage() {
    window.location.href = 'index2.html';
}



// 添加事件监听器
const bookButton = document.getElementById('book-button');
bookButton.addEventListener('click', goToBook);


const newButton = document.getElementById('new-button');
newButton.addEventListener('click', goToNewPage);


// 关于对话框逻辑
const aboutDialog = document.getElementById('about-dialog');
const showAboutButton = document.getElementById('show-about-dialog');
showAboutButton.addEventListener('click', (e) => {
    e.preventDefault();
    aboutDialog.open = true;
});


let savedExamSet = localStorage.getItem('selectedExamSet1');

// 处理考察集选择事件
function handleExamSetChange() {
    playAudio('exam-set-select');
    const selectElement = document.getElementById('exam-set-select');
    const selectedSet = selectElement.value;
    currentExamSet = examSets[selectedSet];
    currentIndex = 0; // 切换考察集后重置索引
    showCurrentWord();
    // 保存用户选择的单词集到本地存储
    localStorage.setItem('selectedExamSet1', selectedSet);
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
}

// 显示答案
function showAnswer() {
    playAudio('show-answer-button');
    const resultElement = document.getElementById('result-message');
    const correctAnswer = currentExamSet[currentIndex].english;
    resultElement.textContent = `${correctAnswer}`;
    disableShowAnswer();
}
