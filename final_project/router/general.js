const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password)
  if (username && password) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: `${username} successfully registered. Now you can login.`})
    } 
  if (!username){
    console.log(username)
    return res.status(400).json({message: "Username parameter required"})
  }
  if(!password){
    return res.status(400).json({message: "Password parameter required"})
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (isbn) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = decodeURIComponent(req.params.author);
  if (author) {
    // Convert books object to array and filter
    let filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = decodeURIComponent(req.params.title);
  if (title) {
    // Convert books object to array and filter
    let filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn) {
    let filteredBooks = books[isbn].reviews;
    if (1 > filteredBooks.length) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: `There are no reviews for ${books[isbn].title}` });
    }
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
