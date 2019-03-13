import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import morgan from 'morgan';
import methodOveride from 'method-override';
import createError from 'http-errors';
import passport from 'passport';
import logger from './helpers/logger';
import { MESSAGE } from './helpers/constants';
import exceptionHandler from './middlewares/exceptionHandler';
import models from './models';

// Routes
import routes from './routes';

// Create global app object
const app = express();

const isProduction = app.get('env') === 'production';

logger.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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

const { User } = models;

// PASSPORT CONFIGURATION
// Initialize Passport.js
app.use(passport.initialize());
// Restore session
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId, done);
});

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

app.get('/', (req, res) => {
  res.status(200).json({ message: MESSAGE.WELCOME_MESSAGE });
});

// routes endpoint
app.use('/api/v1', routes);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.send(swaggerSpec);
});

app.use((req, res, next) => {
  next(createError(404, MESSAGE.ROUTE_NOT_FOUND));
});

app.use(exceptionHandler);

export default app;
