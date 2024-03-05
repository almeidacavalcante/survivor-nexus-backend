/*
  Warnings:

  - Added the required column `removes_infection` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "removes_infection" BOOLEAN NOT NULL;
