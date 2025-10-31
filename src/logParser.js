import { indentifierRegex2, CLASSIFIERS } from './constants.js';

export function isPartOfIdentifier(input) {
    return indentifierRegex2.test(input);
}

export function mergePairs(array) {
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

// Classify DOM elements representing log lines.
// This function mutates element.dataset.type based on classifiers and private token.
export function classifyLines(array, PRIVATE) {
    array.forEach((div) => {
        const text = div.textContent;

        if (isPartOfIdentifier(text)) {
            if (CLASSIFIERS.ERROR.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'ERROR';
            }
            if (CLASSIFIERS.DEBUG.some((classifier) => text.includes(classifier)) && CLASSIFIERS.SQL.every((classifier) => !text.includes(classifier))) {
                div.dataset.type = 'DEBUG';
            }
            if (CLASSIFIERS.INFO.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'INFO';
            }
            if (CLASSIFIERS.WARN.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'WARN';
            }
            if (CLASSIFIERS.LOG.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'LOG';
            }
            if (CLASSIFIERS.SQL.some((classifier) => text.includes(classifier))) {
                div.dataset.type = 'SQL';
            }
        }
        if (PRIVATE && text.includes(PRIVATE)) {
            div.dataset.type = 'PRIVATE';
        }
    });
}
