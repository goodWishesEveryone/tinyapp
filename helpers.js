const bcrypt = require("bcrypt");

// ---------------------------  URLs for USER  ----------------------------//
const urlsForUser = function(id, database) {
  let userURLs = {};
  for (let shortURL in database) {
    if (id === database[shortURL].userID) {
      userURLs[shortURL] = database[shortURL];
    }
  }
  return userURLs;
};


// ----------------------  generateRandomString  --------------------------//
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

// ----------------------------  ADD NEW USER  ----------------------------//
const addNewUser = (email, hashedPassword, users) => {
  // Create a user id ... generate a unique id by calling  <<== generateRandomString();
  const id = generateRandomString();
  const password = hashedPassword;
  // Create a new user object
  const newUser = {
    id,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  // Add the newUser OBJECT to the db
  // value associated with the random generated id key
  users[id] = newUser;
  return id;
};

// ----- FIND USER By EMAIL => return id if exists, undefined if not ----------//
const getUserByEmail = (email, users) => {
  // iterate through the users object
  for (let id in users) {
    
    if (users[id].email === email) {
      // if it matches, return users[id], is an object conations user info
      return users[id];
    }
  }
  return undefined;
};
// ------------------------- AUTHENTICATE USER -------------------------//
const authenticateUser = (email, password, users) => {
  // loop through the users db => object
  const user = getUserByEmail(email, users); // users[id] is an object contains user info
  const matchedPWD = user ? bcrypt.compareSync(password, user.password) : null;
  // user is found but password do not mmatched => error message
  // user must provide correct login credentials
  if (user && !matchedPWD) {
    return null;
  }
  if (user && matchedPWD) {
    return true;
  }
  return false;
};

module.exports = {
  addNewUser,
  getUserByEmail,
  authenticateUser,
  generateRandomString,
  urlsForUser
};