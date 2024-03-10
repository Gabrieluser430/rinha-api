import express from "express";
import { handleTransaction } from '../controllers/transactionsController';
import { getExtrato } from '../controllers/extratoController';
import { Request, Response } from 'express';


export const routes = express.Router();

routes.get('/clientes/:id/extrato', getExtrato);
routes.post('/clientes/:id/transacoes', handleTransaction);

