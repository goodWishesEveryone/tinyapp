const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const cookieParser = require("cookie-parser");
//const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");

const saltRounds = 10;
//const { urls, users } = require('./db');
const {
  //createNewUrl,
  //updateUser,
  //addNewUser,
  getUserByEmail,
  authenticateUserByEmail,
  authenticateUser,
} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

// ---------------  MIDDLEWARE  --------------------//
app.use(cookieParser());
// tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// --------------  URL DATABASE  ---------- --------//
// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
//   S152tx: "https://www.tsn.ca/",
//   PsWtqz: "https://www.google.ca/",
// };
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// --------------------  USERS DATABASE  --------------------------//
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// -------------  generateRandomString for URL  -----------//
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

// -------------------  HOMEPAGE  /  --------------------- //
app.get("/", (req, res) => {
  res.send("Hello!");
});
// app.get("/", (req, res) => {
//   const templateVars = {
//     urls: urlDatabase,
//     username: users[req.cookies.user_id]
//   };
//   res.render("urls_index", templateVars);
// });

// --------------------  /urls GET  POST -------------------//
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: users[req.cookies.user_id],
  };
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  // Log the POST request body to the console
  // calling the function
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  res.redirect(`/urls/${newShortURL}`);
});

// --------------------  /urls.json GET  ----------------//
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// --------------------  /hello GET  --------------------//

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: "Hello World!" };
//   res.render("hello_world", templateVars);
// });

// --------------------  /urls/new GET  -------------------//
// Make sure to place this code above the app.get("/urls/:id", ...) route definition.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});
// -----------------  /urls/:shortURL GET  ----------------//
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, // keys
    longURL: urlDatabase[req.params.shortURL].longURL, // values
    username: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

// -----------------  /urls/:shortURL GET  ----------------//
app.get("/u/:shortURL", (req, res) => {
  // redirection to long url after clicking shorturl
  if (!urlDatabase[req.params.shortURL]) {
    return res.send(`long URL not found`);
  }
  const lurl = urlDatabase[req.params.shortURL].longURL;
  res.redirect(lurl);
});

// ----------------  UPDATE /urls/:shortURL  ----------------//
// update the info in the db
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL; // update the db
  res.redirect("/urls");
});

// -----------  DELETE & POST /urls/:shortURL/delete  -------//
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id from the url
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// -------  ADDITIONAL REQ: Basic Permission Features ----------//
// Redirecting When Logged In

// app.post("/urls/:shortURL/delete", (req, res) => {
//   const shortURL = req.params.shortURL; // extract the id from the url
//   delete urlDatabase[shortURL];
//   res.redirect("/urls");
// });

// ---------------- REGISTER GET POST - /register -------//
// Display the register form
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
  };
  res.render("register", templateVars);
});
// Handling the register form submit
app.post("/register", (req, res) => {
  // Extract the email and password from the form
  // req.body (body-parser) to get the info from our form
  const email = req.body.email;
  const password = req.body.password;
  // check if the user already in the db
  const user = authenticateUserByEmail(email);
  if (email === "" || password === "") {
    res
      .status(400)
      .send(
        `Email or password cannot be empty. Please provide a valid email and password.`
      );
    console.log(users);
  }
  // if user is undefined/doesn't exist, add the user in the db
  if (!user) {
    const userId = addNewUser(email, password);
    // Setting the cookie in the user's browser
    res.cookie("user_id", userId); // username is a #
    res.redirect("/urls");
  } else {
    res.status(403).send(`${email} is already registered! Please login.`);
    console.log(users);
    res.redirect("/login");
  }
});

// app.get("/users", (req, res) => {
//   res.json(users);
// });
// -------------- LOGIN -- GET -- POST -- /urls -----------//
// Display the login form
// app.get("/login", (req, res) => {
//   const templateVars = { username: req.cookies["user_id"] };
//   res.render("login", templateVars);
// });

app.get("/login", (req, res) => {
  const templateVars = { username: req.cookies["user_id"] };
  res.render("login", templateVars);
  res.redirect("/urls");
});

// authenticate the user
app.post("/login", (req, res) => {
  // extract the information from the form with req.body
  const email = req.body.email;
  const password = req.body.password;
  // user must exist, check for the password
  const userId = authenticateUser(email, password);
  console.log("userId", userId);
  if (userId) {
    // Set the cookie with the user id
    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    // user is not authenticated => error message
    res.status(401).send("Please provide correct login credentials");
  }
});

// -------------- LOGOUT --- GET --- /logout ------------//
app.get("/logout", (req, res) => {
  res.render("logout");
});
// -------------- LOGOUT --- POST --- /urls --------------//
app.post("/logout", (req, res) => {
  // clear the cookie
  res.clearCookie("user_id");
  // res.cookie("username", null);
  res.redirect("/urls");
});

// -------------------- LISTENING port -------------------//
app.listen(PORT, () => {
  console.log(`Tiny App is listening on port ${PORT}!`);
});
