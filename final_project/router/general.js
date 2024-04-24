const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExists = (username)=>{
const filteredUser = users.filter((user) => user.username == username);
if (filteredUser.length){
        return true
    } else {
        return false
    } 
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (userExists(username)){
    res.send(`User with name ${username} already exists`);
  } else {
    users.push({username, password});
    res.send(`User ${username} added.`)
  }
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
return res.send(JSON.stringify(books,null,4))
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];
  if (filteredBook){
    return res.status(200).json({message: filteredBook})
  }else {
  return res.status(200).json({message: `Book with isbn ${isbn} is not found! Try again with correct isbn`});
  }
 });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filteredBook = [];
  for(let key in books){
if(books[key].author === author){
    filteredBook.push(books[key])
}
  }
  if (filteredBook.length ){
    return res.status(200).json({message: filteredBook})
  }else {
  return res.status(300).json({message: `Book with author ${author} is not found.`});
  }});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredBook = [];
    for(let key in books){
  if(books[key].title === title){
      filteredBook.push(books[key])
  }
    }
    if (filteredBook.length ){
      return res.status(200).json({message: filteredBook})
    }else {
    return res.status(300).json({message: `Book with title ${title} is not found.`});
    }}
);
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews
    if (books[isbn] ){
      return res.send(`Reviews on ${books[isbn].title} : \n ${JSON.stringify(reviews)}`)
    }else {
    return res.status(300).json({message:` Book with isbn ${isbn} is not found.`});
    }}
);
module.exports.general = public_users;