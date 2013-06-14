var gen = require('../gen');
var fs = require('fs');
var http = require('http');
var markdown = require('marked');

function template(tp, content){
  return tp.toString().replace('{{ content }}', content);
}

var server = http.createServer(function(req, resp){
  resp.writeHead(200, {'Content-Type': 'text/html'});
  gen.run(function*(){
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