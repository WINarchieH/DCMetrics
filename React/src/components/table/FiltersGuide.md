# Filters

The filters are composed of two components:
- a UI Component (What the filter looks like)
- Filter Logic (How columns are filtered based on UI)

The choice of filter and filter logic is specified in the table column header
and is specified by filter (for specifying the logic) and Filter (for the UI).

```javascript
    {... , Filter: <Component>, filter: 'filter logic'   , ...}
```

For filtering to function, the UI and Filter Logic must be appropriately paired 
when specified in the header. (Eg. Two valued vs. One valued filters).

Note. filter logic names are specified in `table.js` in filterTypes.

## Filter Pairs
|Filter UI Name        | Compatible Filter Logic | 
|---|---|
|SingleValueFilter     | equality, text          |
|SelectColumnFilter    | equality                |
|SelectMultipleFilter  | contains                |
|SelectDateRange       | date                    |
|SelectDate            | dateFrom, dateTo        |

## filterTypes.js

This file specifies the filter logic.

## filters.js

This file contains the UI.

|Filter UI Name        | Description | 
|---|---|
|SingleValueFilter     | Textfield taking in text input |
|SelectColumnFilter    | Dropdown selecting a single value |
|SelectMultipleFilter  | Dropdown that can select multiple options |
|SelectDateRange       | Two date fields for selecting to and from range |
|SelectDate            | Single date field for selecting date |
