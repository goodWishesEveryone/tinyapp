const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// MIDDLEWARE
app.use(cookieParser());
// tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// URL DATABASE
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  S152tx: "https://www.tsn.ca/",
  PsWtqz: "https://www.google.ca/",
};

// ROUTES
// HOMEPAGE
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

// Make sure to place this code above the app.get("/urls/:id", ...) route definition.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,              // keys
    longURL: urlDatabase[req.params.shortURL],  // values
  };
  res.render("urls_show", templateVars);
});

// app.get("/urls/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL; //keys
//   const longURL = urlDatabase[shortURL]; //values <---
//   const templateVars = { shortURL, longURL };
//   res.render("urls_show", templateVars);
// });

app.get("/u/:shortURL", (req, res) => {
  // redirection to long url after clicking shorturl
  lurl = urlDatabase[req.params.shortURL];
  res.redirect(lurl);
});

// app.post("/urls", (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });

// After we generate our new shortURL, we add it to our database.
// Our server then responds with a redirect to /urls/:shortURL.
// Our browser then makes a GET request to /urls/:shortURL.
// Our server looks up the longURL from the database, sends the shortURL and longURL to the urls_show template, generates the HTML, and then sends this HTML back to the browser.
// The browser then renders this HTML.
app.post("/urls", (req, res) => {
  // Log the POST request body to the console
  // calling the function
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});

const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

// UPDATE => update the info in the db
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; // extract the id
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;      // update the db
  // console.log(urlDatabase);
  res.redirect("/urls");
});

// DELETE & POST
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;  // extract the id from the url
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
app.post('/urls', (req, res) => {
  // console.log(req.body);
  // console.log(req.body.longURL);
  let shortU = generateRandomString();
  urlDatabase[shortU] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortU}`);
});

// REGISTRATION routes
app.get("/", (req, res) =>{
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});

app.get("/registration", (req, res) => {
  const user = getUsername(req.cookies.username);
  res.render("registration");
});

// register submit handler
app.post("/register", (req, res) => {
  users[req.body.username] = req.body.password;
  console.log(JSON.stringify(users));
  res.cookie("username",req.body.username);
  res.redirect('/profile');
});

const addNewUser = (username, email, password) => {
  // Create a user id ... generate a unique id
  // const userId = Math.random().toString(36).substring(2, 8);
  // Create a new user object
  const newUser = {
    username,
    email,
    password,
  };
  // Add the user to the database
  // Read the value associated with the key
  users[userId] = newUser;
  return userId;
};

// const findUserByUsername = (username) => {
//   // using the built-in function here => find
//   // return Object.values(users).find(userObj => userObj.username === username);
//   // iterate through the users object
//   for (let userId in users) {
//     // try the match the username of each
//     if (users[userId].username === username) {
//       // if it matches return truthy
//       return users[userId];
//     }
//   }
//   return false;
// };

const authenticateUser = (email, password) => {
  // loop through the users db => object
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user.id;
  }
  return false;
};

// USER AUTHENTICATION
// Display the register form
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

// Handling the register form submit
app.post("/register", (req, res) => {
  // Extract the username and password from the form
  // req.body (body-parser) => get the info from our form

  const username = req.body.username;
  const password = req.body.password;
  // const {name, username, password} = req.body;
  // validation: check that the user is not already in the database
  const user = findUserByUsername(username);
  // if user is undefined, we can add the user in the db
  if (!user) {
    const userId = addNewUser(username, password);
    // Setting the cookie in the user's browser
    res.cookie("username", username);
    // redirect to '/urls/
    res.redirect("/urls");
  // } else {
  //   res.status(403).send("User is already registered!");
  }
});

// app.get("/users", (req, res) => {
//   res.json(users);
// });

// Display the login form

app.get("/login", (req, res) => {
  const templateVars = { username: null };
  res.render("login", templateVars);
});

// authenticate the user
app.post("/login", (req, res) => {
  // extract the information from the form with req.body
  // username + password
  const username = req.body.username;
  const password = req.body.password;
  // user must exist, check for the password
  // either userId has a value or it is falsy
  const userId = authenticateUser(username, password);
  res.cookie("username", username);
  res.redirect("/urls");
  // if (userId) {
  //   // Set the cookie with the user id
  //   res.cookie("username", userId);
  //   // redirect to /urls
  //   res.redirect("/urls");
  // } else {
  //   // user is not authenticated => error message
  //   res.status(401).send("Incorrect login credentials");
  // }
});

app.post("/logout", (req, res) => {
  // clear the cookie
  res.clearCookie("username");
  // res.cookie("username", null);
  res.redirect("/urls");
});

// LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});
// LOGIN post
// app.post("/login", (req, res) => {
//   let testName = req.body.username;
//   let testPassword = req.body.password;
//   if (users[testName] && users[testName] === testPassword) {
//     res.cookie("username",testName);
//     res.redirect("/profile");
//   } else {
//     res.redirect("/login");
//   }
// });

// 404
app.get('*',(req,res)=>{
  res.status(404);
  res.render('404');
});

// LOGOUT page
app.get("/logout", (req, res) => {
  res.render("logout");
});
// LOGOUT post
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// LISTENING port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});