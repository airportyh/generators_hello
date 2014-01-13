function* loop(){
  while(true){
    try{
      var val = yield null
      console.log('Got value', val)
    }catch(e){
      console.log('I caught you error!')
    }
  }
}

