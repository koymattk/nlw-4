import 'reflect-metadata';
import createConnection from './database';
import express from 'express';
import { router } from './router';

createConnection()
const app = express();

app.use(express.json());
app.use(router);

export default app