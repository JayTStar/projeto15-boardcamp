import connection from "../data.js"
import chalk from "chalk";

export async function getClients(req,res){
    let filter = req.query.cpf;
    filter = filter ? filter + "%" : "%";

    try {
        const clients = await connection.query(
            `
                SELECT * FROM customers
                WHERE cpf
                LIKE $1
            `,
            [filter]
        );
        res.status(200).send(clients.rows);
    } catch(err){
        console.log(chalk.red("Erro ao pegar clients"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}

export async function getClient(req, res) {
    const { id } = req.params;

    try {
        const client = await connection.query(
            `
                SELECT * FROM customers
                WHERE id = $1
            `,
            [id]
        );

        if (client.rows.length === 0) {
            res.status(404).send("Cliente não encontrado");
        }

        res.status(200).send(client.rows[0]);
    } catch(err){
        console.log(chalk.red("Erro ao pegar client"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}

export async function postClient(req,res){
    const {name,phone,cpf,birthday} = req.body;

    try{
        const client = await connection.query(
            `
                SELECT * FROM customers
                WHERE cpf = $1
            `,
            [cpf]
        );

        if(client.rowCount.length > 0){
            res.status(409).send("Cliente já cadastrado");
        }

        await connection.query(
            `
                INSERT INTO customers
                (name,phone,cpf,birthday)
                VALUES ($1,$2,$3,$4)
            `,
            [name,phone,cpf,birthday]
        );

        res.status(201).send("Cliente cadastrado")
    }
    catch(err){
        console.log(chalk.red("Erro ao salvar client"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}

export async function editClient(req,res){
    const {id} = req.params;
    const {name,phone,cpf,birthday} = req.body;

    try{
        const client = await connection.query(
            `
                SELECT * FROM customers
                WHERE cpf = $1
            `,
            [cpf]
        );

        if(client.rows.length > 0 && client.rows[0].id !== parseInt(id)){
            res.status(409).send("Erro ao encontrar cliente")
        }

        await connection.query(
            `
                UPDATE customers
                SET name = $1, phone = $2, cpf = $3, birthday = $4
                WHERE id = $5
            `,
            [name,phone,cpf,birthday]
        );

        res.status(200).send("Dados do cliente atualizados com sucesso")
    }catch(err){
        console.log(chalk.red("Erro ao editar client"));
        console.log(err);
        res.status(500).send("Erro no servidor")
    }
}