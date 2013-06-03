var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

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

function close(){
  rl.close()
}

function question(q){
  return function(callback){
    rl.question(q, callback)
  }
}

run(function*(){
  var name = yield question('What is your name? ')
  var age = yield question('How old are you? ')
  console.log('Hello, ' + name + ', you are ' + age + ' years old.')
  close()
})