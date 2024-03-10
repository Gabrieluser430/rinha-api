import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes/index";
import { pool } from './config/db';

const app = express();
app.use(bodyParser.json());

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        app.use(routes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
});


