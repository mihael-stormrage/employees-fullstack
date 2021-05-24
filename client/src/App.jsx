import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import { PureComponent } from 'react';
import axios from 'axios';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

const { ExportCSVButton } = CSVExport;

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
    const columns = [{
      dataField: 'last_name',
      text: 'Фамилия',
      sort: true,
      filter: textFilter(),
    }, {
      dataField: 'first_name',
      text: 'Имя',
      filter: textFilter(),
    }, {
      dataField: 'patronymic',
      text: 'Отчество',
      filter: textFilter(),
    }, {
      dataField: 'department',
      text: 'Отдел',
      filter: selectFilter({
        options: departments.map(({ id, name }) => ({ [id]: name })),
      }),
    }, {
      dataField: 'job',
      text: 'Должность',
      sort: true,
      filter: textFilter(),
    }, {
      dataField: 'birthday',
      text: 'Дата рождения',
      type: 'date',
    }, {
      dataField: 'tel',
      text: 'Мобильный телефон',
    }, {
      dataField: 'email',
      text: 'Электронная почта',
    }];
    return (
      <ToolkitProvider keyField="id" data={employees} columns={columns} bootstrap4 exportCSV>
        {({ baseProps, csvProps }) => (
          <div>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ExportCSVButton {...csvProps} className="btn-success">Export CSV</ExportCSVButton>
            <hr />
            <BootstrapTable
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...baseProps}
              filter={filterFactory()}
              noDataIndication="Table is Empty"
              hover
            />
          </div>
        )}
      </ToolkitProvider>
    );
  }
}

export default App;
