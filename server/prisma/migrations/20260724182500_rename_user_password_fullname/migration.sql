-- Rename User credential/display columns to clearer names
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";
