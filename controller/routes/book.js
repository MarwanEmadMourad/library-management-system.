const express = require("express");
const Book = require("../../models/book");
const db = require('../../db/db')
const { Op } = require('sequelize');


const router = new express.Router();

// adding new book
router.post("/Book", async (req, res) => {
    const newBook = req.body;
    try {
        const bookExist = await Book.findOne({ where:{ title: newBook.title } })
        if (bookExist) {
            throw new Error("Book is already registered.");
        } else {
            const record = await Book.create(newBook);
            res.status(200).send({
                message:"Book added successfuly"
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// updating a book
router.patch("/Book", async (req, res) => {
    const bookId = req.body.id;
    try {
        const updated = await Book.update(req.body , { where: { id: bookId } })
            if(updated[0] === 1){
                res.status(200).send({
                    message:"Book updated successfuly"
                });
            } else {
                res.status(404).send({
                    message:"No books found to update."
                });
            }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// deleting a book
router.delete("/Book", async (req, res) => {
    const bookId = req.body.id;
    try {
        const deleted = await Book.destroy({ where: { id: bookId } })
        if(deleted){
            res.status(200).send({
                message:"Book deleted successfuly"
            });
        } else {
            res.status(404).send({
                message:"No books found to delete."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// getting all books
router.get("/Books", async (req, res) => {
    try {
        const books = await Book.findAll({attributes: ['id', 'title','author']});
        if(books.length) {
            res.status(200).send({
                books:books
            });
        } else {
            res.status(404).send({
                "message":"No books found."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// search a book 
// Note for better performance we can use pagination
router.get("/Book", async (req, res) => {
    try {
        const searchQuery = '%'+req.body.searchQuery.toLowerCase()+'%' ;
     
        const books = await Book.findAll({
            attributes: ['id', 'title', 'author'],
            where: {
              [Op.or]: [
                db.where(db.fn('LOWER', db.col('title')), 'LIKE', `%${searchQuery}%`),
                db.where(db.fn('LOWER', db.col('author')), 'LIKE', `%${searchQuery}%`),
                { ISBN: { [Op.like]: `%${searchQuery}%` } }
              ]
            }
          });
        if(books.length) {
            res.status(200).send({
                books:books
            });
        } else {
            res.status(404).send({
                "message":"No books found."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

module.exports = router;
