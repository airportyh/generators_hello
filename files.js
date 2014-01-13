// This run function will correctly handle continouables
// that proxy to api's that have the node style of cps api
//
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
      res = gen.next.call(gen, answer)
    }
    if (!res.done){
      // recursive call to continues the loop
      res.value(next)
    }
  }
  next() // start the loop
}

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

// wrap the fs module
var fs = wrapModule(require('fs'))

// Now do a bunch of file operations
run(function*(){
  try{
    var file = yield fs.readFile('files.js')
    console.log(file.toString())
    var stat = yield fs.stat('files.js')
    console.log(stat)
    stat = yield fs.stat('flies.js') // this should trigger error because file no exist
    console.log(stat)
  }catch(e){
    console.log('Gracefully handling error', e.message)
  }
})
