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
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      return res.status(200).json({ books: bookList });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Failed to retrieve book list" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (isbn) {
    new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    })
      .then((bookDetails) => {
        return res.status(200).json(bookDetails);
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ message: "Failed to retrieve book details" });
      });
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = decodeURIComponent(req.params.author);
  if (author) {
    new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter((book) =>
        book.author.toLowerCase() === author.toLowerCase()
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found for this author"));
      }
    })
      .then((filteredBooks) => {
        return res.status(200).json(filteredBooks);
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ message: "No books found for this author" });
      });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = decodeURIComponent(req.params.title);
  if (title) {
    new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter((book) =>
        book.title.toLowerCase() === title.toLowerCase()
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    })
      .then((filteredBooks) => {
        return res.status(200).json(filteredBooks);
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ message: "No books found with this title" });
      });
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
