import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().required().integer().min(0),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().required()
});