-- DropForeignKey
ALTER TABLE `stocktransferlog` DROP FOREIGN KEY `StockTransferLog_productStockId_fkey`;

-- DropForeignKey
ALTER TABLE `stocktransferlog` DROP FOREIGN KEY `StockTransferLog_warehouseId_fkey`;

-- AddForeignKey
ALTER TABLE `StockTransferLog` ADD CONSTRAINT `StockTransferLog_productStockId_fkey` FOREIGN KEY (`productStockId`) REFERENCES `ProductStock`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferLog` ADD CONSTRAINT `StockTransferLog_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
