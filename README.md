# Installation Guide for Logger Plus (+) 

![loggerPlusDesc](https://user-images.githubusercontent.com/32149327/221876133-0e5dc73d-c569-4fd2-a72e-ab434e079231.png)

## Prerequisites

Before installing the Logger Plus Edge/Chrome browser extension, you'll need to make sure you meet the following prerequisites:

- A computer running Windows 10 or later.
- The Microsoft Edge or Chrome web browser installed on your computer.

## Installation Steps

To install the Logger Plus, follow these steps:

1. Make sure the folder structure is the same as in repository. If you downloaded the zip-package, unpack it first in a convenient place.

### On Edge:

2. Open the Microsoft Edge web browser on your computer.
3. Click on the three dots in the upper-right corner of the browser window to open the Edge menu.
4. Select "Extensions" from the menu options.
5. In the Extensions menu, click on "Manage extensions".
6. Make sure the "Developer mode" slider is on (blue).
7. Click on the "Load unpacked"
8. Navigate to the folder you downloaded and unpacked the Logger Plus.
9. The extension should now show in the "From other sources" tab.
10. Finally click on the silder to enbale the extension.

### On Chrome:

2. Open the Microsoft Edge web browser on your computer.
3. Click on the three dots in the upper-right corner of the browser window to open the Chrome menu.
4. Select "More tools" -> "Extensions" from the menu options.
5. Make sure the "Developer mode" slider is on (blue).
6. Click on the "Load unpacked"!

7. Navigate to the folder you downloaded and unpacked the Logger Plus.
8. The extension should now show in the "From other sources" tab.
9. Finally click on the silder to enbale the extension.

11. Make sure to reload the debug console tab for the extension to load into the current tab.

## Usage Instructions

- All incoming logs are categorized into one of the 7 types:
    - `PRIVATE` - Private logs, categorized by "up to 4-letter" custom identifier
    - `DEBUG` - Debug logs
    - `INFO` - Informational logs
    - `WARN` - Warning logs - mostly used for deprecated methods
    - `ERROR` - Error logs
    - `LOG` - SlangLogger logs
    - `SQL` - SQL querries logs
- All logs are color coded to their type.
- Each type can be toggled on and off by clicking on the type name in the right side menu.
- Private type can be customized by accessing the input field, changing the value and clicking enter or leaving the field. The value can be up to 4 letters long.
- Code is automatically scrolled to the botton on every log update or when change is made in the right side menu. This can be turned off in the settings menu.
- Log that is longer than few lines will be collapsed by default, and a plus sign will be displayed in the right side of the log. Clicking on the plus sign or the log itself will expand it.
- Clicking again on the log will collapse it.
- You can hide the right side menu by clicking on the hide arrow button on the left side of the menu.
- You can turn the auto expand feature on and off by clicking on the auto expand button in the right side menu. By default, all logs are collapsed.


## Troubleshooting

If you experience any issues with the installation or usage of the extension, try restarting the browser and reloading the debug console tab. If the issue persists, please contact the developer.

## Contact

For ideas, suggestions, or bug reports, please contact me at: [Create a new issue](https://github.com/romulusmap/loggerPlus/issues/new/choose)
