"use strict";
exports.__esModule = true;
var express_1 = require("express");
var db_js_1 = require("../db/db.js");
var todos_ts_1 = require("../db/todos.ts");
var todoLists_ts_1 = require("../db/todoLists.ts");
var uuid_1 = require("uuid");
var router = express_1["default"].Router();
router.get('/todo-lists/:listId/todos', function (req, res) {
    try {
        var listId = req.params.listId;
        if (!uuid_1.validate(listId))
            return res.status(400).json({ error: 'Invalid ID format' });
        var todos = todos_ts_1.getTodosByListId(db_js_1["default"], listId);
        if (todos === null)
            return res.status(500).json({ error: 'Database error' });
        res.json(todos);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/todo-lists/:listId/todos', function (req, res) {
    try {
        var listId = req.params.listId;
        if (!uuid_1.validate(listId))
            return res.status(400).json({ error: 'Invalid ID format' });
        var list = todoLists_ts_1.getTodoListById(db_js_1["default"], listId);
        if (!list)
            return res.status(404).json({ error: 'Todo list not found' });
        var _a = req.body, title = _a.title, text = _a.text, due_date = _a.due_date;
        if (!title)
            return res.status(400).json({ error: 'Title is required' });
        var result = todos_ts_1.createTodo(db_js_1["default"], listId, title, text, due_date);
        if (result === null)
            return res.status(500).json({ error: 'Database error' });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/todos/:id', function (req, res) {
    try {
        var id = req.params.id;
        if (!uuid_1.validate(id))
            return res.status(400).json({ error: 'Invalid ID format' });
        var _a = req.body, title = _a.title, text = _a.text, completed = _a.completed, due_date = _a.due_date;
        var result = todos_ts_1.updateTodo(db_js_1["default"], id, { title: title, text: text, completed: completed, due_date: due_date });
        if (result === null)
            return res.status(404).json({ error: 'Todo id not found' });
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router["delete"]('/todos/:id', function (req, res) {
    try {
        var id = req.params.id;
        if (!uuid_1.validate(id))
            return res.status(400).json({ error: 'Invalid ID format' });
        var changes = todos_ts_1.deleteTodo(db_js_1["default"], id);
        if (changes === null)
            return res.status(500).json({ error: 'Database error' });
        if (changes === 0)
            return res.status(404).json({ error: 'Todo not found' });
        res.status(204).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports["default"] = router;
