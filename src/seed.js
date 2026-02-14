import { connectDb } from "./config/db.js";
import { Service } from "./models/Service.js";
import { defaultServices } from "./data/services.js";

async function seed() {
  await connectDb();

  for (const service of defaultServices) {
    await Service.findOneAndUpdate({ slug: service.slug }, service, { upsert: true, new: true });
  }

  console.log("Services seeded");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
