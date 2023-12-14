const Sequelize = require("sequelize");
const db = require("../db/db");


const Book = db.define("Book", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING(5000),
        allowNull: false
    },
    author: {
        type: Sequelize.STRING(512),
        allowNull: false
    },
    ISBN: {
        type: Sequelize.CHAR(13),
        allowNull: false
    },
    availableQty: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    shelfLocation: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    indexes: [
      {
        unique: true,
        fields: [
          {
            attribute: 'title',
            length: 255,
          },
        ],
        name: 'title_prefix',
      },
    ],
  });


module.exports = Book;
