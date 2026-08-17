import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { Users } from "./src/collections/Users.ts";
import { Home } from "./src/globals/Home.ts";
import { Media } from "./src/collections/Media.ts";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  globals: [Home],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
