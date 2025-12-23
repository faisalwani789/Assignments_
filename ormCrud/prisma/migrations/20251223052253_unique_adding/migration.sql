/*
  Warnings:

  - A unique constraint covering the columns `[teacher_id,class_id]` on the table `TeacherClasses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TeacherClasses_teacher_id_class_id_key` ON `TeacherClasses`(`teacher_id`, `class_id`);
