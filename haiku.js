function* haiku(){
  console.log('I kill an ant');
  yield null;
  console.log('and realize my three children');
  yield null;
  console.log('have been watching.');
  yield null;
  console.log('- Kato Shuson');
}

var g = haiku();
function next(){
  if (g.next().done) return;
  setTimeout(next, 1000);
}
next();