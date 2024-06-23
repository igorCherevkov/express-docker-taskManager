const express = require('express');
const sequilize = require('./db/db');
const models = require('./models/models');
const cors = require('cors');
const { Liquid } = require('liquidjs');
const engine = new Liquid();
const { todos, completedTodos } = require('./models/models');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');
app.set('views', './views');

const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
    try {
        const allTodos = await todos.findAll();
        const allCompletedTodos = await completedTodos.findAll();
        const todosData = allTodos.map(todo => ({ id: todo.id, name: todo.name, deadline: todo.deadline }));
        const completedTodosData = allCompletedTodos.map(todo => ({ id: todo.id, name: todo.name, deadline: todo.deadline }));
        const redTodos = [];

        todosData.forEach(todo => {
            const todoDeadline = todo.deadline;
            if (todoDeadline) {
                const currentDate = new Date();
                const deadlineDate = new Date(todoDeadline);
                const differenceMilliseconds = deadlineDate - currentDate;
                const differenceDays = Math.floor(differenceMilliseconds / (1000 * 60 * 60 * 24));
                differenceDays <= 1 ? redTodos.push(todoDeadline) : null;
            }
        });

        const todosWithDeadline = todosData.filter(todo => redTodos.includes(todo.deadline));
        const todosWithoutDeadline = todosData.filter(todo => !redTodos.includes(todo.deadline));

        context = {
            'todos': todosWithoutDeadline,
            'todosWithDeadline': todosWithDeadline,
            'completedTodos': completedTodosData,
        }

        res.render('app.liquid', context);
    } catch(e) {
        console.log(e);
        res.redirect('/errorPage');
    }
});

app.post('/completeTodo', async (req, res) => {
    const { todoId } = req.body;
    try {
        const todo = await todos.findByPk(todoId);

        await completedTodos.create({ name: todo.name, deadline: todo.deadline });

        await todos.destroy({ where: { id: todoId } });

        res.redirect('/');
    } catch(e) {
        console.log(e);
        res.redirect('/errorPage');
    }
});

app.post('/deleteTodo', async (req, res) => {
    const { todoId } = req.body;
    try {
        await completedTodos.destroy({ where: { id: todoId } });

        res.redirect('/');
    } catch(e) {
        console.log(e);
        res.redirect('/errorPage');
    }
});

app.post('/add', async (req, res) => {
    const { caseName, deadline } = req.body;
    if (!caseName) {
        res.redirect('/errorPage');
    }
    try {
        if (deadline) {
            await todos.create({ name: caseName, deadline });
        } else {
            await todos.create({ name: caseName });
        }
        res.redirect('/');
    } catch(e) {
        console.log(e);
        res.redirect('/errorPage');
    }
});

app.get('/errorPage', (req, res) => {
    if (res.status(500)) {
        res.status(500).send('Что-то пошло не так, попробуйте еще раз');
    } else if(res.status(400)) {
        res.status(500).send('Вы не ввели название дела');
    }
})

const start = async () => {
    try {
        await sequilize.authenticate();
        await sequilize.sync();
        app.listen(PORT, () => console.log(`server was started on port ${PORT}`));
    } catch(e) {
        console.log(e);
    }
};

start();