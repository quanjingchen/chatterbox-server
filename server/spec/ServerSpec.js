var handler = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');

describe('Node Server Request Listener Function', function() {
  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    var expectedOutput = [{'username': 'Jono', 'text': 'Do my bidding!', 'message_id': 0}];
    expect(res._data).to.equal(JSON.stringify(expectedOutput));
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data);
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  // new test 1
  // 3 messages
  it('Should respond with all 5 messages that were previously posted', function() {

    var stubMsg1 = {
      username: 'Jono',
      text: 'Do something else!'
    };

    var req1 = new stubs.request('/classes/messages', 'POST', stubMsg1);
    var res1 = new stubs.response();
    handler(req1, res1);

    var stubMsg2 = {
      username: 'Jono',
      text: 'Do something else!'
    };

    var req2 = new stubs.request('/classes/messages', 'POST', stubMsg2);
    var res2 = new stubs.response();
    handler(req2, res2);

    var stubMsg3 = {
      username: 'Jono',
      text: 'Do something else!'
    };

    var req3 = new stubs.request('/classes/messages', 'POST', stubMsg3);
    var res3 = new stubs.response();
    handler(req3, res3);

    // Now if we request the log for that room the message we posted should be there:
    var req4 = new stubs.request('/classes/messages', 'GET');
    var res4 = new stubs.response();

    handler(req4, res4);

    expect(res4._responseCode).to.equal(200);
    var messages = JSON.parse(res4._data);
    expect(messages.length).to.equal(5);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    handler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('Should not add an empty message', function() {

    var stubMsg = {
      username: 'Jono',
      text: ''
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler(req, res);

    // Expect 400 for bad request
    expect(res._responseCode).to.equal(400);
    expect(res._data).to.equal('Empty message');
    expect(res._ended).to.equal(true);
  });

  // new test
  it('Should not add a message that is too long', function() {

    var stubMsg = {
      username: 'Jono',
      text: 'strawberrystrawberrystrawberrystrawberrystrawberrystrawberrystrawberrystrawberrystrawberrystrawberrystrawberry'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler(req, res);

    // Expect 400 for bad request
    expect(res._responseCode).to.equal(400);
    expect(res._data).to.equal('Message too long!');
    expect(res._ended).to.equal(true);
  });

});
