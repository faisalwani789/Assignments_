/*
  Warnings:

  - You are about to drop the column `isAcive` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isAcive`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
