import fs from "fs";
import path from "path";

const schemaDir = path.join("prisma", "schema");
const outputFile = path.join("prisma", "schema.prisma");

const files = [
  "enums.prisma",
  "organization.prisma",
  "auth.prisma",
  "crm.prisma",
  "project.prisma",
  "task.prisma",
  "time-tracking.prisma",
  "payroll.prisma",
  "storage.prisma",
];

const header = `generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

let schema = header;

for (const file of files) {
  schema += fs.readFileSync(path.join(schemaDir, file), "utf8");
  schema += "\n\n";
}

fs.writeFileSync(outputFile, schema);

console.log("✔ Prisma schema merged.");