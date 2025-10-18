/*
  Warnings:

  - You are about to drop the column `duration` on the `RequestRun` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."RequestRun" DROP COLUMN "duration",
ADD COLUMN     "durationMs" INTEGER;
