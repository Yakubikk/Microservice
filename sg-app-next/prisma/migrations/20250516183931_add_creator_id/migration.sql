/*
  Warnings:

  - Added the required column `creatorId` to the `Manufacturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Wagon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wagon" ADD COLUMN     "creatorId" TEXT NOT NULL;
