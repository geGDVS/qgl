let isMuted = localStorage.getItem('isMuted') === 'true';
const volumeButton = document.getElementById('volume-toggle');
volumeButton.textContent = isMuted ? 'Unmute🔊' : 'Mute🔇';

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
    playAudio('dark-mode-toggle');
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

// 处理音量开关
function handleVolumeToggle() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    volumeButton.textContent = isMuted ? 'Unmute🔊' : 'Mute🔇';
}

// 返回原页面
function goBackToMainPage() {
    window.location.href = 'index.html';
}

const backButton = document.getElementById('back-button');
backButton.addEventListener('click', goBackToMainPage);

// 添加事件监听器
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
