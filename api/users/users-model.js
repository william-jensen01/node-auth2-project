const db = require('../../data/dbConfig');

module.exports = {
    getUsers,
    findBy,
    add,
    findById
}

function getUsers() {
    return db("users").select("id", "username", "department");
}

function findById(id) {
    return db("users").where({ id }).first().select("id", "username", "department");
}

// for logging in
function findBy(filter) {
    return db("users").where(filter);
}

// for registering
async function add(user) {
    const [id] = await db("users").insert(user, "id");
    return findById(id);
}

