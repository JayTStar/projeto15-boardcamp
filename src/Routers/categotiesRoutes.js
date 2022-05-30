import { Router } from "express";

import { getCategories, postCategories } from "../Controllers/categoriesController.js";
import  validateSchema  from "../Middlewares/joiValidation.js"
import { categorySchema } from "../Schemas/categoriesSchema.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", (req,res,next) => {validateSchema(req,res,next, categorySchema)}, postCategories);

export default categoriesRouter;