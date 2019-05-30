
// module.exports = function deepMerge() {
export function deepMerge() {

  var extended = {};
  var deep = false;
  var i = 0;

  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  var mergeObject = function (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = deepMerge(extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for (; i < arguments.length; i++) {
    mergeObject(arguments[i]);
  }

  return extended;
};
