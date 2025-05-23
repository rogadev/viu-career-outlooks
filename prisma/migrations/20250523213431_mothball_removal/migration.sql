/*
  Warnings:

  - You are about to drop the `ProgramOutlook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgramOutlook" DROP CONSTRAINT "ProgramOutlook_programId_fkey";

-- DropTable
DROP TABLE "ProgramOutlook";
