const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const {
  getUserByEmail,
  authenticateUser,
  generateRandomString,
  urlsForUser,
} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

// --------------------------  MIDDLEWARE  ----------------------------//
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

// --------------------------  URL DATABASE  --------------------------//
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lX",
  },
  Shant1: {
    longURL: "https://www.brahmakumaris.org/",
    userID: "aJ48lZ",
  },
};

// ----------------------  USERS DATABASE  -----------------------//
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
  aJ48lZ: {
    id: "aJ48lZ",
    email: "goodwisheseveryone@gmail.com",
    password: bcrypt.hashSync("123", 10),
  },
};

// -------------------  HOMEPAGE  /  ------------------------- //
app.get("/", (req, res) => {
  let userID = req.session.user_id;

  // to prevent /urls from showing if not logged in
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

// --------------------  /urls GET  POST ----------------------//
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    username: users[userID],
  };
  // to prevent anyone from viewing /urls, if not logged in
  if (!userID) {
    res.render("error", { message: "You are currently not logged in." });
    return;
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  let userID = req.session.user_id;
  // to prevent from viewing /urls, if not logged in
  if (!userID) {
    res.render("error", { message: "You are currently not logged in." });
    return;
  }
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
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

// --------------------  /urls/new GET  --------------------//
// Make sure this code is above the app.get("/urls/:id", ...) route definition.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: users[req.session.user_id],
  };

  const user = templateVars.username;
  // to prevent from viewing /urls/new, if not logged in
  if (!user) {
    res.render("error", { message: "You are currently not logged in." });
    return;
  }
  res.render("urls_new", templateVars);
});

// -------------------  /urls/:shortURL GET  -----------------//
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  // to prevent from viewing /urls/:id (shortURL), if not logged in
  if (!userID) {
    res.render("error", { message: "You are currently not logged in." });
    return;
  }

  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.send(`Long URL not found.  Please provide correct shortURL. `);
  }

  const templateVars = {
    shortURL, // keys
    longURL: urlDatabase[shortURL].longURL, // values
    username: users[userID],
  };
  if (urlDatabase[shortURL].userID !== userID) {
    return res.send(
      `You are only allowed to view, update and delete your own shortURL.`
    );
  }
  res.render("urls_show", templateVars);
});

// -------------------  /urls/:shortURL GET  -----------------//
app.get("/u/:shortURL", (req, res) => {
  // redirection to long url after clicking shorturl
  const shortURL = req.params.shortURL;
  if (!urlDatabase[req.params.shortURL]) {
    return res.send(`Long URL not found.  Please provide correct shortURL.`);
  }
  const lurl = urlDatabase[shortURL].longURL;
  res.redirect(lurl);
});

// -----------------  UPDATE /urls/:shortURL  -------------------//
// update the info in the urlDatabase
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];

  // to prevent /urls/:id (shortURL) from being edited if not logged in
  if (!userID) {
    res.render("error", {
      message: "You are currently not logged in. Please login first",
    });
    return;
  }
  // update the db
  if (shortURL) {
    urlDatabase[shortURL].longURL = longURL;
    urlDatabase[shortURL].userID = userID;
    res.redirect("/urls");
  }
  res.redirect("/login");
});

// -----------  DELETE & POST /urls/:shortURL/delete  ------------//
app.post("/urls/:shortURL/delete", (req, res) => {
  // extract the id from the url
  const shortURL = req.params.shortURL;
  const userID = req.session["user_id"];
  req.session.user_id = userID;

  // to prevent /urls/:id (shortURL) from being edited if not logged in
  if (!userID) {
    res.render("error", {
      message: "You are currently not logged in.",
    });
    return;
  }
  // deletes shortURL if logged in
  if (shortURL) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
  res.redirect("/login");
});

// ---------------- REGISTER GET POST - /register -----------------//
// Display the register form if not logged in; otherwise redirect to My URLs page
app.get("/register", (req, res) => {
  const userID = req.session["user_id"];
  const templateVars = {
    registerURL: true,
  };
  if (userID) {
    res.redirect("/urls");
  }
  res.render("register", templateVars);
});

// Handling the register form submit
app.post("/register", (req, res) => {
  // Extract the email and password from the form <= req.body (body-parser)
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(403).render("register", {
      errorMessage:
        "Email or password cannot be empty. Please provide a valid email and password.",
    });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  // check if the user already in the db
  const user = getUserByEmail(email, users);
  // if user is undefined/doesn't exist, add the user in the db
  if (!user) {
    // create a user account, if email not exist in db
    const id = generateRandomString();
    users[id] = { email, id, password: hashedPassword };

    // Setting the cookie in the user's browser
    req.session.user_id = id;
    res.redirect("/urls");
  } else {
    // if email exists in db
    return res.status(403).render("register", {
      errorMessage: `${email} is already registered!`,
    });
  }
});

app.get("/users", (req, res) => {
  res.json(users);
});

// -------------- LOGIN -- GET -- POST -- /login ------------------//
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { username: userID, loginURL: true };
  if (userID) {
    res.redirect("/urls");
  }
  res.render("login", templateVars);
});
//------------------  AUTHENTICATE the user  ----------------------//
app.post("/login", (req, res) => {
  // extract the information from the form with req.body
  const email = req.body.email;
  const password = req.body.password;
  // user must exist in users DB, check for the email && password
  const user = authenticateUser(email, password, users); // returns null, true or false
  // user exists but provided wrong password
  if (user === null) {
    return res.status(403).render("login", {
      errorMessage: `Please provide correct login credentials.`,
    });
  }
  if (user) {
    // getUserByEmail returns users[id], an object contains user info
    const loggedInUser = getUserByEmail(email, users);
    // Set the cookie with the user id
    req.session.user_id = loggedInUser.id;
    res.redirect("/urls");
  } else {
    // if not a registered user => error message
    return res.status(403).render("login", {
      errorMessage: `${email} is not a registered user.`,
    });
  }
});

// -------------- LOGOUT --- GET --- /logout --------------------//
app.get("/logout", (req, res) => {
  res.render("logout");
});

// -------------- LOGOUT --- POST --- /urls ---------------------//
app.post("/logout", (req, res) => {
  // clear the cookie
  req.session = null;
  res.redirect("/urls");
});

// -------------------- LISTENING port --------------------------//
app.listen(PORT, () => {
  console.log(`Tiny App is listening on port ${PORT}!`);
});

// module.exports = { users, urlDatabase, urlsForUser };
