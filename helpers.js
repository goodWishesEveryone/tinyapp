const bcrypt = require("bcrypt");

// ----------------------  generateRandomString  -----------------------//
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

// --------------------------  ADD NEW USER  ---------------------------//
const addNewUser = (email, hashedPassword, users) => {
  // Create a user id ... generate a unique id
  // const id = Math.random().toString(36).substring(2, 8);
  const id = generateRandomString();
  const password =  hashedPassword;
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

// ----- FIND USER By EMAIL => return id if exists, undefined if ! ----------//
const getUserByEmail = (email,users) => {
  // iterate through the users object
  for (let id in users) {
    //console.log();
    if (users[id].email === email) {
      // if it matches return truthy
      return users[id];
    }
  }
  return undefined;
};
// ------------------------- AUTHENTICATE USER -------------------------//
const authenticateUser = (email, password, users) => {
  // loop through the users db => object
  const user = getUserByEmail(email, users);  // users[id]
  const matchedPWD = user ? bcrypt.compareSync(password, user.password) : null;
  if (user && matchedPWD) {
    return user;
  }
  return false;
};

module.exports = {
  addNewUser,
  getUserByEmail,
  authenticateUser,
  generateRandomString
  // urlsForUser
};