var change_function, get_function,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

get_function = function(obj, name) {
  var fnc;
  fnc = obj[name];
  if (fnc != null) {
    return fnc;
  } else {
    return function() {};
  }
};

change_function = function(obj, name, chain, number) {
  if (number == null) {
    number = 1;
  }
  return obj[name] = function() {
    var attrs, el, val;
    attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    val = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = chain.length; _i < _len; _i++) {
        el = chain[_i];
        _results.push(el.apply(obj, attrs));
      }
      return _results;
    })();
    return val[number];
  };
};

this.Before = function(obj, func, callback) {
  var old_fnc;
  old_fnc = get_function(obj, func);
  change_function(obj, func, [callback, old_fnc]);
  return true;
};

this.BeforeAnyCallback = function(obj, func, callback) {
  return console.warn("TODO");
};

this.After = function(obj, func, callback) {
  var old_fnc;
  old_fnc = get_function(obj, func);
  change_function(obj, func, [old_fnc, callback], 0);
  return true;
};

this.Around = function(obj, func, before, after) {
  var old_fnc;
  old_fnc = get_function(obj, func);
  change_function(obj, func, [before, old_fnc, after]);
  return true;
};

this.AfterAll = function(obj, funcs, callback) {
  var func, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = funcs.length; _i < _len; _i++) {
    func = funcs[_i];
    _results.push(After(obj, func, callback));
  }
  return _results;
};

this.LogAll = function(object) {
  var key, value, _results;
  _results = [];
  for (key in object) {
    if (!__hasProp.call(object, key)) continue;
    value = object[key];
    if (value.call != null) {
      _results.push((function(key) {
        return Before(object, key, function() {
          return console.log("calling: " + key);
        });
      })(key));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

this.AutoBind = function(gui, useCase) {
  var key, value, _results;
  _results = [];
  for (key in gui) {
    value = gui[key];
    if (value.call != null) {
      _results.push((function(key) {
        var name;
        name = /(.*)Clicked/.exec(key)[1];
        if ((name != null) && useCase[name]) {
          return After(gui, key, function(args) {
            return useCase[name](args);
          });
        }
      })(key));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
