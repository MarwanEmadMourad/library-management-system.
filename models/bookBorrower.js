const Sequelize = require("sequelize");
const db = require("../db/db");
const Book = require("./book");
const Borrower = require("./borrower");

const BookBorrower = db.define( "BookBorrower",
    {
        dueDate: {
            type: Sequelize.DATE,
        }
    }
);

// relation between Book and Borrower ( M-->N )
Book.belongsToMany(Borrower, { through: BookBorrower });
Borrower.belongsToMany(Book, { through: BookBorrower });


module.exports = BookBorrower;
