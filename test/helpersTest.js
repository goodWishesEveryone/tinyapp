const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return false when user email is not valid', function() {
    const user = getUserByEmail("wrong@example.com", testUsers);
    //const expectedUserID = "userRandomID";
    assert.equal(user, undefined);
  });
  it('should return false when user email is empty', function() {
    const user = getUserByEmail('', testUsers);
    //const expectedUserID = "userRandomID";
    assert.equal(user, undefined);
  });
});
