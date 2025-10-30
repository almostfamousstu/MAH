-- CreateTable
CREATE TABLE "Automation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastRunRelative" TEXT NOT NULL,
    "runRate" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightKpi" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "delta" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InsightKpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightAdoption" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InsightAdoption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightIncident" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InsightIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapMilestone" (
    "id" SERIAL NOT NULL,
    "quarter" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoadmapMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "votes" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FeedbackItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Automation_name_key" ON "Automation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InsightKpi_title_key" ON "InsightKpi"("title");

-- CreateIndex
CREATE UNIQUE INDEX "InsightAdoption_team_key" ON "InsightAdoption"("team");

-- CreateIndex
CREATE UNIQUE INDEX "InsightIncident_label_key" ON "InsightIncident"("label");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapMilestone_focus_key" ON "RoadmapMilestone"("focus");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackItem_title_key" ON "FeedbackItem"("title");
