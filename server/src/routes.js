import { Router } from 'express';
import pool from './db';
const router = new Router();

/* Employees */

const getValues = ({ job_id, first_name, last_name, patronymic, tel, email, birthday }) => [
  job_id, first_name, last_name, patronymic, tel, email, birthday
];

const upsertEmployee = async (employeeQuery, queryParams, req, res) => {
  const upsertJobsQuery = `
    INSERT INTO department_jobs (department_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id`;
  const { job, job_id, department_id } = req.body;
  const client = await pool.connect();
  await client.query('BEGIN');
  if (!job_id && job) req.body.job_id = (await client.query(upsertJobsQuery, [department_id, job])).rows[0].id;
  const insertRes = await client.query(employeeQuery, queryParams);
  await client.query('COMMIT');
  client.release();
  res.json(insertRes.rows[0]);
};

router.get('/employees', (req, res) => {
  const query = `
      SELECT e.id, first_name, last_name, patronymic, tel, email, birthday, job_id, department_id
      FROM employees e
               LEFT JOIN department_jobs j ON j.id = e.job_id
               LEFT JOIN departments d ON d.id = j.department_id`;
  pool.query(query, (q_err, q_res) => res.json(q_res.rows));
});

router.post('/employees', (req, res, next) => {
  const addEmployeeQuery = `
    INSERT INTO employees(job_id, first_name, last_name, patronymic, tel, email, birthday)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  upsertEmployee(addEmployeeQuery, getValues(req.body), req, res);
});

router.put('/employees', (req, res, next) => {
  const updateEmployeeQuery=`
    UPDATE employees
        SET job_id = $1,
            first_name = $2,
            last_name = $3,
            patronymic = $4,
            tel = $5,
            email = $6,
            birthday = $7
        WHERE id = $8`;
  upsertEmployee(updateEmployeeQuery, [...getValues(req.body), req.body.id], req, res);
});

router.delete('/employees/:id', (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM employees WHERE id = $1`;
  pool.query(query, [id], (q_err, q_res) => {
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
