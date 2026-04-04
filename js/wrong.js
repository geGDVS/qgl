let isMuted = localStorage.getItem('isMuted') === 'true';
const volumeButton = document.getElementById('volume-toggle');
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', handleDarkModeToggle);
volumeButton.icon = isMuted ? 'volume_off' : 'volume_up';

mdui.setColorScheme('#dbc90a');

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
    window.location.href = 'index2.html';
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
// 侧边栏逻辑
var navigationDrawer = document.querySelector("mdui-navigation-drawer");
var openButton = document.getElementById("choose-button");
var closeButton = document.getElementById("close-button");
if (openButton && navigationDrawer) openButton.addEventListener("click", function(){ navigationDrawer.open = true; });
if (closeButton && navigationDrawer) closeButton.addEventListener("click", function(){ navigationDrawer.open = false; });

// ------- 错题集功能 -------
(function(){
	var KEY = 'qgl_wrong_set';

	function getWrongSet(){
		try{ var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; }catch(e){ return []; }
	}
	function saveWrongSet(arr){ localStorage.setItem(KEY, JSON.stringify(arr || [])); }

	function generateId(item){ return 'w_' + (item.id || Date.now()) + '_' + Math.floor(Math.random()*10000); }

	function isDuplicate(set, item){
		if(!item) return true;
		var q = (item.question||'').trim();
		if(!q) return true;
		return set.some(function(x){
			try{
				return (x.question||'').trim() === q && JSON.stringify(x.options||[]) === JSON.stringify(item.options||[]);
			}catch(e){ return false; }
		});
	}

	function addWrong(item){
		if(!item) return false;
		var set = getWrongSet();
		if (isDuplicate(set, item)) return false;
		item.id = generateId(item);
		item.addedAt = Date.now();
		set.push(item);
		saveWrongSet(set);
		return item.id;
	}

	function removeWrong(id){
		var set = getWrongSet();
		var n = set.filter(function(x){ return x.id !== id; });
		saveWrongSet(n);
	}

	function clearWrong(){ saveWrongSet([]); }

	function getAll(){ return getWrongSet(); }

	// 导出 API （不包含 index2 页面绑定）
	window.qglWrong = {
		add: addWrong,
		remove: removeWrong,
		clear: clearWrong,
		all: getAll
	};
})();

