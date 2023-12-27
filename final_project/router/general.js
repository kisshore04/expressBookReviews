const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    try {
        res.status(200).json(JSON.stringify(books));
    } catch (error) {
        res.status(500).json({error})
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn;
        if(books.hasOwnProperty(isbn)){
            const book = books[isbn]
            res.status(200).json(JSON.stringify(book))
        }
        else{
            res.status(404).json({"message" : "Book not found"})
        }
    } catch (error) {
        res.status(500).json({error})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const requestedAuthor = req.params.author;
    
        // Obtain all the keys for the 'books' object
        const bookKeys = Object.keys(books);
    
        // Iterate through the 'books' array & check the author matches the one provided in the request parameters
        const booksByAuthor = bookKeys.reduce((result, key) => {
          const book = books[key];
          if (book.author === requestedAuthor) {
            result[key] = book;
          }
          return result;
        }, {});
    
        if (Object.keys(booksByAuthor).length > 0) {
          res.status(200).json(booksByAuthor);
        } else {
          res.status(404).json({ message: "Books by the author not found" });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        const requestedTitle = req.params.title;
    
        // Obtain all the keys for the 'books' object
        const bookKeys = Object.keys(books);
    
        // Iterate through the 'books' array & check the title matches the one provided in the request parameters
        const booksByTitle = bookKeys.reduce((result, key) => {
          const book = books[key];
          if (book.title.toLowerCase().includes(requestedTitle.toLowerCase())) {
            result[key] = book;
          }
          return result;
        }, {});
    
        if (Object.keys(booksByTitle).length > 0) {
          res.status(200).json(booksByTitle);
        } else {
          res.status(404).json({ message: "Books with the title not found" });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        const requestedIsbn = req.params.isbn;
    
        // Check if the requestedIsbn is a valid numerical key in the books object
        if (books.hasOwnProperty(requestedIsbn)) {
          const book = books[requestedIsbn];
    
          // Check if the book has reviews
          if (book.reviews && Object.keys(book.reviews).length > 0) {
            res.status(200).json(book.reviews);
          } else {
            res.status(404).json({ message: "Reviews not found for the book" });
          }
        } else {
          res.status(404).json({ message: "Book not found" });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
});

module.exports.general = public_users;
