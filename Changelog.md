## v1.0.0 - Initial Release

- Added basic functionality to the extension
- Implemented user interface elements
- Created settings menu to allow users to customize their experience

## v1.1.0 - Improved UI

- Added hide/show button to the menu bar
- Added option to turn on/off the auto-scroll feature
- Reworked the visual design of the menu a bit

## v1.2.0 - Implemented private logs customization

- Added input field to the menu bar to allow users to customize the private logs
- Rewrote the visual design of the menu a bit
- Changed variables keywords

## v1.2.1 - Bug fix
- Fixed missing collapse/expand button when customizing private logs

## v1.2.2 - Small changes
- Added support for Final Environment

## v1.2.3 - Bug fix
- Fixed bad assignment of local storage variable

## v1.2.4 - Bug fix
- Fixed bad assignment of local storage variable

## v1.2.5 - Added auto-expand
- Added auto-expand feature that determines whether or not the logs should be expanded by default.

## v1.2.6 - Matches update
- Added support for Dnata project in Dubai console.

## v1.2.7 - Matches update
- Fixed incorrect Error classification.
- Added support for all staged and current black.axit logs.

## v1.3.0 - QOL improvements

- UI/UX improvements
	- Added a dedicated expander control on each multiline row; clicking the row or the '+' opens, and only the '−' button closes. Text selection no longer toggles rows.
	- Expand All / Collapse All slider now keeps every row's expander icon ('+' / '−') in sync with the actual state.
	- Restored expander visual to a softer rounded rectangle (matching the previous look).
- Quick copy for SlangLogger
	- Double-left-click inside any row containing "SlangLogger:" copies everything after that marker to the clipboard.
	- Shows a small "Copied" tooltip near the row as confirmation.
- Clear output button
	- Replaced the text button with an image-only clear icon that shows a white icon by default, an animated hover variant, and a brief click animation.
	- Clicking it clears both the original and formatted outputs.
- Under the hood
	- Switched to ES module structure (constants, parser, UI) with a small loader for robust content-script imports.
	- Added required assets to web_accessible_resources.
	- Guarded DOM operations to avoid occasional classList errors.