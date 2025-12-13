# Screenshots for Readonly Toggle Feature

This directory contains screenshots demonstrating the readonly toggle functionality added to the form-viewer.

## Feature Overview

Added a Switch component to the form-viewer that allows users to toggle read-only mode for the entire form. When enabled, all form fields become readonly regardless of their individual schema settings.

## Screenshots

### 01-readonly-toggle-off.png
**Full page view with readonly toggle OFF (default state)**
- Shows the form-viewer with the person schema loaded
- Toggle switch is in the OFF position (left side)
- Form fields are editable (no readonly attribute)
- This is the default state when the page loads

### 02-toggle-closeup-off.png
**Close-up of the toggle control in OFF state**
- Shows the "Read-only mode" label next to the toggle
- Toggle switch is unchecked (gray background, thumb on left)
- Located in a bordered container above the form

### 03-readonly-toggle-on.png
**Full page view with readonly toggle ON**
- Same form-viewer page after clicking the toggle
- Toggle switch is now in the ON position (right side)
- All form fields are now readonly (have readonly attribute)
- Form is still visible but fields cannot be edited

### 04-toggle-closeup-on.png
**Close-up of the toggle control in ON state**
- Shows the "Read-only mode" label next to the toggle
- Toggle switch is checked (blue/primary background, thumb on right)
- Visual feedback clearly indicates readonly mode is active

### 05-field-readonly-state.png
**Full page demonstrating readonly field state**
- Shows the form with readonly mode enabled
- All input fields have the readonly attribute set
- Fields still display their values but cannot be modified

## Technical Details

### Changes Made
- Added `readonly` prop to `SchemaForm` component (boolean, default: false)
- Added state management in form-viewer: `const [readonly, setReadonly] = useState(false)`
- Added Switch UI component from shadcn/ui with Label
- Toggle is styled in a bordered, muted container above the form
- When toggle is ON, `readonly={readonly || isReadonly}` ensures form-level override

### Verification
The screenshots verify that:
1. ✅ Toggle appears in form-viewer UI
2. ✅ Toggle has clear label "Read-only mode"
3. ✅ Toggle can be switched between OFF and ON states
4. ✅ When OFF, fields do NOT have readonly attribute (readonly="null")
5. ✅ When ON, fields DO have readonly attribute (readonly="")
6. ✅ Visual feedback (color, position) clearly indicates current state
7. ✅ Form layout remains intact with toggle added
