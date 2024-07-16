import query from '../config/db.js';

const createRecipeTable = async () => {
    try {
        const createTableForRecipe = `
        CREATE  TABLE IF NOT EXIST recipe(
        id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        cook VARCHAR(30) NOT NULL,
        ingredients VARCHAR(100) NOT NULL,
        description VARCHAR(200) NOT NULL,
        img VARCHAR(30) NOT NULL
        )`
        const createTable = await query(createTableForRecipe)
    } catch (err) {
        console.error(err);
    }
};

export default createRecipeTable;
