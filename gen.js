exports.run = run
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
      // recursive call to continues the loop
      res.value(next)
    }
  }
  next() // start the loop
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