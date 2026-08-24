const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let current = '0';
let previous = null;
let operator = null;
let resultShown = false;

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent = previous !== null && operator
    ? `${previous} ${operatorSymbol(operator)}`
    : '';
}

function operatorSymbol(op) {
  return { '/': '÷', '*': '×', '-': '−', '+': '+', '%': 'Mod' }[op] || '';
}

function inputNumber(value) {
  if (resultShown) {
    current = value === '.' ? '0.' : value;
    resultShown = false;
    return;
  }
  if (value === '.' && current.includes('.')) return;
  current = current === '0' && value !== '.' ? value : current + value;
}

function inputOperator(op) {
  if (operator !== null && !resultShown) {
    compute();
  }
  previous = current;
  operator = op;
  current = '0';
  resultShown = false;
}

function compute() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;

  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? NaN : a / b; break;
    case '%': result = b === 0 ? NaN : a % b; break;
    default: return;
  }

  current = formatResult(result);
  operator = null;
  previous = null;
  resultShown = true;
}

function formatResult(num) {
  if (isNaN(num)) return 'Erreur';
  if (!isFinite(num)) return 'Erreur';
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resultShown = false;
}

function deleteLast() {
  if (resultShown) {
    clearAll();
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

function percent() {
  current = formatResult(parseFloat(current) / 100);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'percent') percent();
    else if (action === 'operator') inputOperator(value);
    else if (action === 'equals') compute();
    else if (value !== undefined) inputNumber(value);

    updateDisplay();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if (['+', '-', '*', '/', '%'].includes(e.key)) inputOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') compute();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else return;

  updateDisplay();
});

updateDisplay();
