// Non-module loader for loggerPlus. This script runs as a regular content script
// and dynamically imports the module version at runtime. This works around
// environments where manifest "type": "module" isn't taking effect.

(async function() {
    try {
        const moduleUrl = chrome.runtime.getURL('loggerPlus.js');
        // Dynamic import returns the module namespace
        await import(moduleUrl);
    } catch (err) {
        console.error('LoggerPlus: dynamic import failed', err);
    }
})();
