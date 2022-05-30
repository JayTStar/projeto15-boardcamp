import connection from "../data.js";
import chalk from "chalk";

export async function getGames(req,res){
    let filter = req.query.name?.toLowerCase();
    filter = filter?`${filter}%` : "%";

    try{
        const request = await connection.querry(
            `
                SELECT games.*, categories.name AS "categoryName
                FROM games
                JOIN categories ON games."categoryId" = categories.id
                WHERE LOWER(games.name)
                LIKE $1
            `,
            [filter]
        );

        res.status(200).send(request.rows);
    }
    catch(err){
        console.log(chalk.red("Erro ao pegar games"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}

export async function postGames(req,res){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    try{
        const category = await connection.query(
            `
                SELECT * FROM categories
                WHERE id = $1
            `, 
            [categoryId]
        );

        if(category.rows.length === 0){
            res.status(400).send("Categoria não cadastrada");
        }

        await connection.query(
            `
                INSERT INTO games
                (name, iamge, "stockTotal", "categoryId", "pricePerDay")
                VALUES ($1, $2, $3, $4, $5)
            `,
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.status(201).send("Game Postado");
    }
    catch(err){
        console.log(chalk.red("Erro ao postar games"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}