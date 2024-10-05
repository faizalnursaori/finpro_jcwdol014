-- DropForeignKey
ALTER TABLE `productstock` DROP FOREIGN KEY `ProductStock_productId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
