import { Router } from 'express';
import pool from './db';
const router = new Router();

/* Employees */

const getValues = ({ jobId, firstName, lastName, patronymic, tel, email, birthday }) => [
  jobId, firstName, lastName, patronymic, tel, email, birthday
];

router.get('/employees', (req, res) => {
  const query = `
      SELECT e.id, first_name, last_name, patronymic, tel, email, birthday, j.name AS job, d.name AS department
      FROM employees e
               LEFT JOIN department_jobs j ON j.id = e.job_id
               LEFT JOIN departments d ON d.id = j.department_id`;
  pool.query(query, (q_err, q_res) => res.json(q_res.rows));
});

router.post('/employees', async (req, res, next) => {
  const upsertJobsQuery = `INSERT INTO department_jobs (department_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
  const addEmployeeQuery = `
    INSERT INTO employees(job_id, first_name, last_name, patronymic, tel, email, birthday)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  const { job, departmentId } = req.body;
  const client = pool.connect();
  await client.query('BEGIN');
  const insertRes = await client.query(upsertJobsQuery, [departmentId, job]);
  await client.query(addEmployeeQuery, getValues(req.body));
  await client.query('COMMIT');
  client.release();
  res.json(insertRes.rows[0]);
});

router.put('/employees/:id', (req, res, next) => {
  const { jobId, firstName, lastName, patronymic, tel, email, birthday } = req.body;
  const query=`
    UPDATE employees
        SET job_id = ${jobId},
            first_name = ${firstName},
            last_name = ${lastName},
            patronymic = ${patronymic},
            tel = ${tel},
            email = ${email},
            birthday = ${birthday}
        WHERE id = ${req.params.id}`;
  pool.query(query, (q_err, q_res) => {
    if (q_err) next(q_err);
    res.json(q_res.rows);
  });
});

router.delete('/employees/:id', (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM employees WHERE id = ${id}`;
  pool.query(query, (q_err, q_res) => {
    if (q_err) next(q_err);
    res.json(q_res.rows);
  });
});

/* Jobs */

router.get('/jobs', (req, res) => {
  const query = `SELECT * FROM department_jobs`;
  pool.query(query, (q_err, q_res) => res.json(q_res.rows));
});

/* Departments */

router.get('/departments', (req, res) => {
  const query = `SELECT * FROM departments`;
  pool.query(query, (q_err, q_res) => res.json(q_res.rows));
});

export default router;
