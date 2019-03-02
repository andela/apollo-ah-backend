import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerJSDoc from 'swagger-jsdoc';
import morgan from 'morgan';
import dotenv from 'dotenv';
import methodOveride from 'method-override';
import logger from './helpers/logger';


const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
// Create global app object
const app = express();

// Normal express config defaults
dotenv.config();
logger.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOveride());
app.use(express.static(`${__dirname}/public`));
app.use(morgan(':remote-addr - ":method :url :status ":user-agent"', {
  stream: logger.stream(),
  skip: () => !isProduction
}));
app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}


/* Mongoose related code. To be refactored

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://localhost:27017/ah', { useNewUrlParser: true });
  mongoose.set('debug', true);
}

require('./models/User');

app.use(routes);
*/

const swaggerDefinition = {
  info: {
    title: "Author's Haven API",
    version: '1.0.0',
    description: "Documenting Author's Haven API",
  },
  host: 'localhost:3000',
  basePath: '/',
};

const options = {
  // import swaggerDefinitions
  definition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js', './routes/api/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to the API' }));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
app.listen(PORT);

export default app;
