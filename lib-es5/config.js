"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Assign a value to a nested object
 * @function putNestedValue
 * @param params the parent object - this argument will be modified!
 * @param key key in the form nested[innerkey]
 * @param value the value to assign
 * @return the modified params object
 */
var url = require('url');
var extend = require("lodash/extend");
var isObject = require("lodash/isObject");
var isString = require("lodash/isString");
var isUndefined = require("lodash/isUndefined");
var entries = require('./utils/entries');

var cloudinary_config = void 0;

/**
 * Sets a value in an object using a nested key
 * @param {object} params The object to assign the value in.
 * @param {string} key The key of the value. A period is used to denote inner keys.
 * @param {*} value The value to set.
 * @returns {object} The params argument.
 * @example
 *     let o = {foo: {bar: 1}};
 *     putNestedValue(o, 'foo.bar', 2); // {foo: {bar: 2}}
 *     putNestedValue(o, 'foo.inner.key', 'this creates an inner object');
 *     // {{foo: {bar: 2}, inner: {key: 'this creates an inner object'}}}
 */
function putNestedValue(params, key, value) {
  var chain = key.split(/[\[\]]+/).filter(function (i) {
    return i.length;
  });
  var outer = params;
  var lastKey = chain.pop();
  for (var j = 0; j < chain.length; j++) {
    var innerKey = chain[j];
    var inner = outer[innerKey];
    if (inner == null) {
      inner = {};
      outer[innerKey] = inner;
    }
    outer = inner;
  }
  outer[lastKey] = value;
  return params;
}

module.exports = function (new_config, new_value) {
  if (cloudinary_config == null || new_config === true) {
    if (cloudinary_config == null) {
      cloudinary_config = {};
    } else {
      (0, _keys2.default)(cloudinary_config).forEach(function (key) {
        return delete cloudinary_config[key];
      });
    }

    var cloudinary_url = process.env.CLOUDINARY_URL;
    if (cloudinary_url != null) {
      var uri = url.parse(cloudinary_url, true);
      var parsedConfig = {
        cloud_name: uri.host,
        api_key: uri.auth && uri.auth.split(":")[0],
        api_secret: uri.auth && uri.auth.split(":")[1],
        private_cdn: uri.pathname != null,
        secure_distribution: uri.pathname && uri.pathname.substring(1)
      };
      entries(parsedConfig).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (value !== undefined) {
          cloudinary_config[key] = value;
        }
      });
      if (uri.query != null) {
        entries(uri.query).forEach(function (_ref3) {
          var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          return putNestedValue(cloudinary_config, key, value);
        });
      }
    }
  }
  if (!isUndefined(new_value)) {
    cloudinary_config[new_config] = new_value;
  } else if (isString(new_config)) {
    return cloudinary_config[new_config];
  } else if (isObject(new_config)) {
    extend(cloudinary_config, new_config);
  }
  return cloudinary_config;
};