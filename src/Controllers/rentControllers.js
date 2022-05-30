import connection from "../data";
import chalk from "chalk";

export async function getRents(req,res){
    const client = parseInt(req.query.customerId);
    const game = parseInt(req.query.gameId);

    try{
        const rentsResult = await connection.query(
            `
                SELECT rentals.*, customers.name AS "customerName, games.name AS "gameName", games."categoryId", categories.name AS "CategoryName"
                FROM rentals
                JOIN customer ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
            `
        ); 

        let rents = rentsResult.rows;

        if(client){
            rents = rents.filter(element => element.customerId === client);
        }

        if(game){
            rents = rents.filter(element => element.gameId === game)
        }

        
    }
    catch(err){
        console.log(chalk.red("Erro ao buscar alugueis"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}

export async function postRent(req,res){

}

export async function finishRent(req,res){

}

export async function deleteRent(req,res){

}