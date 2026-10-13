import { configDotenv } from 'dotenv';
import { defineConfig } from 'prisma/config';

configDotenv()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
