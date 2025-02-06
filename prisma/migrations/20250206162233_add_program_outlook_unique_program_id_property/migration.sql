/*
  Warnings:

  - A unique constraint covering the columns `[programId]` on the table `ProgramOutlook` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noc,title]` on the table `SectionsEntity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Outlook" ADD COLUMN     "programNid" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ProgramOutlook_programId_key" ON "ProgramOutlook"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionsEntity_noc_title_key" ON "SectionsEntity"("noc", "title");

-- AddForeignKey
ALTER TABLE "Outlook" ADD CONSTRAINT "Outlook_programNid_fkey" FOREIGN KEY ("programNid") REFERENCES "Program"("nid") ON DELETE SET NULL ON UPDATE CASCADE;
