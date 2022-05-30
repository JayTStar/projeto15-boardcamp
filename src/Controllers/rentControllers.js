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

        rents = rents.map(element => {
            const {customerName, customerId, gameName, gameId, categoryId, categoryName, ...rentInfo} = element;

            return({
                ...rentInfo,
                gameId: gameId,
                customerId: customerId,
                customer: {
                    id: customerId,
                    name: customerName,
                },
                game: {
                    id: gameId,
                    name: gameName,
                    categoryId: categoryId,
                    categoryName: categoryName,
                }
            });
        });

        res.status(200).send(rents);
    }
    catch(err){
        console.log(chalk.red("Erro ao buscar alugueis"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}

export async function postRent(req,res){
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = new Date().toISOString();
    const returnDate = null;
    const delayFee = null;

    try {
        const customerResult = await connection.query(
            `SELECT * FROM customers
            WHERE id = $1`,
            [customerId]
        );

        if (customerResult.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        const gameResult = await connection.query(
            `SELECT * FROM games
            WHERE id = $1`,
            [gameId]
        );

        if (gameResult.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        const game = gameResult.rows[0];
        const originalPrice = game.pricePerDay * daysRented;

        const rentalsResult = await connection.query(
            `SELECT * FROM rentals
            WHERE "gameId" = $1`,
            [gameId]
        );

        if (
            rentalsResult.rows.length > 0 &&
            rentalsResult.rows.length >= game.stockTotal
        ) {
            res.sendStatus(400);
        }

        await connection.query(
            `INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
            ]
        );

        res.sendStatus(201);
    } 
    catch(err){
        console.log(chalk.red("Erro ao buscar alugueis"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}

export async function finishRent(req,res){
    const rental = res.locals.rental;

    if(rental.returnDate !== null){
        res.sendStatus(400);
        return;
    }
    const returnDate = new Date().toISOString();
    try {
        const gameResult = await connection.query(
            `SELECT * FROM games
            WHERE id = $1`, [rental.gameId]
        );

        const game = gameResult.rows[0];
        
        const daysToMilliseconds = 86400000;
        const idealReturnDate = new Date(
            new Date(rental.rentDate).getTime() +
                rental.daysRented * daysToMilliseconds
        );

        let delayFee;

        if (new Date(returnDate) > new Date(idealReturnDate)) {
            const delay = (new Date(new Date(returnDate).getTime() - new Date(rental.rentDate).getTime())) / daysToMilliseconds;

            delayFee = Math.floor(delay) *game.pricePerDay
        } else {
            delayFee = 0;
        }
        
        await connection.query(
            `UPDATE rentals
            SET "returnDate" = $1,
            "delayFee" = $2
            WHERE id = $3
            `, [returnDate, delayFee, rental.id]
        );

        res.sendStatus(200);
    }
    catch(err){
        console.log(chalk.red("Erro ao buscar alugueis"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}

export async function deleteRent(req,res){
    const id = req.params.id;
    const rental = res.locals.rental;

    if (rental.returnDate !== null) {
        res.sendStatus(400);
        return;
    }

    try {
        const rentalResult = await connection.query(
            `DELETE FROM rentals
            WHERE id = $1
            `,
            [id]
        );

        res.sendStatus(200);
    } 
    catch(err){
        console.log(chalk.red("Erro ao buscar alugueis"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}