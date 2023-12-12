/* eslint-disable no-debugger */
import { Autocomplete, createFilterOptions } from '@mui/material';
import MyTextField from 'components/MyTextField';
import { search } from 'utils/helpers';

const filter = createFilterOptions();

const formatter = (values) =>
  values.map((value) => (typeof value === 'string' ? value : value.value));

const MyAutoComplete = ({
  multiple = true,
  label = '',
  onChange,
  value,
  options = [],
  inputProps,
  creatable = true,
  enableOnBlur = true,
  ...props
}) => {
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      onChange([...value, newValue]);
      return;
    }

    if (newValue && newValue.inputValue) {
      onChange([...value, newValue.inputValue]);
      return;
    }

    onChange(enableOnBlur ? formatter(newValue) : newValue);
  };

  const handleFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = filtered.find((option) => search(inputValue, option.label));

    if (inputValue !== '' && !isExisting && creatable) {
      filtered.push({
        label: inputValue,
        value: inputValue
      });
    }

    return filtered;
  };

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      value={value}
      multiple={multiple}
      onChange={handleChange}
      renderInput={(params) => {
        const { value: notSavedValue } = params.inputProps;

        return (
          <MyTextField
            {...params}
            {...inputProps}
            label={label}
            onBlur={() => {
              if (!enableOnBlur) {
                return;
              }

              if (notSavedValue) {
                onChange([...value, notSavedValue]);
              }
            }}
          />
        );
      }}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "new value" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      filterOptions={handleFilterOptions}
      options={options}
      {...props}
    />
  );
};

export default MyAutoComplete;
