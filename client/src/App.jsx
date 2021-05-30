import { PureComponent } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';

import ComboBoxInput from './components/ComboBoxInput';

class App extends PureComponent {
  state = {
    employees: [], jobs: [], departments: [], editable: {},
  };

  async componentDidMount() {
    const { data: employees } = await axios.get('/api/employees');
    const { data: jobs } = await axios.get('/api/jobs');
    const { data: departments } = await axios.get('/api/departments');
    this.setState({ employees, jobs, departments });
  }

  onEdit = (idColName, nameColName) => ({ id, name }) => {
    this.setState({ editable: { [idColName]: id, [nameColName]: name } });
  };

  onEditJob = (props) => (
    // eslint-disable-next-line react/destructuring-assignment
    <ComboBoxInput value={props.value} options={this.state.jobs} onEdit={this.onEdit('job_id', 'job')} />
  );

  render() {
    console.log('App rendered');
    const {
      employees, jobs, departments, editable,
    } = this.state;
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
            field: 'job_id',
            lookup: jobs.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}),
            editComponent: this.onEditJob,
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
        options={{
          exportButton: true, filtering: true, search: false, pageSize: 10,
        }}
        editable={{
          onRowAdd: async (newData) => {
            const newRow = { ...newData, ...editable };
            await axios.post('/api/employees', newRow);
            this.setState({ employees: [...employees, newData], editable: [] });
          },
          onRowDelete: async (oldData) => {
            const { id: dbId } = oldData;
            await axios.delete(`/api/employees/${dbId}`);
            this.setState({ employees: employees.filter(({ id }) => id !== dbId) });
          },
          onRowUpdate: async (newData, oldData) => {
            const newRow = { ...newData, ...editable };
            console.log(editable);
            console.log(newRow);
            await axios.put('/api/employees', newRow);
            const index = oldData.tableData.id;
            const updatedData = [...employees];
            updatedData[index] = newRow;
            this.setState({ employees: updatedData, editable: [] });
          },
        }}
      />
    );
  }
}

export default App;
