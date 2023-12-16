const express = require("express");
const Book = require("../../models/book");
const BookBorrower = require("../../models/bookBorrower");
const Borrower = require("../../models/borrower");

const db = require('../../db/db')
const { Op } = require('sequelize');


const router = new express.Router();

// checking out a book
router.post("/Checkout", async (req, res) => {
    const checkoutDetails = req.body;
    try {
        const dueDates = await BookBorrower.findAll({
            attributes: ['dueDate'],
            where: {
              bookId: checkoutDetails.BookId,
              borrowerId: checkoutDetails.BorrowerId
            },
            raw: true,
            plain: true
        });
        const dueDateList = (dueDates === null ? [] : [dueDates.dueDate]);

        if (dueDateList.length){
            const currentDate = new Date(); 
            const givenDate = new Date(dueDateList[0]); 

            if(givenDate < currentDate){
                res.status(400).send({
                    message:"You already borrowed this book and didn't return it, your excpeted return date was "+ dueDateList[0] 
                }); 
            } else {
                res.status(400).send({
                    message:"You already borrowed this book and the excpeceted due date it is " + dueDateList[0] 
                }); 
            }
            return ;
        }
        await BookBorrower.create(checkoutDetails);
        await Book.update(
            { availableQty: db.literal('availableQty - 1') },
            { where: { id: checkoutDetails.BookId, availableQty: { [Op.gt]: 0 } } })
        res.status(200).send({
            message:"Book borrowed successfuly."
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// getting all books and their borrowers
router.get("/BookBorrowers", async (req, res) => {
    try {
        let booksAndBorrowers = await db.query('Select books.id as bookId , books.title as bookTitle , borrowers.id as borrowerId , borrowers.name as borrowerName FROM bookborrowers inner join books on books.id = bookborrowers.BookId inner join borrowers on borrowers.id = bookBorrowers.BorrowerId');
        booksAndBorrowers = [...new Set(booksAndBorrowers)]

        if(booksAndBorrowers.length) {
            res.status(200).send({
                booksAndBorrowers:booksAndBorrowers
            });
        } else {
            res.status(404).send({
                "message":"No books are currently borrowed."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// returning a book
router.post("/return", async (req, res) => {
    const {BookId , BorrowerId} = req.body;
    try {
        const deleted = await BookBorrower.destroy({ where: { BookId: BookId , BorrowerId:BorrowerId } })

        if (deleted){
            const ans = await Book.update({availableQty: db.literal('availableQty + 1') },{ where: { id: BookId}})
            console.log(ans) 
            res.status(200).send({
                message:"Book returned successfuly"
            });
        } else {
            res.status(404).send({
                message:"No books found to return."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// getting all books to a borrower
router.get("/MyBooks", async (req, res) => {
    try {
        const {BorrowerId} = req.body
        let BorrowerBooks = await db.query(`Select books.id as bookId , books.title as bookTitle FROM bookborrowers inner join books on books.id = bookborrowers.BookId where bookborrowers.BorrowerId = ${BorrowerId}`);
        BorrowerBooks = [...new Set(BorrowerBooks)][0]

        if(BorrowerBooks.length) {
            res.status(200).send({
                BorrowerBooks:BorrowerBooks
            });
        } else {
            res.status(404).send({
                "message":"No books are currently borrowed."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// getting all late books
router.get("/lateBooks", async (req, res) => {
    try {
        let lateBooks = await db.query('Select books.id as bookId , books.title as bookTitle , borrowers.id as borrowerId , borrowers.name as borrowerName FROM bookborrowers inner join books on books.id = bookborrowers.BookId inner join borrowers on borrowers.id = bookBorrowers.BorrowerId where bookborrowers.dueDate < now ()');
        lateBooks = [...new Set(lateBooks)][0]

        if(lateBooks.length) {
            res.status(200).send({
                lateBooks:lateBooks
            });
        } else {
            res.status(404).send({
                "message":"No books are currently overdued."
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});



module.exports = router;
