const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
let validusers = users.filter((user) => {
    return user.username === username;
  });
  return validusers.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const isEmptyObject = obj => {
    if (obj == null || typeof obj === 'string') {
      return true;
    }
  
    if (obj.keys !== 'undefined') {
      return Object.keys(obj).length === 0;
    }
  
    return true;
  };

//only registered users can login
// Task - 7
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign(
            { data: password },
            'access', { expiresIn: 60 * 60 } // 1 hour expiration
        );

        req.session.authorization = { accessToken, username };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Task - 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = req.body;
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!reviews || !reviews.reviewText) {
    return res.status(400).json({ message: "Review text cannot be empty." });
  }

  if (!book.reviews || isEmptyObject(book.reviews)) {
    book.reviews = reviews?.reviewText;
    return res.status(200).json({ message: "Review added successfully!" });
  } else {
    book.reviews = reviews?.reviewText;
    return res.status(200).json({ message: "Review updated successfully!" });
  }

});

// Delete a book 
// Task - 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).json({ message: "Review successfully deleted" });
    }
    else {
      return res.status(404).json({ message: "ISBN not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
