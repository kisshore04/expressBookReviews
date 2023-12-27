const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ ];
const jwt_secret = "myTokenSecret"

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    try {
      const { username , password } = req.body;
  
      if(!username || !password){
        return res.status(200).json({"error" : "username and password are required"})
      }
      
      const user = users.find( user => user.username === username)

      if(!user || !(user.password === password)){
        return res.status(401).json({"error" : "Invalid username or password" })
      }
  
      const token = jwt.sign({username}, jwt_secret , { expiresIn : '1h'})
  
      return res.status(201).json({ "message" : "logged in successfully",token})
      
    } catch (error) {
      return res.status(500).json(error)
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
      const { isbn, review } = req.query;
      const { username } = req.session;

      if(!isbn || !review){
        return res.status(400).json({"error":"isbn or review are required"})
      }

      if(books[isbn] && books[isbn].reviews && books[isbn].reviews[username]){
        books[isbn].reviews[username] = review
      }
      else{
        if(!books[isbn]){
          return res.status(404).json({"message" : "Book is not found"})
        }

        if(!books[isbn].reviews){
          books[isbn].reviews = {}
        }

        books[isbn].reviews[username] = review
      }

      return res.status(201).json({"message" : "review added/modified successfully"})
      // res.send("Working in progress")
    } catch (error) {
      return res.status(500).json({error : error.message})
    }
});

//delete a review based the users profile
regd_users.delete("/auth/review/:isbn",function(req,res){
    try {
      const { isbn } = req.query;
      const { username } = req.session;
  
      if(!isbn){
        return res.status(400).json({"error" : "ISBN is needed"})
      }
  
      if(!books[isbn]){
        return res.status(404).json({"error" : "Book is not found for the isbn"})
      }
  
      if(books[isbn].reviews && books[isbn].reviews[username]){
        delete books[isbn].reviews[username];
  
        return res.status(200).json({"message" : "review for the book has been deleted"})
      }
      else{
        return res.status(404).json({"error" : "review not found for the username"})
      }
      
    } catch (error) {
      return res.status(500).json({"error" : error.message})
    }

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
