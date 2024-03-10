import { Request, Response } from "express";
import { pool } from "../config/db";

export const getExtrato = async (req: Request, res: Response) => {    

    try {
        const { id } = req.params;
        const clientResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
        const client = clientResult.rows[0];

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        const transactionsResult = await pool.query('SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT 10', [id]);
        const ultimasTransacoes = transactionsResult.rows;

        const saldoTotal = client.balance;
        const dataExtrato = new Date().toISOString();
        const limit = client.limit_amount;
        
        const formattedOutput = {
            saldo: {
                total: saldoTotal,
                data_extrato: dataExtrato,
                limite: limit
            },
            ultimas_transacoes: ultimasTransacoes.map((transaction) => ({
                valor: transaction.amount,
                tipo: transaction.transaction_type,
                descricao: transaction.description,
                realizada_em: transaction.date.toISOString(),
            })),
        };
    
        return  res.status(200).json(formattedOutput);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error"});
    }
}