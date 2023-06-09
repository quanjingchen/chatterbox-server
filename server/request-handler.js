/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

//define database array and push a message into it
var data = [];


var requestHandler = function (request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  // var data = [];

  if (request.method === 'GET' && request.url === '/classes/messages') {
    console.log('I made a get request');
    console.log('data: ', data);
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    console.log('I have made a POST request');
    console.log('request.url: ', request.url);
    console.log('request.body: ', request.body);
    let body = '';
    //reveive data from the client
    request.on('data', (chunk) => {
      console.log('I am in request on');
      body += chunk.toString();
      console.log('body:', body);
    });


    request.on('end', () => {
      console.log('received message:', body);
      var newMessage = JSON.parse(body);
      if (newMessage.text === '') {
        response.writeHead(400, headers);
        response.end('Empty message');
      } else if (newMessage.text.length > 100) {
        response.writeHead(400, headers);
        response.end('Message too long!');
      } else {
        //since body is a string, convert it to an object
        newMessage.message_id = data.length;
        //then push the new message to data array
        data.push(newMessage);
        console.log('data:', JSON.stringify(data));
        console.log('data length:', data.length);
        response.writeHead(201, headers);
        response.end(JSON.stringify(data));
      }
    });


  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end('wrong url');

  } else if (request.method === 'OPTIONS') {
    console.log('I made a options request');
    console.log('data: ', data);
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));

  } else {
    response.writeHead(statusCode, headers);
    response.end('hello world');
  }


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';
  // headers['Content-Type'] = 'application/json';



  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the data of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // response.end('data');






};







module.exports = requestHandler;