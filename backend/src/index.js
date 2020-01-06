const express = require('express');
require('dotenv').config();
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
const expenseRouter = require('./routers/expense');
const cors = require('./middleware/cors');


const app = express();
const port = process.env.PORT || 4000;

//parse requests as JSON
app.use(express.json());

app.use(cors);

// register router middlewares
app.use(userRouter);
app.use(taskRouter);
app.use(expenseRouter);

//startup server to listen on the port specified
app.listen(port, () => {
    console.log('Listening on port ' + port);
})