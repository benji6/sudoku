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
  return function(x) {
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

var createElement = function(tag) {
  return document.createElement(tag);
};

var createTextNode = function(txt) {
  return document.createTextNode(txt);
};

var appendChild = function(child) {
  return function(parent) {
    return parent.appendChild(child);
  };
};

var createAndAppendChild = function(tag, parent) {
  return appendChild(createElement(tag))(parent);
};

var createAndAppendTextNode = function(txt, parent) {
  return appendChild(createTextNode(txt))(parent);
};

var setAttribute = function(el, name, val) {
  el.setAttribute(name, val);
  return el;
};

var setClassName = function(el, name) {
  el.className = name;
  return el;
};

var infanticide = function(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

var setAttribute = function(el, name, val) {
  el.setAttribute(name, val);
  return el;
};

var jsmlWalker = function arrayWalker(fn) {
  return function recurse(jsml) {
    if (jsml.constructor === Array) {
      var i;
      for (i = 0; i < jsml.length; i++) {
        fn(jsml[i]);
        jsml[i].children && recurse(jsml[i].children);
      }
    } else {
      fn(jsml);
      jsml.children && recurse(jsml.children);
    }
  };
};

var jsmlWalkerCallback = function(parentNode) {
  return function(forEachCallback) {
    return function recurse(el, recurseCount) {
      if (!recurseCount) {
        recurseCount = 0;
      }
      var domEl = createElement(el.tag);
      forEachCallback && calforEachCallbacklback(domEl, parentNode, recurseCount);
      el.callback && el.callback(domEl, parentNode, recurseCount);
      el.text && appendChild(createTextNode(el.text))(domEl);
      el.className && setClassName(domEl, el.className);
      appendChild(domEl)(parentNode);
      if (el.count) {
        if (++recurseCount < parseInt(el.count)) {
          recurse(el, recurseCount);
        }
      }
    };
  };
};

jsmlParse = function(jsml, parentNode, forEachCallback) {
  jsmlWalker(jsmlWalkerCallback(parentNode)(forEachCallback))(jsml);
};
module.exports = jsmlParse;
