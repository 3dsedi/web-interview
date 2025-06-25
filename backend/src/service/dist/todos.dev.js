"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../db/db.js"));

var _todos = require("../db/todos.js");

var _todoLists = require("../db/todoLists.js");

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/todo-lists/:listId/todos', function (req, res) {
  try {
    var listId = req.params.listId;
    if (!(0, _uuid.validate)(listId)) return res.status(400).json({
      error: 'Invalid ID format'
    });
    var todos = (0, _todos.getTodosByListId)(_db["default"], listId);
    if (todos === null) return res.status(500).json({
      error: 'Database error'
    });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
router.post('/todo-lists/:listId/todos', function (req, res) {
  try {
    var listId = req.params.listId;
    if (!(0, _uuid.validate)(listId)) return res.status(400).json({
      error: 'Invalid ID format'
    });
    var list = (0, _todoLists.getTodoListById)(_db["default"], listId);
    if (!list) return res.status(404).json({
      error: 'Todo list not found'
    });
    var _req$body = req.body,
        title = _req$body.title,
        text = _req$body.text,
        due_date = _req$body.due_date;
    if (!title) return res.status(400).json({
      error: 'Title is required'
    });
    var result = (0, _todos.createTodo)(_db["default"], listId, title, text, due_date);
    if (result === null) return res.status(500).json({
      error: 'Database error'
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
router.patch('/todos/:id', function (req, res) {
  try {
    var id = req.params.id;
    if (!(0, _uuid.validate)(id)) return res.status(400).json({
      error: 'Invalid ID format'
    });
    var _req$body2 = req.body,
        title = _req$body2.title,
        text = _req$body2.text,
        completed = _req$body2.completed,
        due_date = _req$body2.due_date;
    var result = (0, _todos.updateTodo)(_db["default"], id, {
      title: title,
      text: text,
      completed: completed,
      due_date: due_date
    });
    if (result === null) return res.status(404).json({
      error: 'Todo id not found'
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
router["delete"]('/todos/:id', function (req, res) {
  try {
    var id = req.params.id;
    if (!(0, _uuid.validate)(id)) return res.status(400).json({
      error: 'Invalid ID format'
    });
    var changes = (0, _todos.deleteTodo)(_db["default"], id);
    if (changes === null) return res.status(500).json({
      error: 'Database error'
    });
    if (changes === 0) return res.status(404).json({
      error: 'Todo not found'
    });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});
var _default = router;
exports["default"] = _default;