/*
  Warnings:

  - Added the required column `community` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "community" TEXT NOT NULL;
