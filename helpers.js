const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const { users, urls } = require("./express_server");
const saltRounds = 10;

const getUserByEmail = function (email, database) {
  // lookup magic...
  return user;
};

// --------------------  ADD NEW USER  ---------------------//
const addNewUser = (email, password) => {
  // Create a user id ... generate a unique id
  const userId = Math.random().toString(36).substring(2, 8);
  // Create a new user object
  const newUser = {
    userId,
    email,
    password,
  };
  // Add the user to the database
  // Read the value associated with the key
  users[userId] = newUser;
  return userId;
};

// ------------------- FIND USER By EMAIL -------------------//
const authenticateUserByEmail = (email) => {
  // iterate through the users object
  for (let userId in users) {
    if (users[userId].email === email) {
      // if it matches return truthy
      return users[userId];
    }
  }
  return false;
};

// ---------------- AUTHENTICATE USER --------------------//
const authenticateUser = (email, password) => {
  // loop through the users db => object
  const user = authenticateUserByEmail(email);
  if (user && user.password === password) {
    console.log(user.userId);
    return user.userId;
  }
  return false;
};

module.exports = {
  // createNewUrl,
  // updateUser,
  addNewUser,
  getUserByEmail,
  authenticateUserByEmail,
  authenticateUser,
};
