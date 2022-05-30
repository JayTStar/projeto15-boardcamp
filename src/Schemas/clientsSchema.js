import joi from "joi";

export const clientsSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().max(11),
    cpf: joi.string().required.max(11),
    birthday: joi.string().required()
});