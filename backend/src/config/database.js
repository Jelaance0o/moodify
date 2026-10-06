const mongoose = require("mongoose")

function connectToDB(){
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("connect to Database");
      })
      .catch(() => {
        console.log("error connecting to DB");
      });
}

module.exports = connectToDB;