// ------- 错题集展示逻辑 -------
(function(){
	var resultMessage = document.getElementById('result-message');
	var pQ = document.getElementById('chinese-word');
	var hintEl = document.getElementById('hint');

	var items = [];
	var idx = 0;
	var practiceList = null; // 当由侧栏触发练习时使用已打乱的练习列表
	
	var savedSet = localStorage.getItem('selectedExamSet2');
	var currentFilter = savedSet || 'all';

	// 打印选中集合与其错题内容到控制台
	function logSelectedSet(setKey){
		if(!setKey || setKey === 'all'){
			console.log('Wrong set: all (no specific set selected)');
			return;
		}
		var all = (window.qglWrong && qglWrong.all()) || [];
		var items = all.filter(function(it){ return it.setKey === setKey; });
		console.log('Selected wrong set:', setKey, 'count:', items.length);
		console.log(items);
	}

	// 监听侧边栏选择（如果存在），选择后打乱该集合并开始练习
	var sideSelect = document.getElementById('exam-set-select');
	if (sideSelect) {
		sideSelect.addEventListener('change', function(){
			var val = sideSelect.value;
			try{ localStorage.setItem('selectedExamSet2', val); }catch(e){}
			currentFilter = val || 'all';
			logSelectedSet(val);
			renderList();

			// 准备打乱后的练习列表并开始练习
			var all = (window.qglWrong && qglWrong.all()) || [];
			var list = all.filter(function(it){ return it.setKey === val; });
			if(list && list.length){
				// Fisher-Yates shuffle
				for(var i=list.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=list[i]; list[i]=list[j]; list[j]=t; }
				practiceList = list;
				idx = 0;
				startPractice();
			} else {
				practiceList = null;
				showQuestion(0); // 显示临时错题
			}
		});
	}

	// 监听 localStorage 的变化（跨页面选择时触发）
	window.addEventListener('storage', function(e){
		if(e.key === 'selectedExamSet1' || e.key === 'selectedExamSet2'){
			var v = localStorage.getItem(e.key);
			currentFilter = v || 'all';
			logSelectedSet(v);
			renderList();
			// 同步执行打乱并开始练习（跨页选择时触发）
			var all = (window.qglWrong && qglWrong.all()) || [];
			var list = all.filter(function(it){ return it.setKey === v; });
			if(list && list.length){ for(var i=list.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=list[i]; list[i]=list[j]; list[j]=t; } practiceList = list; idx=0; startPractice(); } else { practiceList = null; showQuestion(0); }
		}
	});

	// 初始化时如果有已保存的侧栏选择，应用该选择并自动开始练习
	if (savedSet) {
		if (sideSelect) {
			try{ sideSelect.value = savedSet; }catch(e){}
		}
		currentFilter = savedSet || 'all';
		logSelectedSet(savedSet);
		renderList();
		var allInit = (window.qglWrong && qglWrong.all()) || [];
		var listInit = allInit.filter(function(it){ return it.setKey === savedSet; });
		if(listInit && listInit.length){
			for(var i=listInit.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=listInit[i]; listInit[i]=listInit[j]; listInit[j]=t; }
			practiceList = listInit;
			idx = 0;
			startPractice();
		} else {
			practiceList = null;
			showQuestion(0); // 显示临时错题
		}
	}

	function renderList(){
		// 仅更新内存中的 items，不在页面新增或修改任何 DOM（你已手写显示内容）
		items = (window.qglWrong && qglWrong.all()) || [];
		if (currentFilter && currentFilter !== 'all'){
			items = items.filter(function(it){ return it.setKey === currentFilter; });
		}
		if(!items.length){ idx = 0; }
	}

	function startPractice(){
		items = (window.qglWrong && qglWrong.all()) || [];
		if(currentFilter !== 'all') items = items.filter(function(it){ return it.setKey === currentFilter; });
		if(!items.length) return;
		showQuestion(idx);
	}

	function showQuestion(i){
		items = (window.qglWrong && qglWrong.all()) || [];
		if(currentFilter !== 'all') items = items.filter(function(it){ return it.setKey === currentFilter; });
		if(!items.length){
			// 无题时显示临时错题提示
			if(resultMessage) resultMessage.textContent = '';
			if(hintEl) hintEl.textContent = 'HINT: 前往Review Mode增加错题';
			if(pQ) pQ.textContent = '暂无错题';
			var questionTypeEl = document.getElementById('question-type');
			if(questionTypeEl) questionTypeEl.textContent = '提示';
			window.currentWrongId = null;
			// 禁用按钮
			document.getElementById('show-answer-button').disabled = true;
			document.getElementById('delete-wrong-button').disabled = true;
			document.getElementById('next-button').disabled = true;
			return;
		}
		// 有题时启用按钮
		document.getElementById('show-answer-button').disabled = false;
		document.getElementById('delete-wrong-button').disabled = false;
		document.getElementById('next-button').disabled = false;
		if(i < 0) i = 0; if(i >= items.length) i = items.length - 1; idx = i;
		var it = items[idx];
		if(pQ) pQ.textContent = it.question || '题目';
		// 清空上一轮答案显示
		if (resultMessage) resultMessage.textContent = '';
		// 将 hint 写入你指定的 hint 元素
		if(hintEl) hintEl.textContent = it.hint || '';
		// 记录当前正在展示的错题 id 以便移除
		window.currentWrongId = it.id;
		// 不在此处修改选项 DOM，保留你手写的显示结构
	}

	document.getElementById('next-button').addEventListener('click', function(){ playAudio('next-button'); idx++; var a = qglWrong.all(); if(currentFilter!=='all') a = a.filter(function(it){return it.setKey===currentFilter}); if(idx >= a.length) idx = 0; showQuestion(idx); });

	// 使用顶部的 segmented 按钮 `delete-wrong-button` 作为“移除当前题目”按钮（不新增任何按钮）
	var removeBtn = document.getElementById('delete-wrong-button');
	if(removeBtn){
		removeBtn.addEventListener('click', function(){
			playAudio('delete-wrong-button');
			var id = window.currentWrongId;
			if(!id) return;
			qglWrong.remove(id);
			// 更新内存列表并前进到下一题或清空显示
			var a = qglWrong.all(); if(currentFilter!=='all') a = a.filter(function(it){return it.setKey===currentFilter});
			if(!a.length){ if(resultMessage) resultMessage.textContent = ''; if(hintEl) hintEl.textContent = ''; if(pQ) pQ.textContent = ''; window.currentWrongId = null; return; }
			if(idx >= a.length) idx = 0;
			showQuestion(idx);
		});
	}

	document.getElementById('show-answer-button').addEventListener('click', function(){
		playAudio('show-answer-button');
		var a = qglWrong.all();
		if(currentFilter!=='all') a = a.filter(function(it){return it.setKey===currentFilter});
		if(!a.length) return;
		var it = a[idx];
		resultMessage.textContent = it.answer;
	});

	renderList();
	if(!items.length) showQuestion(0);
})();