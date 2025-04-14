const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundMiddleware');

const app = express();

app.use(express.json());
app.use(cors()); 
  
app.get('/', (req, res, next) => {
    next.redirect('/tasks')
});
app.use('/tasks', taskRoutes);     
app.use('/events', eventRoutes); 

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;