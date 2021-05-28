import { PureComponent } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';

class App extends PureComponent {
  state = { employees: [], jobs: [], departments: [] };

  async componentDidMount() {
    const { data: employees } = await axios.get('/api/employees');
    const { data: jobs } = await axios.get('/api/jobs');
    const { data: departments } = await axios.get('/api/departments');
    this.setState({ employees, jobs, departments });
  }

  render() {
    const { employees, jobs, departments } = this.state;
    return (
      <MaterialTable
        columns={[
          { title: 'Фамилия', field: 'last_name' },
          { title: 'Имя', field: 'first_name', sorting: false },
          { title: 'Отчество', field: 'patronymic', sorting: false }, {
            title: 'Отдел',
            field: 'department_id',
            sorting: false,
            lookup: departments.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}),
          }, {
            title: 'Должность',
            field: 'job',
            lookup: jobs.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}),
            editComponent: (props) => (
              <Autocomplete
                renderInput={(params) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <TextField {...params} />
                )}
                options={jobs.map(({ name }) => name)}
                freeSolo
                value={props.value}
                onChange={(e, newValue) => props.onChange(newValue)}
              />
            ),
          }, {
            title: 'Дата Рождения',
            field: 'birthday',
            type: 'date',
            filtering: false,
            sorting: false,
          }, {
            title: 'Мобильный телефон',
            field: 'tel',
            filtering: false,
            sorting: false,
          }, {
            title: 'Электронная почта',
            field: 'email',
            filtering: false,
            sorting: false,
          },
        ]}
        data={employees}
        title="Энергозапас: Сотрудники"
        options={{ exportButton: true, filtering: true, search: false }}
        editable={{
          onRowAdd: async (newData) => {
            // const { job, department } = newData;
            // const jobId = jobs.find(({ name }) => name === job)?.id;
            // const departmentId = departments.find(({ name }) => name === department)?.id;
            await axios.post('/api/employees', { ...newData /* jobId, departmentId */ });
            this.setState({ employees: [...employees, newData] });
          },
          onRowDelete: async (oldData) => {
            const { id: dbId } = oldData;
            await axios.delete(`/api/employees/${dbId}`);
            this.setState({ employees: employees.filter(({ id }) => id !== dbId) });
          },
          onRowUpdate: async (newData, oldData) => {
            await axios.put('/api/employees', newData);
            const index = oldData.tableData.id;
            const updatedData = [...employees];
            updatedData[index] = newData;
            this.setState({ employees: updatedData });
          },
        }}
      />
    );
  }
}

export default App;
