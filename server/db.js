import mongoose from "mongoose";
require("dotenv").config();

const connectionString =
  process.env.DB_CONNECTION_STRING;


let isConnected;
const index = 0;

const connectToDatabase = () => {
  if (isConnected) {
    console.log(
      "=> using existing database connection"
    );
    return Promise.resolve();
  }

  console.log(
    "=> using new database connection"
  );
  return (
    mongoose
      // eslint-disable-next-line max-len
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((db) => {
        isConnected =
          db.connections[index]
            .readyState;

        console.log(
          "Connection Success!"
        );
      })
      .catch((e) => {
        throw e;
      })
  );
};

export default connectToDatabase;
