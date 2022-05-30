import chalk from "chalk";
import connection from "../data.js";

export async function getCategories(req,res){
    try {
        const request = await connection.query("SELECT * FROM categories");
        res.status(200).send(request.rows);
    } catch (err) {
        console.log(chalk.red("Erro ao buscar categoria"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}

export async function postCategories(req,res){
    try {
        const request = await connection.query(
            `SELECT * 
            FROM categories 
            WHERE name=$1`,
            [req.body.name]
        );

        if (request.rows.length > 0) {
            res.status(409).send("Categoria já cadastrada");
        }

        await connection.query(
            `
            INSERT INTO categories (name)
            VALUES($1);
        `,
            [req.body.name]
        );

        res.status(201).send("Caregoria criada com sucesso");
    } catch (err) {
        console.log(chalk.red("Erro ao postar Categoria"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}