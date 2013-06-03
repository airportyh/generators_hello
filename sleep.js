// Synchronous-looking sleep

// `run` is a top level function that handles
// 
function run(genfun){
  var gen = genfun()
  function next(){
    var res = gen.next()
    if (!res.done){
      res.value(next)
    }
  }
  next()
}


// A "continueable-ish" type of thing that
// when yielded to will sleep for `ms` milliseconds.
function sleep(ms){
  return function(callback){
    setTimeout(callback, ms)
  }
}

run(function *(){
  for (var i = 10; i > 0; i--){
    console.log(i)
    yield sleep(1000)
  }
  console.log('Happy New Year!')
})