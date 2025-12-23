/*
  Warnings:

  - You are about to drop the column `class_id` on the `teacherclassessubject` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `teacherclassessubject` table. All the data in the column will be lost.
  - Added the required column `teacherClassId` to the `TeacherClassesSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherclassessubject` DROP FOREIGN KEY `fk_tcs_class`;

-- DropForeignKey
ALTER TABLE `teacherclassessubject` DROP FOREIGN KEY `fk_tcs_teacher`;

-- DropForeignKey
ALTER TABLE `teachersubject` DROP FOREIGN KEY `TeacherSubject_teacher_id_fkey`;

-- DropIndex
DROP INDEX `fk_tcs_class` ON `teacherclassessubject`;

-- DropIndex
DROP INDEX `fk_tcs_teacher` ON `teacherclassessubject`;

-- DropIndex
DROP INDEX `TeacherSubject_teacher_id_fkey` ON `teachersubject`;

-- AlterTable
ALTER TABLE `teacherclassessubject` DROP COLUMN `class_id`,
    DROP COLUMN `teacherId`,
    ADD COLUMN `teacherClassId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `fk_tcs_teacher_class` FOREIGN KEY (`teacherClassId`) REFERENCES `TeacherClasses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
