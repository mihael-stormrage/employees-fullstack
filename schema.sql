DROP TABLE IF EXISTS employees, departments, departments_jobs;

CREATE TABLE departments (
    id   smallint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(255) UNIQUE NOT NULL
);

CREATE TABLE department_jobs (
    id            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    department_id smallint REFERENCES departments (id),
    name          varchar(255) NOT NULL
);

CREATE UNIQUE INDEX ON department_jobs(name, COALESCE(department_id, '-1'));

CREATE TABLE employees (
    id         bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    job_id     integer REFERENCES department_jobs (id),
    first_name varchar(255) NOT NULL,
    last_name  varchar(255) NOT NULL,
    patronymic varchar(255),
    tel        varchar(20)  NOT NULL,
    email      varchar(255) NOT NULL,
    birthday   date
);

CREATE UNIQUE INDEX ON employees
    (first_name, last_name, COALESCE(patronymic, ''), COALESCE(birthday, '0001-01-01'));
