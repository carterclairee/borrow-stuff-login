--
-- Drop Tables
--

-- SET foreign_key_checks = ;
DROP TABLE if exists Items;
DROP TABLE if exists People;

--
-- Create Tables
--


CREATE TABLE `Items`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `item` VARCHAR(255) NOT NULL,
    `free` BOOLEAN NOT NULL,
    `belongs_to` INT NOT NULL,
    `borrowed_by` INT NOT NULL
);
CREATE TABLE `People`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `floor` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Items` ADD CONSTRAINT `items_belongs_to_foreign` FOREIGN KEY(`belongs_to`) REFERENCES `People`(`id`);
ALTER TABLE
    `Items` ADD CONSTRAINT `items_borrowed_by_foreign` FOREIGN KEY(`borrowed_by`) REFERENCES `People`(`id`);