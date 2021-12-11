const bcrypt = require("bcrypt");
//const uuid = require("uuid/v4");
//const database =  require("./express_server");
//const users = require("./express_server");
const saltRounds = 10;



// const getUserByEmail = function (email, database) {
//   // lookup magic...
//   return user;
// };

// -----------------------  ADD NEW USER  ------------------------//
const addNewUser = (email, password, users) => {
  // Create a user id ... generate a unique id
  const id = Math.random().toString(36).substring(2, 8);
  // Create a new user object
  const newUser = {
    id,
    email,
    password
  };
  // Add the user to the database
  // Read the value associated with the key
  users[id] = newUser;
  return id;
};

// --------------------- FIND USER By EMAIL ----------------------//
const authenticateUserByEmail = (email,users) => {
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
const authenticateUser = (email, password, database) => {
  // loop through the users db => object
  const user = authenticateUserByEmail(email, database);
  console.log("user", user, password);

  if (user && user.password === password) {
  // console.log(user.userID);
    return user.id;
  }
  return false;
};



module.exports = {
  // createNewUrl,
  // updateUser,
  addNewUser,
  //getUserByEmail,
  authenticateUserByEmail,
  authenticateUser
 // urlsForUser
};
