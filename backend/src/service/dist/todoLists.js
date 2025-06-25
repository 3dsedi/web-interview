"use strict";
exports.__esModule = true;
var express_1 = require("express");
var db_js_1 = require("../db/db.js");
var todoLists_ts_1 = require("../db/todoLists.ts");
var uuid_1 = require("uuid");
var router = express_1["default"].Router();
router.get('/', function (req, res) {
    try {
        var lists = todoLists_ts_1.getAllTodoLists(db_js_1["default"]);
        res.json(lists);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', function (req, res) {
    try {
        var title = req.body.title;
        if (!title)
            return res.status(400).json({ error: 'Title is required' });
        var result = todoLists_ts_1.createTodoList(db_js_1["default"], title);
        res.status(201).json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router["delete"]('/:id', function (req, res) {
    try {
        var id = req.params.id;
        if (!uuid_1.validate(id))
            return res.status(400).json({ error: 'Invalid ID format' });
        var changes = todoLists_ts_1.deleteTodoList(db_js_1["default"], id);
        if (changes === 0)
            return res.status(404).json({ error: 'List not found' });
        res.status(204).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/:id', function (req, res) {
    try {
        var id = req.params.id;
        if (!uuid_1.validate(id))
            return res.status(400).json({ error: 'Invalid ID format' });
        var title = req.body.title;
        if (!title)
            return res.status(400).json({ error: 'Title is required' });
        var changes = todoLists_ts_1.updateTodoListTitle(db_js_1["default"], id, title);
        if (changes === 0)
            return res.status(404).json({ error: 'List not found' });
        res.json({ id: id, title: title });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports["default"] = router;
