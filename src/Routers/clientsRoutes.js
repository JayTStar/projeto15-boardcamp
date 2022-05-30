import { Router } from "express";

import { getClients, getClient, postClient, editClient } from "../Controllers/clientsController.js";
import validateSchema from "../Middlewares/joiValidation.js";
import { clientsSchema } from "../Schemas/clientsSchema.js";

const clientsRouter = Router();

clientsRouter.get("/customers", getClients);
clientsRouter.get("/customers/:id", getClient);
clientsRouter.post("/customers", (req,res,next) => {validateSchema(req,res,next,clientsSchema)}, postClient);
clientsRouter.put("/customers/:id", (req,res,next) => {validateSchema(req,res,next,clientsSchema)}, editClient);

export default clientsRouter;