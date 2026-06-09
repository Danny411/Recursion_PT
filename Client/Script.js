const executionDiv = document.getElementById('execution');
const stackDiv = document.getElementById('stack');
const resultDiv = document.getElementById('result');
const inputValue = document.getElementById('inputValue');
const secondaryInput = document.getElementById('secondaryInput');
const secondaryInputWrap = document.getElementById('secondaryInputWrap');
const exampleSelect = document.getElementById('exampleSelect');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const stepProgress = document.getElementById('stepProgress');
const stepLabel = document.getElementById('stepLabel');

let stack = [];
let running = false;
let autoScrollExecution = true;
let autoScrollStack = true;
let speed = parseInt(speedRange.value, 10);
let totalSteps = 0;
let completedSteps = 0;

const exampleConfigs = {
    factorial: { secondary: false, label1: 'Input Value', placeholder1: 'Enter a number' },
    fibonacci: { secondary: false, label1: 'Input Value', placeholder1: 'Enter a number' },
    sum: { secondary: false, label1: 'Input Value', placeholder1: 'Enter a number' },
    power: { secondary: true, label1: 'Base Value', placeholder1: 'Enter base', label2: 'Exponent', placeholder2: 'Enter exponent' },
    binarySearch: { secondary: true, label1: 'Target Value', placeholder1: 'Enter target', label2: 'Array Size', placeholder2: 'Enter size' }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setButtonsDisabled(disabled) {
    document.querySelectorAll('button').forEach(btn => btn.disabled = disabled);
    exampleSelect.disabled = disabled;
    inputValue.disabled = disabled;
    secondaryInput.disabled = disabled;
    speedRange.disabled = disabled;
}

function scrollToBottom(el) {
    if (el === executionDiv && autoScrollExecution) el.scrollTop = el.scrollHeight;
    if (el === stackDiv && autoScrollStack) el.scrollTop = el.scrollHeight;
}

function updateStepBar(label) {
    const pct = totalSteps > 0 ? Math.min(100, (completedSteps / totalSteps) * 100) : 0;
    stepProgress.style.width = `${pct}%`;
    stepLabel.textContent = label || `${completedSteps} / ${totalSteps} steps`;
}

function addExecution(text, isError = false) {
    const div = document.createElement('div');
    div.innerText = text;
    if (isError) div.classList.add('error-step');
    executionDiv.appendChild(div);
    scrollToBottom(executionDiv);
}

function renderStack() {
    stackDiv.innerHTML = '';
    [...stack].reverse().forEach((item, index) => {
        const div = document.createElement('div');
        div.innerText = item.label;
        if (index === 0) div.classList.add('current-frame');
        if (item.state === 'returning') div.classList.add('returning-frame');
        stackDiv.appendChild(div);
    });
    scrollToBottom(stackDiv);
}

function pushFrame(label) {
    stack.push({ label, state: 'active' });
    renderStack();
}

function popFrame() {
    stack.pop();
    renderStack();
}

function markTopFrameReturning() {
    if (stack.length > 0) {
        stack[stack.length - 1].state = 'returning';
        renderStack();
    }
}

async function animateStep(text, label, isError = false, pause = true) {
    completedSteps++;
    updateStepBar(label);
    addExecution(text, isError);
    if (pause) await delay(speed);
}

async function factorial(n) {
    pushFrame(`factorial(${n})`);
    await animateStep(`Calling factorial(${n})`, `Factorial: ${n}`);
    if (n === 0 || n === 1) {
        await animateStep('Base case reached: returning 1', 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return 1;
    }
    const result = n * await factorial(n - 1);
    await animateStep(`Returning ${result} from factorial(${n})`, 'Unwinding');
    markTopFrameReturning();
    await delay(speed / 2);
    popFrame();
    return result;
}

async function fibonacci(n) {
    pushFrame(`fibonacci(${n})`);
    await animateStep(`Calling fibonacci(${n})`, `Fibonacci: ${n}`);
    if (n <= 1) {
        await animateStep(`Base case reached: returning ${n}`, 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return n;
    }
    const result = await fibonacci(n - 1) + await fibonacci(n - 2);
    await animateStep(`Returning ${result} from fibonacci(${n})`, 'Unwinding');
    markTopFrameReturning();
    await delay(speed / 2);
    popFrame();
    return result;
}

async function sumDigits(n) {
    pushFrame(`sum(${n})`);
    await animateStep(`Calling sum(${n})`, `Sum: ${n}`);
    if (n < 10) {
        await animateStep(`Base case reached: returning ${n}`, 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return n;
    }
    const result = (n % 10) + await sumDigits(Math.floor(n / 10));
    await animateStep(`Returning ${result} from sum(${n})`, 'Unwinding');
    markTopFrameReturning();
    await delay(speed / 2);
    popFrame();
    return result;
}

async function power(base, exp) {
    pushFrame(`power(${base}, ${exp})`);
    await animateStep(`Calling power(${base}, ${exp})`, `Power: ${base}^${exp}`);
    if (exp === 0) {
        await animateStep('Base case reached: returning 1', 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return 1;
    }
    if (exp === 1) {
        await animateStep(`Base case reached: returning ${base}`, 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return base;
    }
    const result = base * await power(base, exp - 1);
    await animateStep(`Returning ${result} from power(${base}, ${exp})`, 'Unwinding');
    markTopFrameReturning();
    await delay(speed / 2);
    popFrame();
    return result;
}

async function binarySearch(arr, target, left, right) {
    pushFrame(`binarySearch(${left}, ${right})`);
    await animateStep(`Searching between ${left} and ${right}`, `Binary search`);
    if (left > right) {
        await animateStep('Base case reached: value not found', 'Returning', true);
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return -1;
    }
    const mid = Math.floor((left + right) / 2);
    await animateStep(`Checking index ${mid} with value ${arr[mid]}`, 'Checking midpoint');
    if (arr[mid] === target) {
        await animateStep(`Base case reached: found at index ${mid}`, 'Returning');
        markTopFrameReturning();
        await delay(speed / 2);
        popFrame();
        return mid;
    }
    const result = target < arr[mid]
        ? await binarySearch(arr, target, left, mid - 1)
        : await binarySearch(arr, target, mid + 1, right);
    await animateStep(`Returning ${result} from binarySearch(${left}, ${right})`, 'Unwinding');
    markTopFrameReturning();
    await delay(speed / 2);
    popFrame();
    return result;
}

async function logExecution(example, inputValue, result) {
    try {
        const response = await fetch('/save-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                example,
                inputValue,
                result: String(result)
            })
        });

        if (!response.ok) {
            console.error('Logging failed: server returned', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Logging failed:', error);
    }
}

function updateInputFields() {
    const cfg = exampleConfigs[exampleSelect.value];
    inputValue.placeholder = cfg.placeholder1;
    secondaryInputWrap.style.display = cfg.secondary ? 'flex' : 'none';

    const firstLabel = document.querySelector('label[for="inputValue"]');
    if (firstLabel) firstLabel.textContent = cfg.label1;

    if (cfg.secondary) {
        const secondLabel = document.querySelector('label[for="secondaryInput"]');
        if (secondLabel) secondLabel.textContent = cfg.label2;
        secondaryInput.placeholder = cfg.placeholder2;
    }
}

exampleSelect.addEventListener('change', updateInputFields);

speedRange.addEventListener('input', () => {
    speed = parseInt(speedRange.value, 10);
    speedValue.textContent = `${speed} ms`;
});

executionDiv.addEventListener('mouseenter', () => autoScrollExecution = false);
executionDiv.addEventListener('mouseleave', () => autoScrollExecution = true);
stackDiv.addEventListener('mouseenter', () => autoScrollStack = false);
stackDiv.addEventListener('mouseleave', () => autoScrollStack = true);

executionDiv.addEventListener('wheel', () => autoScrollExecution = false, { passive: true });
stackDiv.addEventListener('wheel', () => autoScrollStack = false, { passive: true });

async function runVisualization() {
    if (running) return;
    running = true;
    setButtonsDisabled(true);
    resetVisualization();

    const example = exampleSelect.value;
    const value = parseInt(inputValue.value, 10);

    if (isNaN(value) || value < 0) {
        alert('Enter a valid non-negative number');
        setButtonsDisabled(false);
        running = false;
        return;
    }

    try {
        if (example === 'factorial') totalSteps = value + 2;
        else if (example === 'fibonacci') totalSteps = Math.max(1, value * 2);
        else if (example === 'sum') totalSteps = Math.max(1, String(value).length * 2);
        else if (example === 'power') {
            const exp = parseInt(secondaryInput.value, 10);
            totalSteps = Math.max(1, exp + 2);
        } else if (example === 'binarySearch') totalSteps = 10;

        completedSteps = 0;
        updateStepBar('Starting');

        addExecution(`Starting ${example} with input ${value}`);

        let result;

        if (example === 'factorial') {
            result = await factorial(value);
        } else if (example === 'fibonacci') {
            if (value > 10) {
                addExecution('Fibonacci input is too large for this visualizer. Please use 10 or less.', true);
                throw new Error('Input too large');
            }
            result = await fibonacci(value);
        } else if (example === 'sum') {
            result = await sumDigits(value);
        } else if (example === 'power') {
            const exp = parseInt(secondaryInput.value, 10);
            if (isNaN(exp) || exp < 0) {
                addExecution('Enter a valid exponent.', true);
                throw new Error('Invalid exponent');
            }
            result = await power(value, exp);
        } else if (example === 'binarySearch') {
            const size = parseInt(secondaryInput.value, 10);
            if (isNaN(size) || size < 1 || size > 20) {
                addExecution('Enter a valid array size between 1 and 20.', true);
                throw new Error('Invalid size');
            }
            const arr = Array.from({ length: size }, (_, i) => (i + 1) * 2);
            result = await binarySearch(arr, value, 0, arr.length - 1);
        }

        resultDiv.innerHTML = result === -1 ? 'Value not found' : `Result: ${result}`;
        updateStepBar('Completed');

        await logExecution(example, value, result);
    } catch (error) {
        if (!resultDiv.innerHTML) resultDiv.innerHTML = 'Process stopped';
    } finally {
        setButtonsDisabled(false);
        running = false;
    }
}

function resetVisualization() {
    executionDiv.innerHTML = '';
    stackDiv.innerHTML = '';
    resultDiv.innerHTML = '';
    stack = [];
    completedSteps = 0;
    totalSteps = 0;
    stepProgress.style.width = '0%';
    stepLabel.textContent = 'Ready';
}

updateInputFields();
speedValue.textContent = `${speed} ms`;