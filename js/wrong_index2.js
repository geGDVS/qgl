// js/wrong_index2.js
// index2 专用：从页面抓取当前题目并把题目加入本地错题集（与 wrong.html 共用同一 localStorage 键）
(function(){
    var KEY = 'qgl_wrong_set';

    function getWrongSet(){ try{ var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; }catch(e){ return []; } }
    function saveWrongSet(arr){ localStorage.setItem(KEY, JSON.stringify(arr || [])); }
    function generateId(item){ return 'w_' + (item.id || Date.now()) + '_' + Math.floor(Math.random()*10000); }
    function isDuplicate(set, item){
        if(!item) return true;
        var q = (item.question||'').trim(); if(!q) return true;
        return set.some(function(x){ try{ return (x.question||'').trim() === q && JSON.stringify(x.options||[]) === JSON.stringify(item.options||[]); }catch(e){ return false; } });
    }
    function addWrong(item){ if(!item) return false; var set = getWrongSet(); if (isDuplicate(set, item)) return false; item.id = generateId(item); item.addedAt = Date.now(); set.push(item); saveWrongSet(set); return item.id; }

    function addCurrentQuestionToWrong(){
        playAudio('add-wrong-button');
        disableAddWrong();
        var question = '';
        var hint = '';
        var answer = '';
        var qtype = '';
        var options = [];

        var elQ = document.getElementById('chinese-word'); if (elQ) question = elQ.textContent.trim();
        var elHint = document.getElementById('hint'); if (elHint) hint = elHint.textContent.trim();
        var elAnswer = document.getElementById('result-message'); if (elAnswer) answer = elAnswer.textContent.trim();
        var elQType = document.getElementById('question-type'); if (elQType) qtype = elQType.textContent.trim();

        var opts = document.querySelectorAll('.options li, .choices li, .option-item, .mdui-list-item .mdui-list-item-title');
        if (opts && opts.length){ opts.forEach(function(n){ var t = (n.textContent||'').trim(); if(t) options.push(t); }); }
        else {
            var labels = document.querySelectorAll('label, button, a');
            labels.forEach(function(l){ var txt = (l.textContent||'').trim(); if(txt && txt.length < 200) options.push(txt); });
            options = Array.from(new Set(options)).slice(0,10);
        }

        if((!question || !question.length) && window.currentQuestion){
            try{
                var cq = window.currentQuestion;
                question = question || (cq.questionText || cq.title || cq.chinese || '');
                hint = hint || cq.hint || '';
                // 尝试从页面的 question 对象或数据源获取标准答案字段
                answer = answer || cq.answer || cq.english || cq.correct || '';
                options = options.length? options : (cq.options || []);
                qtype = qtype || (cq.type || '');
            }catch(e){}
        }

        // 记录所属单词集（尝试从 localStorage 或页面 select 中读取）
        var setKey = null;
        try{ setKey = localStorage.getItem('selectedExamSet2') || localStorage.getItem('selectedExamSet1') || (document.getElementById('exam-set-select') && document.getElementById('exam-set-select').value) || null; }catch(e){}

        var item = { question: question || qtype || hint || '未知题目', hint: hint, answer: answer || '', questionType: qtype, options: options, source: location.pathname + location.search, setKey: setKey };
        var id = addWrong(item);
        if (id) {
            // 打印已保存的错题及当前错题集到控制台，便于调试
            try{
                var all = getWrongSet();
                var saved = all.find(function(x){ return x.id === id; });
                console.log('错题已保存，id=', id, 'item=', saved);
                console.log('当前错题集总数=', all.length, all);
            }catch(e){ console.log('保存后打印错题列表失败', e); }
            mdui.snackbar({message: 'Added to wrong set'});
            return true;
        } else {
            return false;
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        var addBtn = document.getElementById('add-wrong-button');
        if (addBtn){ addBtn.addEventListener('click', function(){ addCurrentQuestionToWrong(); }); }
        var wrongOpen = document.getElementById('wrong-button');
        if (wrongOpen){ wrongOpen.addEventListener('click', function(){ window.open('wrong.html', '_blank'); }); }
    });

    // 可选导出（非必须）
    window.qglWrongIndex2 = { addCurrentQuestionToWrong: addCurrentQuestionToWrong };
})();
