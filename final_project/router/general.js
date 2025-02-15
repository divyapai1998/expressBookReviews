const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

// Task - 6
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User registered successfully. You can login now"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

const getBooks = () => {
    const bookList = axios.get("https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReviews/master/final_project/router/booksdb.json");
    return bookList;
}

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
// Task - 1
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
  });

// Get the book list available in the shop
// Task - 10
// public_users.get('/', async function (req, res) {
//     const bookListResponse = await getBooks();
//     return res.status(200).json(bookListResponse.data);
// });

// Get book details based on ISBN
// Task - 2
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
  
    const foundBooks = books[isbn];
  
    if (Object.keys(foundBooks)) {
      return res.status(200).json({ message: "Books are Found!!", foundBooks });
    }
    else {
      return res.status(400).json({message: 'No books were found'})
    }
   });

// Get book details based on ISBN
// Task - 11
// public_users.get('/isbn/:isbn',async function (req, res) {
//     const bookListResponse = await getBooks();
//     let isbn = parseInt(req.params.isbn);
  
//     const foundBooks = bookListResponse[isbn];
  
//     if (Object.keys(foundBooks)) {
//       return res.status(200).json({ message: "Books are Found!!", foundBooks });
//     }
//     else {
//       return res.status(400).json({message: 'No books were found'})
//     }
//    });
  
// Get book details based on author
// Task - 3
public_users.get('/author/:author',function (req, res) {
  
    let author = req.params.author;
  
    const foundBooks = Object.values(books).filter(book => book?.author === author);
  
    if (foundBooks.length) {
      return res.status(200).json({ message: 'Books are Found!!', foundBooks });
    }
    else {
      return res.status(404).json({message: 'No books were found'})
    }
  });

// Get book details based on author
// Task - 12
// public_users.get('/author/:author',async function (req, res) {
//     const bookListResponse = await getBooks();
//     let author = req.params.author;
  
//     const foundBooks = Object.values(bookListResponse).filter(book => book?.author === author);
  
//     if (foundBooks.length) {
//       return res.status(200).json({ message: 'Books are Found!!', foundBooks });
//     }
//     else {
//       return res.status(404).json({message: 'No books were found'})
//     }
//   });

// Get all books based on title
// Task - 4
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title;
  
    const foundBooks = await Object.values(books).filter(book => book?.title === title);
  
    if (foundBooks.length) {
      return res.status(200).json({ message: 'Books are Found!!', foundBooks });
    }
    else {
      return res.status(404).json({message: 'No books were found'})
    }
  });

// Get all books based on title
// Task - 13
// public_users.get('/title/:title',async function (req, res) {
//     const bookListResponse = await getBooks();
  
//     let title = req.params.title;
  
//     const foundBooks = Object.values(bookListResponse).filter(book => book?.title === title);
  
//     if (foundBooks.length) {
//       return res.status(200).json({ message: 'Books are Found!!', foundBooks });
//     }
//     else {
//       return res.status(404).json({message: 'No books were found'})
//     }
//   });


//  Get book review
// Task - 5
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      if (Object.keys(book.reviews).length > 0) {
        return res.status(200).json(book.reviews);
      } else {
        return res.status(404).json({ message: 'No reviews available for this book.' });
      }
    } else {
      return res.status(404).json({ message: 'No books were found' });
    }
  });

module.exports.general = public_users;
module.exports.general = public_users;
