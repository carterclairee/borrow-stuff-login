--
-- Drop Tables
--

SET foreign_key_checks = 1;
DROP TABLE if exists Items;
DROP TABLE if exists People; 

--
-- Create Tables
--



CREATE TABLE `People`(
    `id` INT NOT NULL AUTO_INCREMENT UNIQUE KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `floor` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE 
);

INSERT INTO People (first_name, last_name, floor, email) VALUES ("Betty", "Boop", 1, "betty.boop@mvp.com");


CREATE TABLE `Items`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `item` VARCHAR(255) NOT NULL,
    `free` BOOLEAN NOT NULL,
    `belongs_to` INT NOT NULL,
    `borrowed_by` INT NULL
);

INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('camera', true, 1, NULL);

-- ALTER TABLE `Items` ADD CONSTRAINT `items_belongs_to_foreign` FOREIGN KEY(`belongs_to`) REFERENCES `People`(`id`);
-- ALTER TABLE `Items` ADD CONSTRAINT `items_borrowed_by_foreign` FOREIGN KEY(`borrowed_by`) REFERENCES `People`(`id`);