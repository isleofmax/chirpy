import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations"
};

process.loadEnvFile()

type DBConfig = {
  migrationConfig: MigrationConfig;
  dbURL: string;
};

type APIConfig = {
  fileserverHits: number;
  port: string;
  platform: string;
};

type Config = {
  dbConfig: DBConfig;
  apiConfig: APIConfig;
}

export const config: Config = {
  dbConfig: {
    migrationConfig: migrationConfig,
    dbURL: envOrThrow(process.env.DB_URL)
  },
  apiConfig: {
    fileserverHits: 0,
    port: envOrThrow(process.env.PORT),
    platform: envOrThrow(process.env.PLATFORM)
  }
};

function envOrThrow(key: string | undefined): string {
  if (!key) {
    throw new Error("No db connection string provided!");
  }
  return key
}
