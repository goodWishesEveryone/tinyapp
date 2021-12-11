const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
//const uuid = require("uuid/v4");
//const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
//const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
//const password = "purple-monkey-dinosaur"; // found in the req.params object
//const hashedPassword = bcrypt.hashSync(password, 10);

const saltRounds = 10;
//const { urls, users } = require('./db');
const {
  // users,
  //createNewUrl,
  //updateUser,
  addNewUser,
  getUserByEmail,
  authenticateUser,
  generateRandomString
  // urlsForUser
} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

// ---------------  MIDDLEWARE  --------------------//
//app.use(cookieParser());
// cookie session config

app.use(
  cookieSession({
    name: "session",
    // keys: [/* secret keys */],
    keys: [
      "8f232fc4-47de-41a1-a8cd-4f9323253715",
      "1279e050-24c2-4cc6-a176-3d03d66948a2",
    ],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
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
    userID: "aJ48lX",
  },
};

const urlsForUser = function(id) {
  let userURLs = {};
  // let shortURLs = Object.keys(urlDatabase);
  // for (let i = 0; i < shortURLs.length; i++) {
  //   if (id === urlDatabase[shortURLs[i]].userID) {
  //     userURLs[shortURLs[i]] = urlDatabase[shortURLs[i]];
  //   }
  // }
  for (let shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  console.log("********", userURLs);
  return userURLs;
};

// --------------------  USERS DATABASE  -------------------------//
const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10),
  },
  aJ48lX: {
    id: "aJ48lX",
    email: "b@b.com",
    password: bcrypt.hashSync("123", 10),
  },
};


// -------------------  HOMEPAGE  /  ------------------------- //
app.get("/", (req, res) => {
  //res.send("Hello!");
  res.redirect("/login");

});
// app.get("/", (req, res) => {
//   const templateVars = {
//     urls: urlDatabase,
//     username: users[req.session.user_id]
//   };
//   res.render("urls_index", templateVars);
// });

// --------------------  /urls GET  POST ----------------------//
app.get("/urls", (req, res) => {
  //let userID = req.session.user_id;
  let userID = req.session.user_id;
  const templateVars = {
    urls: urlsForUser(userID),
    username: users[userID],
  };
  if (!userID) {
    res.redirect("/login");
    return;                 // to prevent urls_index from showing
  }
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  // Log the POST request body <= calling the function
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${newShortURL}`);
});

// --------------------  /urls.json GET  --------------------//
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// ---------------------  /hello GET  -----------------------//

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: "Hello World!" };
//   res.render("hello_world", templateVars);
// });

// --------------------  /urls/new GET  --------------------//
// Make sure to place this code above the app.get("/urls/:id", ...) route definition.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    //username: req.session["user_id"],
    username: users[req.session.user_id],
  };
  //const email = req.body.email;
  //const user = authenticateUserByEmail(email, users);
  console.log(templateVars);
  const user = templateVars.username;
  if (!user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});
// -------------------  /urls/:shortURL GET  -----------------//
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.send(`Long URL not found.  Please provide correct shortURL. `);
  }
  const user = req.session.user_id;
  if (!user) {
    res.redirect('/login');
  }
  const templateVars = {
    shortURL: req.params.shortURL, // keys
    longURL: urlDatabase[req.params.shortURL].longURL, // values
    username: req.session["user_id"],
  };

  console.log(templateVars);
  res.render("urls_show", templateVars);
});

// -------------------  /urls/:shortURL GET  -----------------//
app.get("/u/:shortURL", (req, res) => {
  // redirection to long url after clicking shorturl
  const shortURL = req.params.shortURL;
  if (!urlDatabase[req.params.shortURL]) {
    return res.send(`Long URL not found.  Please provide correct shortURL. `);
  }
  const lurl = urlDatabase[shortURL].longURL;
  res.redirect(lurl);
});

// -----------------  UPDATE /urls/:shortURL  -------------------//
// update the info in the db
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];

  if (!userID) {
    res.status(403).send("Please login");
    res.redirect("/login");
  }
  urlDatabase[shortURL].longURL = longURL; // update the db
  urlDatabase[shortURL].userID = userID;
  console.log(urlDatabase);
  res.redirect("/urls");
});

// -----------  DELETE & POST /urls/:shortURL/delete  ------------//
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id from the url
  const userID = req.session["user_id"];
  req.session.user_id = userID;

  if (!userID) {
    res.status(403).send("Please login first");
    return res.redirect("/login");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// -------  ADDITIONAL REQ: Basic Permission Features ------------//
// Redirecting When Logged In

// app.post("/urls/:shortURL/delete", (req, res) => {
//   const shortURL = req.params.shortURL; // extract the id from the url
//   delete urlDatabase[shortURL];
//   res.redirect("/urls");
// });

// ---------------- REGISTER GET POST - /register -----------------//
// Display the register form
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.session["user_id"],
    //req.session.user_id = userId;
  };
  res.render("register", templateVars);
});
// Handling the register form submit
app.post("/register", (req, res) => {
  // Extract the email and password from the form <= req.body (body-parser)
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(403)
      .send(
        `Email or password cannot be empty. Please provide a valid email and password.`
      );
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  // check if the user already in the db
  const user = getUserByEmail(email, users);
  // if (email === "" || password === "") {
  //   res
  //     .status(400)
  //     .send(
  //       `Email or password cannot be empty. Please provide a valid email and password.`
  //     );
  //   console.log(users);
  // }
  // if user is undefined/doesn't exist, add the user in the db
  if (!user) {
    // const id = addNewUser(email, hashedPassword, users);
    const id = generateRandomString();
    users[id] = { email, id, password: hashedPassword };
    // Setting the cookie in the user's browser
    //res.cookie("user_id", id); // username is a #
    req.session.user_id = id;
    res.redirect("/urls"); // should we asked user to login? or we make them login rigth away?
  } else {
    res.status(403).send(`${email} is already registered! Please login.`);
    console.log(users);
    res.redirect("/login");
  }
});

app.get("/users", (req, res) => {
  res.json(users);
});

// -------------- LOGIN -- GET -- POST -- /login ------------------//
app.get("/login", (req, res) => {
  //const templateVars = { username: req.session["user_id"] };
  //req.session.user_id = user_id;
  const templateVars = { username: req.session.user_id };
  res.render("login", templateVars);
  res.redirect("/urls");
});
//------------------  AUTHENTICATE the user  ----------------------//
app.post("/login", (req, res) => {
  // extract the information from the form with req.body
  const email = req.body.email;
  const password = req.body.password;
  // user must exist, check for the email && password
  const user = authenticateUser(email, password, users);
  console.log(user);
  if (user) {
    // Set the cookie with the user id
    //res.cookie("user_id", user.id);
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    // user is not authenticated => error message
    res.status(403).send("Please provide correct login credentials");
  }
});

// -------------- LOGOUT --- GET --- /logout --------------------//
app.get("/logout", (req, res) => {
  res.render("logout");
});
// -------------- LOGOUT --- POST --- /urls ---------------------//
app.post("/logout", (req, res) => {
  // clear the cookie
  //res.clearCookie("user_id");
  req.session = null;
  // res.cookie("username", null);
  //res.redirect("/urls");
  res.redirect("/urls");

});

// -------------------- LISTENING port --------------------------//
app.listen(PORT, () => {
  console.log(`Tiny App is listening on port ${PORT}!`);
});

module.exports = { users };
