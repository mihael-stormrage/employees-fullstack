import { Pool } from 'pg';

export default new Pool({
  user: 'mihan',
  host: 'localhost',
  database: 'energozapas',
  password: '',
  port: 5432,
});
