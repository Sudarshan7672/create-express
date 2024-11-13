#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// Utility function to create a file with content
const createFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w' });
    console.log(`Created: ${filePath}`);
  } catch (err) {
    console.error(`Error creating file ${filePath}:`, err);
  }
};

// Main function to generate the file structure
const generateExpressStructure = () => {
  // Get the current working directory
  const baseDir = process.cwd();

  // Define the directories and files
  const dirs = [
    'src/controllers',
    'src/middleware',
    'src/models',
    'src/routes',
    'src/config',
    'src/utils',
    'src/public',
    'src/views',
    'src/services',
  ];

  // Create directories
  dirs.forEach((dir) => mkdirp.sync(path.join(baseDir, dir)));

  // Create a basic Express server file
  const serverContent = `
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
const connectDB = require('./src/config/db');

const passport = require("passport");
const { initializingPassport, isStudentAuthenticated, isRegistrarAuthenticated, isAccountantAuthenticated } = require('./src/config/passportconfig');
initializingPassport(passport);
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongostore.create({ mongoUrl: process.env.DB_URI, collectionName: 'sessions' }),
  cookie: { maxAge: 1000*60*60*24 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(process.env.PORT, () => {
  console.log(\`Server running at http://localhost:\${process.env.PORT}\`);
});
`;

  // .env content
  const dotenv = `
PORT=8080
DB_URI=
SESSION_SECRET=
`;

  // db.js content
  const dbConfig = `
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
`;

  // Create necessary files
  createFile(path.join(baseDir, 'server.js'), serverContent);
  createFile(path.join(baseDir, '.env'), dotenv);
  createFile(path.join(baseDir, 'src/config/db.js'), dbConfig);

  // Create example route
  const routeContent = `
const express = require('express');
const router = express.Router();
const { getSample } = require('../controllers/sampleController');

// Define the route
router.get('/sample', getSample);

module.exports = router;
`;

  createFile(path.join(baseDir, 'src/routes/sampleRoute.js'), routeContent);

  // Create basic package.json
  const packageJsonContent = `{
  "name": "express-starter-kit",
  "version": "1.0.0",
  "description": "A simple starter kit for Express.js apps",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "*",
    "dotenv": "*",
    "mongoose": "*",
    "nodemon": "*"
  },
  "devDependencies": {},
  "license": "ISC"
}`;

  createFile(path.join(baseDir, 'package.json'), packageJsonContent);

  // Create .gitignore file
  const gitignoreContent = `
node_modules/
.env
.DS_Store
.vscode
`;

  createFile(path.join(baseDir, '.gitignore'), gitignoreContent);

  // Create README.md
  const readmeContent = `# Express Starter Kit

This is a simple starter kit for building Express.js applications.

## Getting Started

1. Clone this repo.
2. Run \`npm install\` to install dependencies.
3. Run \`npm start\` to start the server.

## File Structure

- \`server.js\`: The entry point of the application.
- \`controllers/\`: Controllers to handle business logic.
- \`routes/\`: Define the routes for the application.
- \`models/\`: Models for MongoDB or other databases.
- \`middleware/\`: Express middlewares.
`;

  createFile(path.join(baseDir, 'README.md'), readmeContent);

  console.log('Express structure has been created successfully!');
};

// Call the function to generate the structure
generateExpressStructure();
