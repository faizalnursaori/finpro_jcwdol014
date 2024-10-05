-- DropForeignKey
ALTER TABLE `productstock` DROP FOREIGN KEY `ProductStock_warehouseId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
