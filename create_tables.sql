
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
use `heroku_341a27901840f2f`;
-- -----------------------------------------------------
-- Table `heroku_341a27901840f2f`.`Person`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `username` VARCHAR(45) NULL UNIQUE,
  `password` VARCHAR(60) NULL,
  `age` INT NULL,
  `gender` VARCHAR(45) NULL,
  `account_balance` DECIMAL(10,2) NULL,
  `is_tenant` BOOLEAN NULL,
  `is_landlord` BOOLEAN NULL,
  `is_admin` BOOLEAN DEFAULT 0, 
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Property`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Property`;
CREATE TABLE IF NOT EXISTS `Property` (
  `property_id` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(250) NULL,
  `city` VARCHAR(45) NULL,
  `owner_id` INT NOT NULL,
  PRIMARY KEY (`property_id`),
  INDEX `fk_Unit_Person1_idx` (`owner_id` ASC),
	CONSTRAINT `fk_Property_Person1`
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
  `occupied` TINYINT NULL,
  `market_price` DECIMAL(10,2) NULL,
  `unit_number` INT NULL,
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
  `unit_id` INT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `price_monthly` DECIMAL(10,2) NULL,
  `end_date` DATETIME NULL,
  `leasing_user_id` INT NULL,
  INDEX `fk_Lease_Unit1_idx` (`unit_id` ASC),
  PRIMARY KEY (`unit_id`, `start_date`),
  INDEX `fk_Lease_Person1_idx` (`leasing_user_id` ASC),
  CONSTRAINT `fk_Lease_Unit1`
    FOREIGN KEY (`unit_id`)
    REFERENCES `Unit` (`unit_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lease_Person1`
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
  `score` INT NULL,
  `rater_id` INT NOT NULL,
  `being_rated_id` INT NOT NULL,
  `being_rated_as` VARCHAR(45) NULL,
  PRIMARY KEY (`rating_id`),
  INDEX `fk_Rating_Person1_idx` (`rater_id` ASC),
  INDEX `fk_Rating_Person2_idx` (`being_rated_id` ASC),
  CONSTRAINT `fk_Rating_Person1`
    FOREIGN KEY (`rater_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rating_Person2`
    FOREIGN KEY (`being_rated_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Debt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Debt`;
CREATE TABLE `Debt` (
  `creditor_id` INT NOT NULL,
  `debtor_id` INT NOT NULL,
  `amount_owed` DECIMAL(10,2) NULL,
  INDEX `fk_Debt_Person1_idx` (`creditor_id` ASC),
  INDEX `fk_Debt_Person2_idx` (`debtor_id` ASC),
  PRIMARY KEY (`creditor_id`, `debtor_id`),
  CONSTRAINT `fk_Debt_Person1`
    FOREIGN KEY (`creditor_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Debt_Person2`
    FOREIGN KEY (`debtor_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
