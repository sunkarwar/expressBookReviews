const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
   const userInDb = users.find(user=> {
        return user.username == username && user.password === password
    });

    return (userInDb )
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
    const isbn = req.params.isbn;
    const filteredBook = books[isbn];
    const username = req.session.authorization.username;

    if(filteredBook.reviews[username]){
        books[isbn].reviews[username].review = req.params.review
    } else{
            books[isbn].reviews[username] = {

                review : req.params.review
        }
    }

   return res.status(200).json({message: `Review by ${username} added to book ${filteredBook.title}`});
   

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
