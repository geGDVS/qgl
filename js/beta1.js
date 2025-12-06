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