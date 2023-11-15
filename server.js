import mongoose from 'mongoose';

import { app } from './app.js';

const HOST_DB = process.env;

mongoose.connect(HOST_DB)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful")
    })
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });

  