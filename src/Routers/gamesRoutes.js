import { Router } from "express";

const gamesRouter = Router();

import {getGames, postGames} from "../Controllers/gamesController.js";
import {gamesSchema} from "../Schemas/gamesSchema.js";
import validateSchema from "../Middlewares/joiValidation.js";

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", (req,res,next) => {validateSchema(req,res,next,gamesSchema)}, postGames);

export default gamesRouter;