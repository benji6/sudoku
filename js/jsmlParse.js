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
      if (fns[i]) {
        x = fns[i].call(this, x);
      }
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

var setId = function(el, name) {
  el.id = name;
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

var jsmlWalker = function jsmlWalker(fn) {
  return function recurse(jsml) {
    return function(parentNode) {
      var domEl;
      var fnParentSet = fn(parentNode);
      var run = function(jsml) {
        if (!jsml.count) {
          jsml.count = 1;
        }
        for (var i = 0; i < jsml.count; i++) {
          domEl = fnParentSet(jsml, i);
          jsml.children && recurse(jsml.children)(domEl);
        }
      };
      if (jsml.constructor === Array) {
        var i;
        for (i = 0; i < jsml.length; i++) {
          run(jsml[i]);
        }
      } else {
        run(jsml);
      }
    };
  };
};

var attrSetter = function(el, prop, domEl, fn) {
  if (el[prop]) {
    if (typeof el[prop] === "function") {
      fn(domEl, el[prop]());
      return;
    }
    fn(domEl, el[prop]);
  }
};

var textSetter = function(text, domEl) {
  if (text) {
    if (typeof text === "function") {
      appendChild(createTextNode(text()))(domEl);
      return;
    }
    appendChild(createTextNode(text))(domEl);
  }
};

var jsmlWalkerCallback = function(forEachCallback) {
  return function(parentNode) {
    return function(el, count) {
      if (!count) {
        count = 0;
      }
      var domEl = createElement(el.tag);
      forEachCallback && forEachCallback(domEl, parentNode, count);
      el.callback && el.callback(domEl, parentNode, count);
      textSetter(el.text, domEl);
      attrSetter(el, "id", domEl, setId);
      attrSetter(el, "class", domEl, setClassName);
      appendChild(domEl)(parentNode);
      return domEl;
    };
  };
};

jsmlParse = function(jsml, parentNode, forEachCallback) {
  jsmlWalker(jsmlWalkerCallback(forEachCallback))(jsml)(parentNode);
};
module.exports = jsmlParse;
