exports.run = run
// this run function handles errors.
// if the continueable returns an error using Node's convention of
// first argument is an error
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
      res = gen.next(answer)
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

exports.wrap = wrap
// wrap a node-style cps function as a continuable
function wrap(fun){
  return function(){
    var args = Array.prototype.slice.apply(arguments)
    return function(callback){
      args.push(callback)
      fun.apply(null, args)
    }
  }
}

exports.wrapModule = wrapModule
// wrap an entire node module by proxying all the node-style
// apis via continuables
function wrapModule(module){
  var retval = {}
  for (var key in module){
    var fun = module[key]
    if (typeof fun === 'function'){
      retval[key] = wrap(fun)
    }
  }
  return retval
}