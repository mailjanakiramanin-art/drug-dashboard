-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Program" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Study" ALTER COLUMN "updatedAt" DROP NOT NULL;
