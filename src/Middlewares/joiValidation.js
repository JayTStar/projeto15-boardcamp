export default function validateSchema(req, res, next, schema){
    const body = req.body;

    const validation = schema.validate(body, {abortEarly: false});

    if (validation.error) {
        console.log(validation.error.details.map((detail) => detail.message));
        res.status(400).send("Erro nos dados passados");
    }

    next();
}