/*
  Warnings:

  - The primary key for the `inventories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `survivor_id` on the `inventories` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `survivorId` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_item_id_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_survivor_id_fkey";

-- AlterTable
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_pkey",
DROP COLUMN "id",
DROP COLUMN "item_id",
DROP COLUMN "survivor_id",
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "survivorId" TEXT NOT NULL,
ADD CONSTRAINT "inventories_pkey" PRIMARY KEY ("survivorId", "itemId");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_survivorId_fkey" FOREIGN KEY ("survivorId") REFERENCES "survivors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
