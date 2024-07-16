import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import recipeControllers from '../controllers/recipe.js';

const router = express.Router();

// routes
router.get('/', recipeControllers.getAllRecipes);
router.get('/:id', recipeControllers.getOneRecipe);
router.post('/', verifyToken, recipeControllers.postRecipe);
router.put('/:id', verifyToken, recipeControllers.updateRecipe);
router.delete('/:id', verifyToken, recipeControllers.deleteRecipe);

export default router;
