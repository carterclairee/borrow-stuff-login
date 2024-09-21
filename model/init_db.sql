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
    `email` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255) NOT NULL 
);

-- Can't insert right away because password will be blank and is constrained to not null
-- INSERT INTO People (first_name, last_name, floor, email) VALUES ("Betty", "Boop", 1, "betty.boop@mvp.com"), ("Diana", "Prince", 3, "diana.prince@mvp.com"), ("Kara", "Zor-El", 2, "kara.zor-el@mvp.com"), ("Jean", "Grey",7, "jean.grey@mvp.com"), ("Barbara", "Gordon", 8, "barbara.gordon@mvp.com"), ("Pamela", "Isley", 4, "pamela.isley@mvp.com");


CREATE TABLE `Items`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `item` VARCHAR(255) NOT NULL,
    `free` BOOLEAN NOT NULL,
    `belongs_to` INT NOT NULL,
    `borrowed_by` INT NULL
);

-- Can't insert right away because password will be blank and is constrained to not null
-- INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('camera', true, 1, NULL), ('camera', true, 1, NULL), ('laptop', true, 2, NULL), ('microphone', true, 3, NULL), ('tripod', true, 4, NULL), ('tablet', true, 5, NULL), ('headphones', true, 1, NULL), ('projector', true, 2, NULL), ('smartphone', false, 3, 1), ('speaker', false, 4, 2),('monitor', true, 5, NULL), ('keyboard', true, 1, NULL);

-- ALTER TABLE `Items` ADD CONSTRAINT `items_belongs_to_foreign` FOREIGN KEY(`belongs_to`) REFERENCES `People`(`id`);
-- ALTER TABLE `Items` ADD CONSTRAINT `items_borrowed_by_foreign` FOREIGN KEY(`borrowed_by`) REFERENCES `People`(`id`);