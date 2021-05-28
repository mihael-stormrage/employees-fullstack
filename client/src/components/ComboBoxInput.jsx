import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ComboBoxInput = ({ onChange, value, options }) => (
  <Autocomplete
    options={options}
    renderInput={(params) => <TextField {...params} />}
    onChange={(e, newValue) => onChange(newValue)}
    getOptionLabel={(option) => option.name}
    value={value}
    freeSolo
  />
);

export default ComboBoxInput;
