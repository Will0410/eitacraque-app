-- ─────────────────────────────────────────────────────────
-- Features: IA Reactions, Scout Profiles, Proposals, Meetings, Scout Ratings
-- ─────────────────────────────────────────────────────────

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE', 'HELPFUL', 'NOT_HELPFUL');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- ─────────────────────────────────────────────────────────
-- Alter ScoutProfile: add new columns
-- ─────────────────────────────────────────────────────────
ALTER TABLE "ScoutProfile" ADD COLUMN    "cartolaId"        TEXT;
ALTER TABLE "ScoutProfile" ADD COLUMN    "brasfutId"        TEXT;
ALTER TABLE "ScoutProfile" ADD COLUMN    "licenseNumber"    TEXT;
ALTER TABLE "ScoutProfile" ADD COLUMN    "experienceYears"  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ScoutProfile" ADD COLUMN    "verified"         BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ScoutProfile" ADD COLUMN    "rating"           DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "ScoutProfile" ADD COLUMN    "ratingCount"      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ScoutProfile" ADD COLUMN    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Unique constraints on ScoutProfile
CREATE UNIQUE INDEX "ScoutProfile_cartolaId_key" ON "ScoutProfile"("cartolaId");
CREATE UNIQUE INDEX "ScoutProfile_brasfutId_key" ON "ScoutProfile"("brasfutId");
CREATE UNIQUE INDEX "ScoutProfile_licenseNumber_key" ON "ScoutProfile"("licenseNumber");

-- ─────────────────────────────────────────────────────────
-- Proposal: add scoutId column
-- ─────────────────────────────────────────────────────────
ALTER TABLE "Proposal" ADD COLUMN    "scoutId" TEXT;

-- ─────────────────────────────────────────────────────────
-- CreateTable: PlayerTrack
-- ─────────────────────────────────────────────────────────
CREATE TABLE "PlayerTrack" (
    "id"            TEXT NOT NULL,
    "scoutId"       TEXT NOT NULL,
    "athleteId"     TEXT NOT NULL,
    "notes"         TEXT,
    "tags"          TEXT[],
    "firstSeenAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "potential"     INTEGER,
    "priority"      INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "PlayerTrack_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────
-- CreateTable: Reaction
-- ─────────────────────────────────────────────────────────
CREATE TABLE "Reaction" (
    "id"         TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "type"       "ReactionType" NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────
-- CreateTable: ScoutRating
-- ─────────────────────────────────────────────────────────
CREATE TABLE "ScoutRating" (
    "id"        TEXT NOT NULL,
    "scoutId"   TEXT NOT NULL,
    "raterId"   TEXT NOT NULL,
    "rating"    INTEGER NOT NULL,
    "comment"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutRating_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────
-- CreateTable: ScoutingReport
-- ─────────────────────────────────────────────────────────
CREATE TABLE "ScoutingReport" (
    "id"              TEXT NOT NULL,
    "scoutId"         TEXT NOT NULL,
    "athleteId"       TEXT NOT NULL,
    "analysisId"      TEXT,
    "overallScore"    DOUBLE PRECISION NOT NULL,
    "position"        "Position",
    "potential"       INTEGER,
    "recommendation"  TEXT,
    "strengths"       TEXT[],
    "weaknesses"      TEXT[],
    "summary"         TEXT NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutingReport_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────
-- CreateTable: Meeting
-- ─────────────────────────────────────────────────────────
CREATE TABLE "Meeting" (
    "id"                TEXT NOT NULL,
    "scoutId"           TEXT NOT NULL,
    "athleteId"         TEXT NOT NULL,
    "proposalId"        TEXT,
    "meetingCode"       TEXT NOT NULL,
    "status"            "MeetingStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor"      TIMESTAMP(3) NOT NULL,
    "actualStartAt"     TIMESTAMP(3),
    "actualEndAt"       TIMESTAMP(3),
    "location"          TEXT,
    "notes"             TEXT,
    "scoutConfirmed"    BOOLEAN NOT NULL DEFAULT false,
    "athleteConfirmed"  BOOLEAN NOT NULL DEFAULT false,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────
-- CreateIndex
-- ─────────────────────────────────────────────────────────
CREATE INDEX "PlayerTrack_scoutId_idx" ON "PlayerTrack"("scoutId");
CREATE INDEX "PlayerTrack_athleteId_idx" ON "PlayerTrack"("athleteId");
CREATE UNIQUE INDEX "PlayerTrack_scoutId_athleteId_key" ON "PlayerTrack"("scoutId", "athleteId");

CREATE INDEX "Reaction_analysisId_idx" ON "Reaction"("analysisId");
CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");
CREATE UNIQUE INDEX "Reaction_analysisId_userId_key" ON "Reaction"("analysisId", "userId");

CREATE INDEX "ScoutRating_scoutId_idx" ON "ScoutRating"("scoutId");
CREATE INDEX "ScoutRating_raterId_idx" ON "ScoutRating"("raterId");
CREATE UNIQUE INDEX "ScoutRating_scoutId_raterId_key" ON "ScoutRating"("scoutId", "raterId");

CREATE INDEX "ScoutingReport_scoutId_idx" ON "ScoutingReport"("scoutId");
CREATE INDEX "ScoutingReport_athleteId_createdAt_idx" ON "ScoutingReport"("athleteId", "createdAt" DESC);
CREATE INDEX "ScoutingReport_analysisId_idx" ON "ScoutingReport"("analysisId");

CREATE UNIQUE INDEX "Meeting_meetingCode_key" ON "Meeting"("meetingCode");
CREATE UNIQUE INDEX "Meeting_proposalId_key" ON "Meeting"("proposalId");
CREATE INDEX "Meeting_scoutId_status_idx" ON "Meeting"("scoutId", "status");
CREATE INDEX "Meeting_athleteId_idx" ON "Meeting"("athleteId");

CREATE UNIQUE INDEX "Proposal_scoutId_key" ON "Proposal"("scoutId");

-- ─────────────────────────────────────────────────────────
-- AddForeignKey
-- ─────────────────────────────────────────────────────────
-- ScoutProfile foreign keys (new columns no FK, apenas unique)
-- PlayerTrack
ALTER TABLE "PlayerTrack" ADD CONSTRAINT "PlayerTrack_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "ScoutProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerTrack" ADD CONSTRAINT "PlayerTrack_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Reaction
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AiAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ScoutRating
ALTER TABLE "ScoutRating" ADD CONSTRAINT "ScoutRating_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScoutRating" ADD CONSTRAINT "ScoutRating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ScoutingReport
ALTER TABLE "ScoutingReport" ADD CONSTRAINT "ScoutingReport_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "ScoutProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScoutingReport" ADD CONSTRAINT "ScoutingReport_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScoutingReport" ADD CONSTRAINT "ScoutingReport_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AiAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Meeting
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Proposal scoutId FK
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "ScoutProfile"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
