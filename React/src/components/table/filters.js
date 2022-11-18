import React, {useState,useMemo} from 'react';
import './table.scss';
import './filters.scss';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { DateRangePicker } from 'react-dates';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';


/**
 * 
 * Collection of filter UIs
 *  
 */

const SingleValueFilter = ({ column: { filterValue, setFilter, filter, FilterValue, SetFilterValue } }) => {
    return (
      <TextField
        value={FilterValue ? FilterValue : filterValue || ""}
        onChange={e => {
          if (FilterValue) {
           console.log(FilterValue);
           console.log(filter);
           console.log(filterValue);
            SetFilterValue(e.target.value || undefined);
          }
          else{
            setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
          }
        }}
        placeholder={`Search ${filter ? filter : ""}...`}
      />
    );
  };

// Source: https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/kitchen-sink?file=/src/App.js:2131-2851
function SelectColumnFilter({column: { filterValue, setFilter, preFilteredRows, id },}) {
  // Calculate the options for filtering using the preFilteredRows
  const options = useMemo(() => {
    const options_ = new Set();
    preFilteredRows.forEach(row => {
      options_.add(row.values[id])
    });
    return [...options_.values()];
  }, [id, preFilteredRows]);

  return (
    <FormControl className='table-item--fit-width'>
      <NativeSelect
          value={filterValue}
          onChange={e => { setFilter(e.target.value || undefined)}}
          name = {id}
          inputProps={{ 'aria-label': id }}>
          <option value="">All</option>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
      </NativeSelect>
    </FormControl>
  );
};

function SelectMultipleFilter({column: { filterValue=[], setFilter, preFilteredRows, id, FilterValue, SetFilterValue},}) {
 
  const handleChange = (e) => {
    if (FilterValue) {
      SetFilterValue(e.target.value);
    }
    setFilter(e.target.value);
  };

  const renderLabel = (selected) => {
    if (selected.length === 0) {
      return <em>Placeholder</em>;
    }
    else {
      return (selected.join(', '));
    }
  };

  const options = useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    });
    
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <FormControl className='table-item--fit-width'>
      <Select
        id="multi-checkbox"
        multiple
        value={FilterValue ? FilterValue : filterValue}
        onChange={handleChange}
        input={<Input />}
        renderValue={renderLabel}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={FilterValue ? FilterValue.indexOf(option) > -1 : filterValue.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const SelectDateRange = ({column: { filterValue = ['', ''], FilterValue, SetFilterValues,
  preFilteredRows, setFilter, id , setExtra},}) => {
    // setExtra is used to ensure page refreshes on FilterValue change
  const handleFrom = (e) => {
   
    let tmp = FilterValue || filterValue;
    tmp[0] = e.target.value;
    setFilter(tmp);
    if (SetFilterValues) {
      setExtra(tmp[0]);
      SetFilterValues(tmp);
    }
  };

  const handleTo = (e) => {
   
    let tmp = FilterValue || filterValue;
    tmp[1] = e.target.value;
    setFilter(tmp);
    if (SetFilterValues) {
      setExtra(tmp[1]);
      SetFilterValues(tmp);
    }
  };

  return (
    <div className='container--space-between container--align-dates'>
      <TextField 
        label='From'
        value={FilterValue ? FilterValue[0] : filterValue[0]} type='date'
        onChange={handleFrom}
        InputLabelProps={{ shrink: true, }}
      /> 
      <TextField
        label='To'
        value={FilterValue ? FilterValue[1] : filterValue[1]} type='date'
        onChange={handleTo}
        InputLabelProps={{ shrink: true, }}
      />
    </div>)
};

export const SelectDateRangePicker = ({column: { filterValue = [null, null], // Unused alternate filter UI
  preFilteredRows, setFilter, id },}) => {
  const [focus, setFocus] = useState(null);
  return (
    <DateRangePicker
      startDate={filterValue[0]}
      startDateId='start-date'
      endDate={filterValue[1]}
      endDateId='end_date'
      onDatesChange={({startDate,endDate}) => {
        setFilter([startDate,endDate]);
        }}
      focusedInput={focus}
      onFocusChange={(focusedInput) => setFocus(focusedInput)}
      isOutsideRange={() => null} // Larger date range selectable
    />);
};

export const SelectDate = ({column: {filterValue, setFilter, FilterValue, SetFilterValue}}) => {
  const handleChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (SetFilterValue) {
      SetFilterValue(value);
    }
  };
  return (
    <TextField
        value={FilterValue || filterValue || ''} type='date'
        onChange={handleChange}
        InputLabelProps={{ shrink: true, }}
      />
  )
}

const FilterTitle = () => {
  return (
    <div>Filters</div>
  )
};

export {SingleValueFilter, SelectColumnFilter, SelectMultipleFilter, SelectDateRange, FilterTitle};