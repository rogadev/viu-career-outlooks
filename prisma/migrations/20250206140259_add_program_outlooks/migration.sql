-- CreateEnum
CREATE TYPE "Credential" AS ENUM ('Certificate', 'Degree', 'Diploma');

-- CreateTable
CREATE TABLE "Outlook" (
    "id" SERIAL NOT NULL,
    "noc" TEXT NOT NULL,
    "economicRegionCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "outlook" TEXT NOT NULL,
    "trends" TEXT NOT NULL,
    "trendsHash" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "province" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'EN',

    CONSTRAINT "Outlook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "nid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    "viuSearchKeywords" TEXT,
    "nocSearchKeywords" TEXT[],
    "knownNocGroups" TEXT[],
    "programAreaNid" INTEGER NOT NULL,
    "credential" "Credential" NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("nid")
);

-- CreateTable
CREATE TABLE "ProgramArea" (
    "id" SERIAL NOT NULL,
    "nid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ProgramArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitGroup" (
    "noc" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,

    CONSTRAINT "UnitGroup_pkey" PRIMARY KEY ("noc")
);

-- CreateTable
CREATE TABLE "SectionsEntity" (
    "id" SERIAL NOT NULL,
    "noc" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "items" TEXT[],

    CONSTRAINT "SectionsEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicRegion" (
    "economicRegionCode" TEXT NOT NULL,
    "economicRegionName" TEXT NOT NULL,

    CONSTRAINT "EconomicRegion_pkey" PRIMARY KEY ("economicRegionCode")
);

-- CreateTable
CREATE TABLE "ProgramOutlook" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "results" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramOutlook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Outlook_noc_economicRegionCode_lang_releaseDate_province_ti_key" ON "Outlook"("noc", "economicRegionCode", "lang", "releaseDate", "province", "title", "trendsHash", "outlook");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramArea_title_key" ON "ProgramArea"("title");

-- CreateIndex
CREATE INDEX "ProgramOutlook_programId_idx" ON "ProgramOutlook"("programId");

-- AddForeignKey
ALTER TABLE "Outlook" ADD CONSTRAINT "Outlook_economicRegionCode_fkey" FOREIGN KEY ("economicRegionCode") REFERENCES "EconomicRegion"("economicRegionCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outlook" ADD CONSTRAINT "Outlook_noc_fkey" FOREIGN KEY ("noc") REFERENCES "UnitGroup"("noc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_programAreaNid_fkey" FOREIGN KEY ("programAreaNid") REFERENCES "ProgramArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionsEntity" ADD CONSTRAINT "SectionsEntity_noc_fkey" FOREIGN KEY ("noc") REFERENCES "UnitGroup"("noc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramOutlook" ADD CONSTRAINT "ProgramOutlook_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("nid") ON DELETE RESTRICT ON UPDATE CASCADE;
