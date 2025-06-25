"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _todoLists = _interopRequireDefault(require("./service/todoLists.js"));

var _todos = _interopRequireDefault(require("./service/todos.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
exports.app = app;
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/todo-lists', _todoLists["default"]);
app.use('/api', _todos["default"]);
var PORT = 3001;
app.get('/', function (req, res) {
  return res.send('Hello World!');
});
app.listen(PORT, function () {
  return console.log("Example app listening on port ".concat(PORT, "!"));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, function () {
    return console.log("Example app listening on port ".concat(PORT, "!"));
  });
}