const express = require('express');
const app = express();
const port = 3000;

const db = require('./db/db')
const Book = require('./models/book')
const Borrower = require('./models/borrower')
const BookBorrower = require('./models/bookBorrower')


Book.sync();
Borrower.sync();
BookBorrower.sync();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});