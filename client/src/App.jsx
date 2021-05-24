import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { PureComponent } from 'react';
import axios from 'axios';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
    const textFilter = { type: 'TextFilter', condition: 'like' };
    const selectFilter = (ent) => ({
      type: 'SelectFilter',
      condition: 'like',
      options: ent.map(({ name }) => name),
    });
    return (
      <BootstrapTable
        data={employees}
        keyField="id"
        version="4"
        hover
        insertRow
        deleteRow
        selectRow={{ mode: 'checkbox' }}
        exportCSV
        pagination
        ignoreSinglePage
        options={{ }}
      >
        <TableHeaderColumn dataField="last_name" dataSort filter={textFilter}>Фамилия</TableHeaderColumn>
        <TableHeaderColumn dataField="first_name" filter={textFilter}>Имя</TableHeaderColumn>
        <TableHeaderColumn dataField="patronymic" filter={textFilter}>Отчество</TableHeaderColumn>
        <TableHeaderColumn dataField="department" filter={selectFilter(departments)}>
          Отдел
        </TableHeaderColumn>
        <TableHeaderColumn dataField="job" dataSort filter={selectFilter(jobs)}>
          Должность
        </TableHeaderColumn>
        <TableHeaderColumn dataField="birthday">Дата рождения</TableHeaderColumn>
        <TableHeaderColumn dataField="tel">Мобильный телефон</TableHeaderColumn>
        <TableHeaderColumn dataField="email">Электронная почта</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default App;
