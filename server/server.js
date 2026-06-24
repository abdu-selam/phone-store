const app = require("./src/app");
const connectDB = require("./src/configs/db.config");
const { PORT } = require("./src/utils/env");

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serever is running`);
  });
};

startServer()
