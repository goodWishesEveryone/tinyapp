const bcrypt = require("bcrypt");
//const uuid = require("uuid/v4");
//const database =  require("./express_server");
const users = require("./express_server");
//const saltRounds = 10;



// const getUserByEmail = function (email, database) {
//   // lookup magic...
//   return user;
// };
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

// -----------------------  ADD NEW USER  ------------------------//
const addNewUser = (email, hashedPassword, users) => {
  // Create a user id ... generate a unique id
  const id = Math.random().toString(36).substring(2, 8);
  const password =  hashedPassword;
  // Create a new user object
  const newUser = {
    id,
    email,
    // password: bcrypt.hashSync(password, salt),
    password: bcrypt.hashSync(password, 10),

  };
  // Add the newUser OBJECT to the database
  // value associated with the random generated id key
  users[id] = newUser;
  return id;
};

// ----- FIND USER By EMAIL => id if exists, FALSE if ! ----------//
const getUserByEmail = (email,users) => {
  // iterate through the users object
  for (let id in users) {
    //console.log();
    if (users[id].email === email) {
      // if it matches return truthy
      return users[id];
    }
  }
  return false;
};
// ---------------------- AUTHENTICATE USER ----------------------//
const authenticateUser = (email, password, users) => {
  // loop through the users db => object
  const user = getUserByEmail(email, users);  // users[id]
  //console.log("user ========49", user, password);
  const matchedPWD = bcrypt.compareSync(password, user.password); // returns true
  console.log("usermatchedPWD+++++++++51", matchedPWD);
  if (user && matchedPWD) {
  // console.log(user.userID);
    return user;
  }
  return false;
};


module.exports = {
  // createNewUrl,
  // updateUser,
  addNewUser,
  //getUserByEmail,
  getUserByEmail,
  authenticateUser,
  generateRandomString

  // urlsForUser
};
