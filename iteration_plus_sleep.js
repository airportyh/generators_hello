function* naturalNumbers(){
  var n = 1
  do {
    yield n++
  }while(true)
}

function *take(gen, n){
  var res
  while (n > 0 && !(res = gen.next()).done){
    n--
    yield res.value
  }
}

function each(gen, fun){
  var res
  while(!(res = gen.next()).done){
    fun(res.value)
  }
}

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


function sleep(ms){
  return function(callback){
    setTimeout(callback, ms)
  }
}

// This is an example of what you **can't** do.
run(function *(){
  each(take(naturalNumbers(), 10), function(n){
    // Can't `yield` unless your nearest `function` is a
    // generator.
    yield sleep(1000)
        //^^^^^
    // SyntaxError: Unexpected identifier
    console.log(n)
  })
  console.log('Happy New Year!')
})


