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

// Get the book list available in the shop - USING PROMISES
public_users.get('/',function (req, res) {
    const allBooks = new Promise((resolve,reject) => {
          resolve(JSON.stringify(books,null,4))});
       allBooks.then((successMessage) => {
        return res.send(successMessage)
      })
});

// Get book details based on ISBN 
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = new Promise((resolve,reject) => {
    resolve(books[isbn])});
    filteredBook.then(data=>{
        if(data){
            res.send(data)
        } else {
            res.status(200).json({message: `Book with ${isbn} isn't available`})
        }
    })
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
 
  const data = new Promise((resolve,reject) => {
    for(let key in books){
            if(books[key].author === author){
                resolve(books[key])
            } else{
                reject(`Book with author ${author} is not found.`)
            }
        }});
 
        data.then(
            result =>{
                return res.status(200).json({message: result})
        },error =>{
              return res.status(200).json({message:error });
              }
        )
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; 
    const data = new Promise((resolve,reject) => {
      for(let key in books){
              if(books[key].title == title){
                  resolve(books[key])
              } else{
                  reject(`Book with title ${title} is not found.`)
              }
          }});
   
          data.then(
              result =>{
                  return res.status(200).json({message: result})
          },error =>{
                return res.status(200).json({message:error });
                }
)}
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