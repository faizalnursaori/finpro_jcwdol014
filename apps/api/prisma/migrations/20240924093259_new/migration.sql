/*
  Warnings:

  - You are about to drop the column `destinationWarehouseId` on the `stocktransfer` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWarehouseId` on the `stocktransfer` table. All the data in the column will be lost.
  - The values [REJECTED] on the enum `stocktransfer_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `productstock` DROP FOREIGN KEY `ProductStock_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `stocktransfer` DROP FOREIGN KEY `StockTransfer_destinationWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `stocktransfer` DROP FOREIGN KEY `StockTransfer_sourceWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouse` DROP FOREIGN KEY `Warehouse_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouse` DROP FOREIGN KEY `Warehouse_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouse` DROP FOREIGN KEY `Warehouse_userId_fkey`;

-- AlterTable
ALTER TABLE `stocktransfer` DROP COLUMN `destinationWarehouseId`,
    DROP COLUMN `sourceWarehouseId`,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL;

-- AddForeignKey
ALTER TABLE `productstock` ADD CONSTRAINT `ProductStock_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `Warehouse_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `Warehouse_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `province`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `Warehouse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
