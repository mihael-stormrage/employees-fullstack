import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

const ComboBoxInput = ({
  onEdit, onChange, value, options,
}) => (
  <Autocomplete
    value={options.find(({ id }) => id === value)}
    defaultValue={{}}
    options={options}
    renderInput={(params) => <TextField {...params} />}
    onChange={(e, newValue) => {
      // onChange(newValue);
      if (typeof newValue === 'string') onEdit({ name: newValue });
      // Create a new value from the user input
      else if (newValue?.inputValue) onEdit({ name: newValue.inputValue });
      else onEdit(newValue ?? {});
    }}
    filterOptions={(fOptions, params) => {
      const filtered = filter(fOptions, params);
      // Suggest the creation of a new value
      if (params.inputValue !== '') {
        filtered.push({ inputValue: params.inputValue, name: `Add "${params.inputValue}"` });
      }
      return filtered;
    }}
    getOptionLabel={(option) => {
      // Value selected with enter, right from the input
      if (typeof option === 'string') return option;
      // Add "xxx" option created dynamically
      if (option.inputValue) return option.inputValue;
      // Regular option
      return option.name;
    }}
    renderOption={(option) => option.name}
    selectOnFocus
    freeSolo
  />
);

export default ComboBoxInput;
