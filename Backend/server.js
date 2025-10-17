import app from "./app.js";
import { connectMongo } from "./db/mongo.js";

const port = process.env.PORT || 5000;

async function start() {
  await connectMongo();
  app.listen(port, () => console.log(`Server listening on :${port}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
