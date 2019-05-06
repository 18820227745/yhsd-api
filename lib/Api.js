var querystring = require('querystring'),
  config = require('./config'),
  request = require('./request'),
  paramError = new Error('缺少参数');

/**
 * 初始化
 * @param {string} token
 * @constructor
 */
var Api = function(token) {
  if (arguments.length < 1) {
    throw paramError;
  }
  this.token = token;
};

Api.prototype = {
  /**
   * 发送 GET 请求
   * @param {string} path
   * @param {Object} [query]
   * @param {Function} callback
   */
  get: function(path, query, agent, callback) {
    if (arguments.length < 2) {
      throw paramError;
    } else if (arguments.length < 3) {
      callback = query;
      query = null;
    }
    this.httpRequest('GET', query ? path + '?' + querystring.stringify(query) : path, null, agent, function(err, data) {
      callback && (callback(err, err ? null : data));
    });
  },
  /**
   * 发送 PUT 请求
   * @param {string} path
   * @param {Object} data
   * @param {Function} callback
   */
  put: function(path, data, agent = '', callback) {
    if (arguments.length < 3) {
      throw paramError;
    }
    this.httpRequest('PUT', path, data, agent, function(err, data) {
      callback && (callback(err, err ? null : data));
    });
  },
  /**
   * 发送 POST 请求
   * @param {string} path
   * @param {Object} data
   * @param {Function} callback
   */
  post: function(path, data, agent = '', callback) {
    if (arguments.length < 3) {
      throw paramError;
    }
    this.httpRequest('POST', path, data, agent, function(err, data) {
      callback && (callback(err, err ? null : data));
    });
  },
  /**
   * 发送 DELETE 请求
   * @param {string} path
   * @param {Function} callback
   */
  delete: function(path, agent = '', callback) {
    if (arguments.length < 2) {
      throw paramError;
    }
    this.httpRequest('DELETE', path, null, agent, function(err) {
      callback && (callback(err));
    });
  },
  /**
   * @param {string} method
   * @param {string} path
   * @param {Object} [params]
   * @param {Function} callback
   */
  httpRequest: function(method, path, params, agent = '', callback) {
    var options = {
      hostname: config.apiHost,
      path: '/v1/' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-ACCESS-TOKEN': this.token
      }
    };
    agent && (options.agent = agent);
    request(options, params, function(err, data) {
      if (err) {
        return callback(err);
      }
      if (data.code) {
        callback(data);
      } else {
        callback(null, data);
      }
    });
  }
};

module.exports = Api;
