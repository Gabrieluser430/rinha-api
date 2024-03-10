import { Request, Response } from 'express';
import { pool } from "../config/db";

export const handleTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clientResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
        const client = clientResult.rows[0];
            
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
    
        const { value, type, description } = req.body;
        const date = new Date().toISOString();

        await pool.query('INSERT INTO transactions (account_id, amount, transaction_type, description, date) VALUES ($1, $2, $3, $4, $5)', [id, value, type, description, date]);
    
        if (type === 'd' && client.balance - value < -client.limit_amount) {
            return res.status(422).json({ error: "Transaction would leave balance inconsistent"});
        }

        let result;
    
        if (type === 'd') {
            result = client.balance - value;
            await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [result, id]);
        } else if (type === 'c') {
            result = client.balance + value;
            await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [result, id]);
        }
        const updatedClientResult = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
        const updatedClient = updatedClientResult.rows[0];

        return res.status(200).json({ limite: updatedClient.limit_amount, saldo: updatedClient.balance });
    } catch (error) {
        console.error('Error handling transaction:', error);
        return res.status(500).json({error: "Internal Server Error"})
    }
};


