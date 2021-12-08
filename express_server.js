const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  S152tx: "https://www.tsn.ca/",
  PsWtqz: "https://www.google.ca/",
};

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

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });

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
  // extract the id
  const shortURL = req.params.shortURL;
  // extract the question and anwer
  const longURL = req.body.longURL;
  // update the db
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);

  res.redirect("/urls");
});

// DELETE & POST
app.post("/urls/:shortURL/delete", (req, res) => {
  // extract the id from the url
  const shortURL = req.params.shortURL;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


module.exports = {generateRandomString};