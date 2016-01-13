var http = require('http');


const PORT = 8080;

var dispatcher = function() {
   this.map = {}
}    

var methodHandlers = function() {
    this.onGet = null;
    this.onPut = null;
    this.onPost = null;
    this.onDel = null;
}


var d = new dispatcher();

// set the dispatch callbacks for put and get
dispatcher.prototype.onGet = function(path,callback) {
  if( this.map[path] == undefined || this.map[path] == null ) {
    this.map[path] = new methodHandlers();
  }
  this.map[path].onGet = callback;  
}

dispatcher.prototype.onPut = function(path,callback) {
  if( this.map[path] == undefined || this.map[path] == null ) {
    this.map[path] = new methodHandlers();
  }  
  this.map[path].onPut = callback;   
}

dispatcher.prototype.onPost = function(path,callback) {
  if( this.map[path] == undefined || this.map[path] == null ) {
    this.map[path] = new methodHandlers();
  }  
  this.map[path].onPost = callback; 
}

dispatcher.prototype.onDel = function(path,callback) {
  if( this.map[path] == undefined || this.map[path] == null ) {
    this.map[path] = new methodHandlers();
  }  
  this.map[path].onDel = callback;   
}



dispatcher.prototype.dispatch = function(request,response) {
  
  var callback = getcallback(this.map,request.url,request.method);
   
  // dispatch
  if(callback != null && callback != undefined) {
      callback(request,response)
  } else {
      console.log("no callback defined for path : "+request.url);
      response.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
      response.end();
  }
}

function getcallback(map,path,method) {
    if(map[path] == undefined || map[path] == null) {
	return null;
    } 

    if(method == "GET") {
	if(map[path].onGet == undefined || map[path].onGet == null) {
	    return null;
	} else {
	    return map[path].onGet;
	}
    } else if(method =="PUT") {
	if(map[path].onPut == undefined || map[path].onPut == null) {
	    return null;
	} else {
	    return map[path].onPut;
	}
    } else if(method =="POST") {
	if(map[path].onPost == undefined || map[path].onPost == null) {
	    return null;
	} else {
	    return map[path].onPost;
	}
    } else if(method =="DEL") {
	if(map[path].onDel == undefined || map[path].onDel == null) {
	    return null;
	} else {
	    return map[path].onDel;
	}
    }  else {
	return null;
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


