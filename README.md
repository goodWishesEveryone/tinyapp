# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).


## Final Product

!["Screenshot of Login page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/login-page.png?raw=true)

!["Screenshot of Register page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/register-page.png?raw=true)

!["Screenshot of Register with Error page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/registerWithError-page.png.png?raw=true)

!["Screenshot of My URLs page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/myURLs-page.png?raw=true)

!["Screenshot of Create Tiny URL page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/newURL-page.png?raw=true)

!["Screenshot of Edit URL page"](https://github.com/goodWishesEveryone/tinyapp/blob/master/docs/editURL-page.png?raw=true)

!["Screenshots of Error Message if not logged in when accessing routes: /urls, /urls/new, and /urls/:id"](https://raw.githubusercontent.com/goodWishesEveryone/tinyapp/1395342dbac948f6d1917898f4ab72ea09d69e71/docs/errorNotLoggedIn%20-%20urls.urlsNew.urlsId-Page.png)

!["Screenshot of a message when user press SUBMIT without providing a URL in EDIT My URL page"](https://raw.githubusercontent.com/goodWishesEveryone/tinyapp/1395342dbac948f6d1917898f4ab72ea09d69e71/docs/requiredField-editURL.png)

!["Screenshot of Error Message when user LOGIN without providing correct password"](https://raw.githubusercontent.com/goodWishesEveryone/tinyapp/1395342dbac948f6d1917898f4ab72ea09d69e71/docs/errorCredentials-loginPage.png)

!["Screenshot of Error Message when user LOGIN but Email doesn't exists in Database"](https://raw.githubusercontent.com/goodWishesEveryone/tinyapp/1395342dbac948f6d1917898f4ab72ea09d69e71/docs/errorNotRegisteredUser-loginPage.png)

!["Screenshot of Error Message when user REGISTER but Email already exists in Database"](https://raw.githubusercontent.com/goodWishesEveryone/tinyapp/1395342dbac948f6d1917898f4ab72ea09d69e71/docs/errorRegisteredUser-registerPage.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.