function xhr(url){
  return function(callback){
    var xhr = new XMLHttpRequest
    xhr.open('GET', url)
    xhr.send(null)
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        callback(xhr.responseText)
      }
    }
  }
}

function run(genfun){
  var gen = genfun()
  function next(){
    var res = gen.send.apply(gen, arguments)
    if (!res.done){
      res.value(next)
    }
  }
  next()
}

run(function *(){
  console.log('Getting README.md')
  var code = yield xhr('README.md')
  document.body.innerHTML = markdown.toHTML(code)
})