-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('PHONE_CALL', 'EMAIL', 'IN_PERSON', 'WEBSITE_CHECK', 'POS_SYNC', 'SELF_REPORTED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED_TODAY', 'VERIFIED_THIS_WEEK', 'VERIFIED_THIS_MONTH', 'UNVERIFIED', 'NEEDS_UPDATE');

-- AlterTable
ALTER TABLE "Dispensary" ADD COLUMN     "claimedDate" TIMESTAMP(3),
ADD COLUMN     "claimingContactEmail" TEXT,
ADD COLUMN     "claimingContactPhone" TEXT,
ADD COLUMN     "inaccuracyReportsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReportedInaccuracy" TIMESTAMP(3),
ADD COLUMN     "menuAccuracyScore" INTEGER,
ADD COLUMN     "verificationDate" TIMESTAMP(3),
ADD COLUMN     "verificationMethod" "VerificationMethod",
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "verifiedBy" TEXT;

-- CreateIndex
CREATE INDEX "Dispensary_verificationStatus_idx" ON "Dispensary"("verificationStatus");

-- CreateIndex
CREATE INDEX "Dispensary_verificationDate_idx" ON "Dispensary"("verificationDate");
