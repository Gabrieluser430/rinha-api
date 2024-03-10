import { Pool } from 'pg';

const connectionConfig = {
    user: 'postgres',
    host: 'mypostgres',
    database: 'rinha', 
    password: '123123',
    port: 5432,
  };

export const pool = new Pool(connectionConfig);


