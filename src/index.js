import express from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from"dotenv";

import categoriesRouter from "./Routers/categotiesRoutes.js";
import gamesRouter from "./Routers/gamesRoutes.js";
import clientsRouter from "./Routers/clientsRoutes.js";
import rentRouter from "./Routers/rentRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(clientsRouter);
app.use(rentRouter);

app.listen(process.env.PORT, ()=> console.log(chalk.blue(`Servidor criado na porta ${process.env.PORT}`)));