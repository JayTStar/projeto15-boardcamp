import { Router } from "express";

import { getRents, postRent, finishRent, deleteRent } from "../Controllers/rentControllers.js";
import validateSchema from "../Middlewares/joiValidation.js";
import { rentSchema } from "../Schemas/rentSchema.js";

const rentRouter = Router();

rentRouter.get("/rentals", getRents);
rentRouter.post("/rentals", (req,res,next)=>{validateSchema(req,res,next,rentSchema)} , postRent);
rentRouter.post("/rentals/:id/return", finishRent);
rentRouter.delete("/rentals/:id", deleteRent);

export default rentRouter;