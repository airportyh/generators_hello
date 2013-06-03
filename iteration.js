// A generator that returns the set of natural numbers
function* naturalNumbers(){
  var n = 1
  do {
    yield n++
  }while(true)
}

// A generator that takes a generator `gen` and a number `n`, and returns
// the first `n` items of `gen`
function *take(gen, n){
  var res
  while (n > 0 && !(res = gen.next()).done){
    n--
    yield res.value
  }
}

// Since [array comprehensions](http://wiki.ecmascript.org/doku.php?id=harmony:array_comprehensions) 
// are not working yet, this is a function that iterates a generator.
function each(gen, fun){
  var res
  while(!(res = gen.next()).done){
    fun(res.value)
  }
}

// iterate the first 10 natural numbers
each(take(naturalNumbers(), 10), function(n){
  console.log(n)
})