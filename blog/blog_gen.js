var fs = require('fs');
var http = require('http');
var markdown = require('marked');

function template(tp, content){
  return tp.toString().replace('{{ content }}', content);
}

var server = http.createServer(function(req, resp){
  resp.writeHead(200, {'Content-Type': 'text/html'});
  run(function*(){
    try{
      var tpContent = yield readFile('blog_post_template.html');
      var mdContent = yield readFile('my_blog_post.md');
      resp.end(template(tpContent, markdown(String(mdContent))));
    }catch(e){
      resp.end(e.message);
    }
  });
});

server.listen(8000, '127.0.0.1');

console.log('Blog started on port', 8000);

function readFile(filepath){
  return function(callback){
    fs.readFile(filepath, callback)
  }
}

function run(genfun){
  // instantiate the generator object
  var gen = genfun()
  // This is the async loop pattern
  function next(err, answer){
    var res
    if (err){
      // if err, throw it into the wormhole
      return gen.throw(err)
    }else{
      // if good value, send it
      res = gen.send(answer)
    }
    if (!res.done){
      // if we are not at the end
      // we have an async request to
      // fulfill, we do this by calling 
      // `value` as a function
      // and passing it a callback
      // that receives err, answer
      // for which we'll just use `next()`
      res.value(next)
    }
  }
  // Kick off the async loop
  next()
}