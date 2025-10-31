export const LINESTYPES = {
    PRIVATE: 'private-line',
    DEBUG: 'debug-line',
    INFO: 'info-line',
    WARN: 'warning-line',
    ERROR: 'error-line',
    LOG: 'log-line',
    SQL: 'sql-line',
};

export const CLASSIFIERS = {
    DEBUG: ['DEBUG'],
    INFO: ['INFO'],
    WARN: ['WARN'],
    ERROR: ['ERROR', 'Exception', '\tat ', '... ', 'Details: ', '] ', 'Caused by: ', 'An exception has occured:', 'general error', 'BreakthroughOpenFormCtrl:'],
    LOG: [' SlangLogger:'],
    SQL: ['SQL query', 'SQL API query', 'select ', 'SELECT', 'SQLGenerator:', 'SQL API'],
};

export const indentifierRegex2 = /([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?,[0-9]+\s+[a-zA-Z]+\s+\[[A-Za-z0-9]+\]\s+'[A-Za-z0-9]+'\s+\[[A-Za-z0-9]*\])/i;

export const scrollCheckKey = 'scroll-check';
export const expandCheckKey = 'expand-check';
export const clearOutputId = 'clear-output';
