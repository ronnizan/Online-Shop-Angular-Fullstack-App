const mongoose = require("mongoose");

function connectAsync() {
  return new Promise((resolve, reject) => {
    const connStr = config.mongodb.connectionString;

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(connStr, options, (err, db) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
    });
  });
}

(async () => {
  try {
    const db = await connectAsync();
    console.log(`Connected to ${db.name}`);
  } catch (err) {
    console.error(err);
  }
})();
