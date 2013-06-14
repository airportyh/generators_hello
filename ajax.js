function ajax(url){
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
  function next(value){
    var res = gen.send(value)
    if (!res.done){
      res.value(next)
    }
  }
  next()
}

run(function *(){
  var contents = yield xhr('README.md')
  document.body.innerHTML = markdown.toHTML(contents)
})