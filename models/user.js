import query from '../config/db.js';

const createUserTable = async () => {
    try {
    const createTableForUser = `
    CREATE  TABLE IF NOT EXIST user(
    id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL
    )`;
    const createTable = await query(createTableForUser);
} catch (err) {
    console.error(err);
}
};

export default createUserTable;
