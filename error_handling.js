// An experiment that propagates errors from continouables up to generators

// a continuable that returns a xhr response
function xhr(url){
  return function(callback){
    var xhr = new XMLHttpRequest
    xhr.open('GET', url)
    xhr.send(null)
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          // success! returning responseText with no error
          callback(null, xhr.responseText)
        }else{
          // returning an error
          callback(new Error(xhr.status + ': ' + xhr.responseText), xhr.responseText)
        }
      }
    }
  }
}

// this run function handles errors.
// if the continueable returns an error using Node's convention of
// first argument is an error
function run(genfun){
  var gen = genfun()
  // This is the async loop pattern <http://tobyho.com/2011/11/03/delaying-repeatedly/>
  function next(err, answer){
    var res
    if (err){
      // if error, we want to throw it so it's catchable
      // on the outside
      return gen.throw.apply(gen, arguments)
    }else{
      // if no error, send the answer back to the outside
      res = gen.send.call(gen, answer)
    }
    if (!res.done){
      res.value(next)
    }
  }
  next() // start the loop
}

// main function which attempts to get a markdown file and render it
run(function*(){
  var code
  try{
    var code = yield xhr('Blah.md') // should fail here because file doesn't exist
    document.body.innerHTML = markdown.toHTML(code)
  }catch(e){
    // should catch error here
    document.body.innerHTML = e.message
  }
})