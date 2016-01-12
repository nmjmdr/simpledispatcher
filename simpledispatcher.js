var http = require('http');


const PORT = 8080;

var dispatcher = function() {
    this.getMap = {} 
    this.putMap = {}
    this.postMap = {}
    this.delMap = {}
}    

var d = new dispatcher();

// set the dispatch callbacks for put and get
dispatcher.prototype.onGet = function(path,callback) {
  this.getMap[path] = callback;  
}

dispatcher.prototype.onPut = function(path,callback) {
  this.putMap[path] = callback;  
}

dispatcher.prototype.onPost = function(path,callback) {
  this.postMap[path] = callback;  
}

dispatcher.prototype.onDel = function(path,callback) {
  this.delMap[path] = callback;  
}



dispatcher.prototype.dispatch = function(request,response) {
  
  var map
  if( request.method == "GET") {
     map = this.getMap;
  } else if( request.method == "PUT") {
      map = this.putMap;
  } else if( request.method == "POST") {
      map = this.postMap;
  } else if( request.method == "DEL") {
      map = this.delMap;
  }
    else {
      response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
      response.end();
      return;
  }
  deRefPath(request.url,map,request,response);
}

function deRefPath(path,map,request,response) {
  if(map[path] != undefined) {
      map[path](request,response)
  } else {
      console.log("no callback defined for path : "+path);
      response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
      response.end();
  }
}


// callbacks for various resources - samples
d.onGet("/xyz",function(req,res) {
    console.log("GET: xyz");
    res.end("hello");
 }
);

d.onPut("/xyz",function(req,res) {
    console.log("PUT: xyz");
    res.end();
 }
);



function handleListen() {

    console.log("Server Listening on: %s",PORT);
}

function handleRequest(request,response) {
   
   d.dispatch(request,response);
}



var server = http.createServer(handleRequest)
server.listen(PORT,handleListen);


