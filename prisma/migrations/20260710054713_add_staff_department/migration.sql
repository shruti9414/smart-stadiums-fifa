-- AlterTable
ALTER TABLE `user` ADD COLUMN `department` VARCHAR(191) NULL DEFAULT 'general';

-- CreateIndex
CREATE INDEX `User_department_idx` ON `User`(`department`);
