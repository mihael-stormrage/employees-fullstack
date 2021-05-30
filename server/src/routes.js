import { Router } from 'express';
import db from './db';
const router = new Router();

/* Employees */

const upsertEmployee = (query) => (req, res, next) => {
  const { job, job_id, department_id } = req.body;
  db.transaction((trx) => {
    if (!job_id && job) {
      trx('department_jobs')
        .insert({ department_id, job }, 'id')
        .onConflict().ignore()
        .then(([id]) => req.body.job_id = id);
    }
    return query(req).transacting(trx);
  }).then(() => res.json(req.body.job_id))
    .catch((err) => next(err));
};

router.get('/employees', (req, res, next) => {
  db('employees')
    .leftJoin('department_jobs', { 'employees.job_id': 'department_jobs.id' })
    .leftJoin('departments', { 'department_jobs.id': 'departments.id' })
    .select('employees.id', 'first_name', 'last_name', 'patronymic', 'tel', 'email', 'birthday', 'job_id', 'department_id')
    .then((records) => res.json(records))
    .catch((err) => next(err));
});

router.post('/employees', upsertEmployee((req) => {
  const { job_id, first_name, last_name, patronymic, tel, email, birthday } = req.body;
  return db('employees')
    .insert({ job_id, first_name, last_name, patronymic, tel, email, birthday });
}));

router.put('/employees', upsertEmployee((req) => {
  const { id, job_id, first_name, last_name, patronymic, tel, email, birthday } = req.body;
  return db('employees')
    .update({ job_id, first_name, last_name, patronymic, tel, email, birthday })
    .where({ id });
}));

router.delete('/employees/:id', (req, res, next) => {
  const { id } = req.params;
  db('employees').delete().where({ id })
    .then(() => res.end())
    .catch((err) => next(err));
});

/* Jobs */

router.get('/jobs', (req, res, next) => {
  db('department_jobs')
    .then((r) => res.json(r))
    .catch((err) => next(err));
});

/* Departments */

router.get('/departments', (req, res, next) => {
  db('departments')
    .then((r) => res.json(r))
    .catch((err) => next(err));
});

export default router;
