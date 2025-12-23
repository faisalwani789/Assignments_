/*
  Warnings:

  - A unique constraint covering the columns `[teacherClassId,subject_id]` on the table `TeacherClassesSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TeacherClassesSubject_teacherClassId_subject_id_key` ON `TeacherClassesSubject`(`teacherClassId`, `subject_id`);
