const express = require('express');
const app = express();
const port = 3000;

const db = require('./db/db')
const Book = require('./models/book')
const Borrower = require('./models/borrower')
const BookBorrower = require('./models/bookBorrower')

// creating db tables if not existed
Book.sync();
Borrower.sync();
BookBorrower.sync();

// requiring REST routes
const BookRouter = require("./controller/routes/book");
const BorrowerRouter = require("./controller/routes/borrower");
const BorrowingProcess = require("./controller/routes/borrowingProcess");

// accepting JSON in request/response 
app.use(express.json());

// using the created routes
app.use(BookRouter);
app.use(BorrowerRouter);
app.use(BorrowingProcess);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});