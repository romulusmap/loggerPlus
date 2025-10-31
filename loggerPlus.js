import { LINESTYPES, indentifierRegex2, expandCheckKey } from './src/constants.js';
import { isPartOfIdentifier, mergePairs, classifyLines } from './src/logParser.js';
import { addMenu, expandCollapseClickCallback, scrollToBottom } from './src/uiMenu.js';

const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.runtime.getURL('resources/jscolor-2.5.1/jscolor.js'));
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
head.insertBefore(script, head.lastChild);

let consoleOutput;
let consoleOutputDivFormatted;
let PRIVATE = localStorage.getItem('private') || '~~';

function addClasses(array) {
    array.forEach((elem) => {
        if (elem.dataset && elem.dataset.type && LINESTYPES[elem.dataset.type]) {
            elem.classList.add(LINESTYPES[elem.dataset.type]);
        }
        elem.classList.add('line');
    });
}

function textToDiv() {
    if (!consoleOutput) return;
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

    classifyLines(logsElements, PRIVATE);
    prepareLogLineContent(logsElements);
    addClasses(logsElements);

    logsElements.forEach((element) => {
        consoleOutputDivFormatted.appendChild(element);
    });
}

function observerTasks() {
    textToDiv();
    scrollToBottom();
}

function init() {
    // DOM-dependent initialization
    consoleOutput = document.getElementById('debugConsoleOutput');
    if (!consoleOutput) {
        consoleOutput = document.getElementsByTagName('pre')[0];
    }

    consoleOutputDivFormatted = document.createElement('pre');
    consoleOutput.insertAdjacentElement('afterend', consoleOutputDivFormatted);

    const observer = new MutationObserver(observerTasks);
    observer.observe(consoleOutput, { childList: true });

    addMenu({
        PRIVATE,
        consoleOutputDivFormatted,
        classifyLines,
        onPrivateChange: (array) => {
            // Work only on element nodes to avoid text/comment nodes which don't
            // have classList/dataset. Filter and then remove old non-group classes
            // and re-add based on dataset.type.
            const elements = Array.from(array).filter((n) => n && n.nodeType === 1);
            elements.forEach((element) => {
                const classList = Array.from(element.classList || []);
                const classListFiltered = classList.filter((className) => className != 'group');

                if (classListFiltered.length > 0) {
                    element.classList.remove(...classListFiltered);
                }
            });

            addClasses(elements);
        },
        onClear: () => {
            try {
                if (consoleOutput) {
                    consoleOutput.innerHTML = '';
                }
                if (consoleOutputDivFormatted) {
                    consoleOutputDivFormatted.innerHTML = '';
                }
            } catch (err) {
                console.error('Error clearing output', err);
            }
        },
    });

    observerTasks();
}



function prepareLogLineContent(array) {
    array.forEach((child) => {
        if (isPartOfIdentifier(child.innerHTML)) {
            const matchedString = child.innerHTML.match(indentifierRegex2)[0];
            const restString = child.innerHTML.split(matchedString)[1];
            const firstLine = restString.split('\n')[0];
            const restLines = restString.split('\n').slice(1).join('\n');

            const expandOn = localStorage.getItem(expandCheckKey);
            const maxHeight = expandOn === 'true' ? 'max-height: 0px;' : 'max-height: 100%;';
            const plusMinus = expandOn === 'true' ? '+' : '-';

            child.innerHTML = `<span class="indentifier">${matchedString}</span>${firstLine}${restLines ? `<div class="details" style="${maxHeight}">${restLines}</div>` : ''}`;
            if (restLines) {
                child.dataset.content = plusMinus;
                child.classList.add('group');

                // create a dedicated expander control so clicking the row text
                // (for copy/select) doesn't toggle expand/collapse
                const expander = document.createElement('button');
                expander.type = 'button';
                expander.className = 'expander';
                expander.setAttribute('aria-label', 'Expand');
                expander.textContent = plusMinus;

                // clicking the expander: open if it's currently '+', close if '-'
                expander.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const details = child.lastElementChild;
                    if (!details) return;
                    const isMinus = expander.textContent && expander.textContent.trim() === '-';
                    expandCollapseClickCallback(details, isMinus ? 'close' : 'open');
                });

                // keyboard accessibility: Enter / Space activate same as click
                expander.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const details = child.lastElementChild;
                        if (!details) return;
                        const isMinus = expander.textContent && expander.textContent.trim() === '-';
                        expandCollapseClickCallback(details, isMinus ? 'close' : 'open');
                    }
                });

                // insert the expander at the start of the child
                child.prepend(expander);

                // clicking the row should open the details but not close them
                // (closing remains the responsibility of the minus button)
                child.addEventListener('click', (e) => {
                    try {
                        const details = child.lastElementChild;
                        if (!details) return;
                        // if currently closed, open; otherwise do nothing
                        const closed = details.style.maxHeight === '0px' || details.style.maxHeight === '';
                        if (closed) {
                            expandCollapseClickCallback(details, 'open');
                        }
                    } catch (err) {
                        console.error('row click open error', err);
                    }
                });

                
            }
            // Attach dblclick to the row regardless of whether it has restLines
            child.addEventListener('dblclick', (e) => {
                try {
                    // prefer left button only (if available)
                    if (typeof e.button === 'number' && e.button !== 0) return;

                    const marker = 'SlangLogger:';
                    const text = (child.innerText || child.textContent || '').toString();
                    const idx = text.indexOf(marker);
                    if (idx === -1) return;

                    const toCopy = text.substring(idx + marker.length).trim();
                    if (!toCopy) return;

                    // attempt navigator.clipboard first
                    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                        navigator.clipboard.writeText(toCopy).then(() => {
                            // show tooltip as confirmation
                            showCopiedTooltip(child);
                        }).catch((err) => {
                            console.error('Copy to clipboard failed', err);
                        });
                    } else {
                        // fallback: temporary textarea
                        const ta = document.createElement('textarea');
                        ta.value = toCopy;
                        document.body.appendChild(ta);
                        ta.select();
                            try {
                                document.execCommand('copy');
                                showCopiedTooltip(child);
                            } catch (err) {
                                console.error('Fallback copy failed', err);
                            }
                            ta.remove();
                    }
                } catch (err) {
                    console.error('dblclick handler error', err);
                }
            });
        }
    });
}

// transient tooltip for copy confirmation
function showCopiedTooltip(targetEl, text = 'Copied') {
    try {
        const tip = document.createElement('div');
        tip.className = 'copy-tooltip';
        tip.textContent = text;
        document.body.appendChild(tip);

        const rect = targetEl.getBoundingClientRect();
        // position above the element, centered
        const tipRect = tip.getBoundingClientRect();
        let top = window.scrollY + rect.top - tipRect.height - 8;
        let left = window.scrollX + rect.left + rect.width / 2 - tipRect.width / 2;

        // clamp to viewport
        top = Math.max(8, top);
        left = Math.max(8, Math.min(left, window.scrollX + document.documentElement.clientWidth - tipRect.width - 8));

        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;

        // animate in then out
        requestAnimationFrame(() => {
            tip.classList.add('visible');
        });
        setTimeout(() => {
            tip.classList.remove('visible');
            setTimeout(() => tip.remove(), 280);
        }, 700);
    } catch (err) {
        console.error('Tooltip error', err);
    }
}

// UI/menu functions are provided by src/uiMenu.js

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
