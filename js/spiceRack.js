var iterateFrom = function(fr) {
  return function(count) {
    return function(fn) {
      var from = fr;
      var to = count + fr;
      while (from < to) {
        fn(from++);
      }
    };
  };
};
var compose = function() {
  var fns = arguments;
  return function (x) {
    iterateFrom(0)(fns.length)(function(i) {
      x = fns[i].call(this, x);
    });
    return x;
  };
};
var wrap = function(parent) {
  return function(fn) {
    return fn(parent);
  };
};

module.exports = function(obj) {
  obj.iterateFrom = iterateFrom;
  obj.compose = compose;
  obj.wrap = wrap;
};
