/*
  Warnings:

  - Added the required column `teacher_id` to the `TeacherClasses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `TeacherClassesSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teacherclasses` DROP FOREIGN KEY `TeacherClasses_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherclassessubject` DROP FOREIGN KEY `TeacherClassesSubject_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherclassessubject` DROP FOREIGN KEY `TeacherClassesSubject_subject_id_fkey`;

-- DropIndex
DROP INDEX `TeacherClasses_class_id_key` ON `teacherclasses`;

-- DropIndex
DROP INDEX `TeacherClassesSubject_class_id_key` ON `teacherclassessubject`;

-- DropIndex
DROP INDEX `TeacherClassesSubject_subject_id_key` ON `teacherclassessubject`;

-- AlterTable
ALTER TABLE `teacherclasses` ADD COLUMN `teacher_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacherclassessubject` ADD COLUMN `teacher_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TeacherClasses` ADD CONSTRAINT `TeacherClasses_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
