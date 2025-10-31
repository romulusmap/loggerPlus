import { scrollCheckKey, expandCheckKey } from './constants.js';

export function scrollToBottom() {
    const scrollCheck = JSON.parse(localStorage.getItem(scrollCheckKey));

    if (scrollCheck == true) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

export function expandCollapseClickCallback(details, action) {
    const parent = details.parentElement;
    const isClosed = details.style.maxHeight === '0px' || details.style.maxHeight === '';

    // determine target state: open = true, close = false, undefined = toggle
    let targetOpen;
    if (action === 'open') targetOpen = true;
    else if (action === 'close') targetOpen = false;
    else targetOpen = isClosed; // if currently closed, toggle should open, otherwise close

    if (targetOpen) {
        parent.setAttribute('data-content', '-');
        details.style.maxHeight = '100%';
        const exp = parent.querySelector('.expander');
        if (exp) exp.textContent = '-';
    } else {
        details.style.maxHeight = '0px';
        parent.setAttribute('data-content', '+');
        // update expander control text if present
        const exp = parent.querySelector('.expander');
        if (exp) exp.textContent = '+';
    }
}

export function changeDisplayProperty(cssParameter, localStorageChecked) {
    if (document.documentElement.style.getPropertyValue(cssParameter) != 'none') {
        document.documentElement.style.setProperty(cssParameter, 'none');
        localStorage.setItem(localStorageChecked, false);
    } else {
        document.documentElement.style.setProperty(cssParameter, 'block');
        localStorage.setItem(localStorageChecked, true);
    }
    scrollToBottom();
}

export function setDisplayProperty(cssParameter, checked, menuSlider) {
    if (checked == true) {
        menuSlider.previousElementSibling.checked = true;
        document.documentElement.style.setProperty(cssParameter, 'block');
    } else {
        menuSlider.previousElementSibling.checked = false;
        document.documentElement.style.setProperty(cssParameter, 'none');
    }
}

export function expandAll() {
    const details = document.querySelectorAll('.details');
    details.forEach((detail) => {
        detail.style.maxHeight = '100%';
        const parent = detail.parentElement;
        if (parent) {
            parent.setAttribute('data-content', '-');
            const exp = parent.querySelector('.expander');
            if (exp) exp.textContent = '-';
        }
    });
}

export function collapseAll() {
    const details = document.querySelectorAll('.details');
    details.forEach((detail) => {
        detail.style.maxHeight = '0px';
        const parent = detail.parentElement;
        if (parent) {
            parent.setAttribute('data-content', '+');
            const exp = parent.querySelector('.expander');
            if (exp) exp.textContent = '+';
        }
    });
}

export function setupOption(optionId, checkKey) {
    const option = document.querySelector(`#${optionId}`);

    let checkValue = JSON.parse(localStorage.getItem(checkKey));

    if (checkValue == null) {
        checkValue = true;
    }
    option.previousElementSibling.checked = checkValue;

    option.addEventListener('click', () => {
        if (option.previousElementSibling.checked == true) {
            localStorage.setItem(checkKey, false);
            if (optionId == 'option-expand') {
                expandAll();
            }
        } else {
            localStorage.setItem(checkKey, true);
            if (optionId == 'option-expand') {
                collapseAll();
            }
        }
    });
}

// addMenu accepts an options object so the caller can pass DOM refs and callbacks
export function addMenu({ PRIVATE, consoleOutputDivFormatted, classifyLines, onPrivateChange, onClear }) {
    const menu = `
    <div class="menu jscolor">
        <div class="hider" id="hider">
            <img src="${chrome.runtime.getURL('img/arrow.png')}" width="30px" height="30px" alt="arrow" id="menu-arrow">
        </div>
        <ul class="options">
            <li class="private-option option">
                <p>Private</p>
                <input class="private-input" id="private-input" type="text" maxlength="4" value="${PRIVATE}"  data-jscolor="{}"></input>
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
            <li class="func-option">
                <div class="scroll-option">
                    <img src="${chrome.runtime.getURL('img/scroll.png')}" width="40px" height="40px" alt="scroll" id="scroll">
                    <label class="switch scroll-switch">
                        <input type="checkbox">
                        <span class="slider round" id="option-scroll"></span>
                    </label>
                </div>
                <div class="expand-option">
                    <img src="${chrome.runtime.getURL('img/expand.png')}" width="20px" height="20px" alt="expand" id="expand">
                    <label class="switch scroll-switch">
                        <input type="checkbox">
                        <span class="slider round" id="option-expand"></span>
                    </label>
                </div>
                <div class="clear-output-option" id="clear-output" title="Clear" style="background-image: url('${chrome.runtime.getURL('img/clear.png')}')"></div>
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

    // SCROLL OPTION:
    setupOption('option-scroll', scrollCheckKey);

    // EXPAND OPTION:
    setupOption('option-expand', expandCheckKey);

    // PRIVATE OPTION:

    const privateInput = document.querySelector('#private-input');
    privateInput.addEventListener('change', () => {
        const array = consoleOutputDivFormatted.childNodes;
        const privateValue = privateInput.value;

        localStorage.setItem('private', privateValue);

        classifyLines(array, privateValue);

        if (typeof onPrivateChange === 'function') {
            onPrivateChange(array);
        }
    });

    // CLEAR OUTPUT OPTION
    const clearOutputEl = document.querySelector('#clear-output');
    if (clearOutputEl) {
        clearOutputEl.addEventListener('click', () => {
            if (typeof onClear === 'function') {
                onClear();
            }
        });
        // swap background images on hover (use images added to the extension)
        const clearImg = `url('${chrome.runtime.getURL('img/clear.png')}')`;
        const clearHoverImg = `url('${chrome.runtime.getURL('img/clear_hover.gif')}')`;

        // hover behavior: show hover GIF while pointer is over element
        clearOutputEl.addEventListener('mouseenter', () => {
            clearOutputEl.style.backgroundImage = clearHoverImg;
        });
        clearOutputEl.addEventListener('mouseleave', () => {
            clearOutputEl.style.backgroundImage = clearImg;
        });

        // click animation: tint + enlarge briefly then reset
        clearOutputEl.addEventListener('click', () => {
            // keep existing clear callback
            if (typeof onClear === 'function') {
                onClear();
            }

            // apply active class for CSS-based transform + filter tint
            clearOutputEl.classList.add('active');
            // ensure the hover GIF is showing while animating
            clearOutputEl.style.backgroundImage = clearHoverImg;

            // reset after animation duration
            window.setTimeout(() => {
                clearOutputEl.classList.remove('active');
                // if pointer isn't over element revert to default image
                if (!clearOutputEl.matches(':hover')) {
                    clearOutputEl.style.backgroundImage = clearImg;
                }
            }, 420);
        });
    }
}
