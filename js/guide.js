let isMuted = localStorage.getItem('isMuted') === 'true';
const volumeButton = document.getElementById('volume-toggle');
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', handleDarkModeToggle);
volumeButton.icon = isMuted ? 'volume_off' : 'volume_up';

mdui.setColorScheme('#0061a4');

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

// 返回原页面
function goBackToMainPage() {
    window.location.href = 'index.html';
}

// 添加事件监听器
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', goBackToMainPage);

const volumeToggle = document.getElementById('volume-toggle');
volumeToggle.addEventListener('click', handleVolumeToggle);


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