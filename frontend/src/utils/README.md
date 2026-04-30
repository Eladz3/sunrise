# Utils

Pure utility functions and helpers.

## What belongs here:
- **Date/time utilities** - Date formatting, timezone handling
- **String utilities** - Formatting, validation, parsing
- **Array/object helpers** - Sorting, filtering, transforming data
- **Validation helpers** - Form validation, data validation
- **Constants** - App-wide constants (if small; otherwise use /config)

## Examples:
- `date.ts` - `formatDate()`, `isUpcoming()`, `getDuration()`
- `string.ts` - `truncate()`, `capitalize()`, `slugify()`
- `validation.ts` - `isValidEmail()`, `isValidUrl()`
- `array.ts` - `groupBy()`, `sortByDate()`
- `constants.ts` - `MAX_FILE_SIZE`, `DATE_FORMAT`

## Characteristics:
- Pure functions (no side effects)
- Framework-agnostic (no React/Firebase dependencies)
- Easily testable
- Single responsibility

## Note:
- If a utility is specific to one feature, keep it in that feature folder
- Export functions individually for tree-shaking
