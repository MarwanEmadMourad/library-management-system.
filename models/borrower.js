const Sequelize = require("sequelize");
const db = require("../db/db");

const Borrower = db.define("Borrower", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: false
    },
    email: {
        type: Sequelize.STRING(320),
        allowNull: false,
        unique: false
    }
});

module.exports = Borrower;
