
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
use `heroku_341a27901840f2f`;
-- -----------------------------------------------------
-- Table `heroku_341a27901840f2f`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(60) NOT NULL,
  `age` INT NULL,
  `gender` VARCHAR(45) NULL,
  `account_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  `is_tenant` BOOLEAN NOT NULL DEFAULT true,
  `is_landlord` BOOLEAN NOT NULL DEFAULT false,
  `is_admin` BOOLEAN NOT NULL DEFAULT false, 
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Property`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Property`;
CREATE TABLE IF NOT EXISTS `Property` (
  `property_id` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(250) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `owner_id` INT NOT NULL,
  PRIMARY KEY (`property_id`),
  INDEX `fk_Unit_User1_idx` (`owner_id` ASC),
	CONSTRAINT `fk_Property_User1`
		FOREIGN KEY (`owner_id`)
		REFERENCES `User` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Unit`;
CREATE TABLE `Unit` (
  `unit_id` INT NOT NULL AUTO_INCREMENT,
  `property_id` INT NOT NULL,
  `is_occupied` BOOLEAN NOT NULL DEFAULT false,
  `market_price` DECIMAL(10,2) NOT NULL,
  `unit_number` varchar(45) NOT NULL,
  PRIMARY KEY (`unit_id`),
  INDEX `fk_Unit_Property1_idx` (`property_id` ASC),
  UNIQUE INDEX `unit_id_UNIQUE` (`unit_id` ASC),
  CONSTRAINT `fk_Unit_Property1`
    FOREIGN KEY (`property_id`)
    REFERENCES `Property` (`property_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Lease`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Lease`;
CREATE TABLE `Lease` (
  `lease_id` INT NOT NULL AUTO_INCREMENT,
  `unit_id` INT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `price_monthly` DECIMAL(10,2) NOT NULL,
  `leasing_user_id` INT NOT NULL,
  PRIMARY KEY (`lease_id`),
  INDEX `fk_Lease_Unit1_idx` (`unit_id` ASC),
  INDEX `fk_Lease_User1_idx` (`leasing_user_id` ASC),
  CONSTRAINT `fk_Lease_Unit1`
    FOREIGN KEY (`unit_id`)
    REFERENCES `Unit` (`unit_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lease_User1`
    FOREIGN KEY (`leasing_user_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Rating`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Rating`;
CREATE TABLE  `Rating` (
  `rating_id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(400) NULL,
  `score` INT NOT NULL,
  `rater_id` INT NOT NULL,
  `being_rated_id` INT NOT NULL,
  PRIMARY KEY (`rating_id`),
  INDEX `fk_Rating_User1_idx` (`rater_id` ASC),
  INDEX `fk_Rating_User2_idx` (`being_rated_id` ASC),
  CONSTRAINT `fk_Rating_User1`
    FOREIGN KEY (`rater_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rating_User2`
    FOREIGN KEY (`being_rated_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Debt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Transaction`;
CREATE TABLE `Transaction` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `landlord_id` INT NOT NULL,
  `tenant_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  INDEX `fk_Transaction_User1_idx` (`landlord_id` ASC),
  INDEX `fk_Transaction_User2_idx` (`tenant_id` ASC),
  PRIMARY KEY (`transaction_id`),
  CONSTRAINT `fk_Transaction_User1`
    FOREIGN KEY (`landlord_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transaction_User2`
    FOREIGN KEY (`tenant_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
