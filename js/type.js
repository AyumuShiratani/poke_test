let data = null;
let quiz = {};

async function loadData() {
    const res = await fetch('../type.json');
    data = await res.json();
    nextQuiz();
}

function getRandomType() {
    const keys = Object.keys(data.types);
    return keys[Math.floor(Math.random() * keys.length)];
}

function getEffectiveness(atk, def) {
    const chart = data.type_chart[def];
    if (chart.weak_to && chart.weak_to.includes(atk)) return 2.0;
    if (chart.resistant_to && chart.resistant_to.includes(atk)) return 0.5;
    if (chart.immune_to && chart.immune_to.includes(atk)) return 0.0;
    return 1.0;
}

function effectivenessLabel(val) {
    if (val === 2.0) return "効果バツグン";
    if (val === 0.5) return "効果はいまひとつ";
    if (val === 1.0) return "効果はふつう";
    if (val === 0.0) return "効果なし";
    return "";
}

function makeQuiz() {
    const atk = getRandomType();
    const def = getRandomType();
    const correctValue = getEffectiveness(atk, def);
    const allChoices = [2.0, 0.5, 1.0, 0.0];

    let showValue, isCorrect;
    if (Math.random() < 0.5) {
        // 1/2で正解
        showValue = correctValue;
        isCorrect = true;
    } else {
        // 残り1/2は正解以外から1つランダムで選ぶ（1/3）
        const wrongChoices = allChoices.filter(v => v !== correctValue);
        showValue = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        isCorrect = false;
    }

    const question = `${data.types[atk]} は ${data.types[def]} に${effectivenessLabel(showValue)}である。○か×か？`;
    // ○が正解ならisCorrect、×が正解なら!isCorrect
    // つまり「表示した効果が本当に正しいか？」を問う
    const answer = isCorrect;

    return { question, answer, atk, def, showValue, correctValue };
}

function showQuiz() {
    quiz = makeQuiz();
    document.getElementById('quiz').textContent = quiz.question;
    document.getElementById('result').textContent = '';
}

function answer(ans) {
    if (ans === quiz.answer) {
        document.getElementById('result').textContent = "○ 正解";
    } else {
        document.getElementById('result').textContent = "☓ 不正解";
    }
}

function nextQuiz() {
    showQuiz();
}

document.getElementById('maru').onclick = () => answer(true);
document.getElementById('batsu').onclick = () => answer(false);
document.getElementById('next').onclick = nextQuiz;

// 最初にデータ読み込むよ！
loadData();
