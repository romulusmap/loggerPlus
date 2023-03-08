const consoleOutput = document.getElementById('debugConsoleOutput');
const consoleOutputDivFormatted = document.createElement('pre');
const scrollCheckKey = 'scroll-check';
let PRIVATE = localStorage.getItem('private') || '~~';

consoleOutput.insertAdjacentElement('afterend', consoleOutputDivFormatted);

const LINESTYPES = {
    PRIVATE: 'private-line',
    DEBUG: 'debug-line',
    INFO: 'info-line',
    WARN: 'warning-line',
    ERROR: 'error-line',
    LOG: 'log-line',
    SQL: 'sql-line',
};

const CLASSIFIERS = {
    DEBUG: ['DEBUG'],
    INFO: ['INFO'],
    WARN: ['WARN'],
    ERROR: ['Exception', '	at ', '... ', 'Details: ', '] ', 'Caused by: ', 'An exception has occured:'],
    LOG: [' SlangLogger:'],
    SQL: ['SQL query', 'SQL API query', 'select ', 'SELECT', 'SQLGenerator:', 'SQL API'],
};

const indentifierRegex2 = /([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?,[0-9]+\s+[a-zA-Z]+\s+\[[A-Za-z0-9]+\]\s+'[A-Za-z0-9]+'\s+\[[A-Za-z0-9]+\])/i;
function observerTasks() {
    textToDiv();
    scrollToBottom();
}
const observer = new MutationObserver(observerTasks);
const observerOptions = {
    childList: true,
};
observer.observe(consoleOutput, observerOptions);

function isPartOfIdentifier(input) {
    return indentifierRegex2.test(input);
}

function mergePairs(array) {
    const result = [];
    for (let i = 0; i < array.length; i += 2) {
        if (i + 1 < array.length) {
            result.push(array[i] + array[i + 1]);
        } else {
            result.push(array[i]);
        }
    }
    return result;
}

function classifyLines(array) {
    array.forEach((div) => {
        const text = div.textContent;

        if (isPartOfIdentifier(text)) {
            if (CLASSIFIERS.DEBUG.some((classifier) => text.includes(classifier)) && CLASSIFIERS.SQL.every((classifier) => !text.includes(classifier))) {
                div.dataset.type = 'DEBUG';
            }
            if (CLASSIFIERS.INFO.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'INFO';
            }
            if (CLASSIFIERS.WARN.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'WARN';
                if (CLASSIFIERS.ERROR.some((classifier) => text.includes(classifier))) {
                    div.dataset.type = 'ERROR';
                }
            }
            if (CLASSIFIERS.LOG.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'LOG';
            }
            if (CLASSIFIERS.SQL.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'SQL';
            }
        }
        if (text.includes(PRIVATE)) {
            div.dataset.type = 'PRIVATE';
        }
    });
}

function prepareLogLineContent(array) {
    array.forEach((child) => {
        if (isPartOfIdentifier(child.innerHTML)) {
            const matchedString = child.innerHTML.match(indentifierRegex2)[0];
            const restString = child.innerHTML.split(matchedString)[1];
            const firstLine = restString.split('\n')[0];
            const restLines = restString.split('\n').slice(1).join('\n');

            child.innerHTML = `<span class="indentifier">${matchedString}</span>${firstLine}${restLines ? `<div class="details" style="max-height: 0px">${restLines}</div>` : ''}`;
            if (restLines) {
                child.dataset.content = '+';
                child.classList.add('group');
                child.addEventListener('click', (e) => {
                    expandCollapseClickCallback(child.lastElementChild);
                    e.stopImmediatePropagation();
                });
            }
        }
    });
}

function addClasses(array) {
    array.forEach((elem) => {
        elem.classList.add(LINESTYPES[elem.dataset.type]);
        elem.classList.add('line');
    });
}

function textToDiv() {
    let consoleOutputFiltered = consoleOutput.innerText.replaceAll('<js>', 'js');
    consoleOutputFiltered = consoleOutputFiltered.replaceAll('<query>', 'query');

    let consoleArray = consoleOutputFiltered.split(indentifierRegex2);
    consoleArray = consoleArray.filter((element) => element !== undefined && element !== '');

    const logsMerged = mergePairs(consoleArray);

    const logsElements = logsMerged.map((log) => {
        const divElement = document.createElement('div');
        divElement.innerHTML = log;
        return divElement;
    });

    consoleOutput.innerHTML = '';

    classifyLines(logsElements);
    prepareLogLineContent(logsElements);
    addClasses(logsElements);

    logsElements.forEach((element) => {
        consoleOutputDivFormatted.appendChild(element);
    });
}

function addMenu() {
    const scrollElement = document.createElement('img');
    scrollElement.src = 'img/scroll.png';
    scrollElement.alt = 'scroll';

    const menu = `
    <div class="menu">
        <div class="hider" id="hider">
            <img src="${chrome.runtime.getURL('img/arrow.png')}" width="30px" height="30px" alt="arrow" id="menu-arrow">
        </div>
        <ul class="options">
            <li class="private-option option">
                <p>Private</p>
                <input class="private-input" id="private-input" type="text" maxlength="4" value="${PRIVATE}"></input>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-private"></span>
                </label>
            </li>
            <li class="debug-option option">
                <p>Debug</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-debug"></span>
                </label>
            </li>
            <li class="info-option option">
                <p>Info</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-info"></span>
                </label>
            </li>
            <li class="warning-option option">
                <p>Warn</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-warning"></span>
                </label>
            </li>
            <li class="error-option option">
                <p>Error</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-error"></span>
                </label>
            </li>
            <li class="log-option option">
                <p>Log</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-log"></span>
                </label>
            </li>
            <li class="sql-option option">
                <p>Sql</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-sql"></span>
                </label>
            </li>
            <li class="scroll-option">
                <img src="${chrome.runtime.getURL('img/scroll.png')}" width="40px" height="40px" alt="scroll" id="scroll">
                <label class="switch scroll-switch">
                    <input type="checkbox">
                    <span class="slider round" id="option-scroll"></span>
                </label>
            </li>
        </ul>
    </div>`;

    document.querySelector('body').insertAdjacentHTML('afterbegin', menu);

    const menuOptions = ['#option-private', '#option-debug', '#option-info', '#option-warning', '#option-error', '#option-log', '#option-sql'];

    const menuSliders = menuOptions.map((option) => document.querySelector(option));
    menuSliders.forEach((menuSlider) => {
        const cssParameterPrefix = menuSlider.id.split('-')[1];
        const cssParameterSuffix = '-line-display';
        const cssParameter = `--${cssParameterPrefix + cssParameterSuffix}`;
        const localStorageChecked = `${cssParameterPrefix}-checked`;
        let checked = JSON.parse(localStorage.getItem(localStorageChecked));

        if (checked == null) {
            checked = true;
        }
        setDisplayProperty(cssParameter, checked, menuSlider);

        menuSlider.addEventListener('click', () => {
            changeDisplayProperty(cssParameter, localStorageChecked);
        });
    });

    const hider = document.querySelector('#hider');
    const menuArrow = document.querySelector('#menu-arrow');

    hider.addEventListener('click', () => {
        if (hider.parentElement.style.right == '-72px') {
            hider.parentElement.style.right = '10px';
            menuArrow.style.transform = 'scaleX(1)';
        } else {
            hider.parentElement.style.right = '-72px';
            menuArrow.style.transform = 'scaleX(-1)';
        }
    });

    const scrollOption = document.querySelector('#option-scroll');

    const scrollCheckValue = JSON.parse(localStorage.getItem(scrollCheckKey));

    if (scrollCheckValue == null) {
        scrollCheckValue = true;
    }
    scrollOption.previousElementSibling.checked = scrollCheckValue;

    scrollOption.addEventListener('click', () => {
        if (scrollOption.previousElementSibling.checked == true) {
            localStorage.setItem(scrollCheckKey, false);
        } else {
            localStorage.setItem(scrollCheckKey, true);
        }
    });

    const privateInput = document.querySelector('#private-input');
    privateInput.addEventListener('change', () => {
        const array = consoleOutputDivFormatted.childNodes;
        const privateValue = privateInput.value;

        localStorage.setItem('private', privateValue);
        PRIVATE = privateValue;

        classifyLines(array);

        array.forEach((element) => {
            const classList = [...element.classList];
            const classListFiltered = classList.filter((className) => className != 'group');

            element.classList.remove(...classListFiltered);
        });

        addClasses(array);
    });
}

function changeDisplayProperty(cssParameter, localStorageChecked) {
    if (document.documentElement.style.getPropertyValue(cssParameter) != 'none') {
        document.documentElement.style.setProperty(cssParameter, 'none');
        localStorage.setItem(localStorageChecked, false);
    } else {
        document.documentElement.style.setProperty(cssParameter, 'block');
        localStorage.setItem(localStorageChecked, true);
    }
    scrollToBottom();
}

function setDisplayProperty(cssParameter, checked, menuSlider) {
    if (checked == true) {
        menuSlider.previousElementSibling.checked = true;
        document.documentElement.style.setProperty(cssParameter, 'block');
    } else {
        menuSlider.previousElementSibling.checked = false;
        document.documentElement.style.setProperty(cssParameter, 'none');
    }
}

function scrollToBottom() {
    const scrollCheck = JSON.parse(localStorage.getItem(scrollCheckKey));

    if (scrollCheck == true) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

function expandCollapseClickCallback(details) {
    if (details.style.maxHeight != '0px') {
        details.style.maxHeight = '0px';
        details.parentElement.setAttribute('data-content', '+');
    } else {
        details.parentElement.setAttribute('data-content', '-');
        details.style.maxHeight = '100%';
    }
}

function autoExpandCollapse() {
    const details = document.querySelectorAll('details');

    details.forEach((detail) => {
        detail.addEventListener('click', () => {
            expandCollapseClickCallback(detail);
        });
    });
}

addMenu();

observerTasks();
