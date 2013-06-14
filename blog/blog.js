var fs = require('fs');
var http = require('http');
var markdown = require('marked');

function template(tp, content){
  return tp.toString().replace('{{ content }}', content);
}

var server = http.createServer(function(req, resp){
  resp.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('blog_post_template.html', function(err, tpContent){
    if (err){
      resp.end(err.message);
      return;
    }
    fs.readFile('my_blog_post.md', function(err, mdContent){
      if (err){
        resp.end(err.message);
        return;
      }
      resp.end(template(tpContent, markdown(mdContent.toString())));
    });
  });
});

server.listen(8000, '127.0.0.1');

console.log('Blog started on port', 8000);