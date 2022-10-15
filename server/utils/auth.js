// this is what make graphql and JWT magic happen. Start code was set up with express middleware

// stateful
// storing session data & cookie to facilitate the auth

// stateless (jwt) -- json web token

const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes

  //changed from context to req. now can get server. 

  authMiddleware: function ({ req, context }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      // .verify is a way to decryption user data
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
      // when we return req it will let the data flow to the rest of the app.
      return req;
    }
  },

  // sign token is a way to encrypt user data
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
