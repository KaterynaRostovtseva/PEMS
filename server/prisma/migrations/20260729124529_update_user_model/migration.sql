/*
  Warnings:

  - You are about to alter the column `totalHours` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - You are about to alter the column `hourlyRate` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `budget` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - The `roleInProject` column on the `ProjectMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `hours` on the `TimeEntry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `hourlyRate` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - The `currency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[organizationId,name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,organizationId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FileAsset` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `grossAmount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taxesAmount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `netAmount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `code` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'UAH');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('TODO', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('PROJECT_MANAGER', 'TEAM_LEAD', 'DEVELOPER', 'DESIGNER', 'QA', 'DEVOPS', 'ANALYST', 'BUSINESS_ANALYST');

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'ARCHIVED';

-- DropIndex
DROP INDEX "Invitation_email_organizationId_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "FileAsset" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "taskId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'UAH',
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "totalHours" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "hourlyRate" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "grossAmount",
ADD COLUMN     "grossAmount" DECIMAL(12,2) NOT NULL,
DROP COLUMN "taxesAmount",
ADD COLUMN     "taxesAmount" DECIMAL(12,2) NOT NULL,
DROP COLUMN "netAmount",
ADD COLUMN     "netAmount" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "managerId" TEXT,
ALTER COLUMN "budget" DROP DEFAULT,
ALTER COLUMN "budget" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "roleInProject",
ADD COLUMN     "roleInProject" "ProjectRole";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "stageId" TEXT,
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "TimeEntry" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ALTER COLUMN "hours" SET DATA TYPE DECIMAL(5,2);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "timezone" TEXT DEFAULT 'UTC',
ALTER COLUMN "hourlyRate" DROP DEFAULT,
ALTER COLUMN "hourlyRate" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- CreateTable
CREATE TABLE "ProjectStageHistory" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "fromStage" TEXT,
    "toStage" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "StageStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectStageHistory_stageId_idx" ON "ProjectStageHistory"("stageId");

-- CreateIndex
CREATE INDEX "ProjectStageHistory_changedById_idx" ON "ProjectStageHistory"("changedById");

-- CreateIndex
CREATE INDEX "ProjectStage_projectId_idx" ON "ProjectStage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectStage_order_idx" ON "ProjectStage"("order");

-- CreateIndex
CREATE INDEX "Client_organizationId_idx" ON "Client"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_organizationId_name_key" ON "Client"("organizationId", "name");

-- CreateIndex
CREATE INDEX "FileAsset_organizationId_idx" ON "FileAsset"("organizationId");

-- CreateIndex
CREATE INDEX "FileAsset_uploadedById_idx" ON "FileAsset"("uploadedById");

-- CreateIndex
CREATE INDEX "Invitation_organizationId_idx" ON "Invitation"("organizationId");

-- CreateIndex
CREATE INDEX "Invitation_email_idx" ON "Invitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_organizationId_key" ON "Invitation"("email", "organizationId");

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_periodYear_periodMonth_idx" ON "Payment"("periodYear", "periodMonth");

-- CreateIndex
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_managerId_idx" ON "Project"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_organizationId_code_key" ON "Project"("organizationId", "code");

-- CreateIndex
CREATE INDEX "ProjectMember_projectId_idx" ON "ProjectMember"("projectId");

-- CreateIndex
CREATE INDEX "ProjectMember_userId_idx" ON "ProjectMember"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_assignedToId_idx" ON "Task"("assignedToId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_idx" ON "TimeEntry"("userId");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_idx" ON "TimeEntry"("projectId");

-- CreateIndex
CREATE INDEX "TimeEntry_date_idx" ON "TimeEntry"("date");

-- CreateIndex
CREATE INDEX "TimeEntry_status_idx" ON "TimeEntry"("status");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_projectId_date_idx" ON "TimeEntry"("userId", "projectId", "date");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStageHistory" ADD CONSTRAINT "ProjectStageHistory_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ProjectStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStageHistory" ADD CONSTRAINT "ProjectStageHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
