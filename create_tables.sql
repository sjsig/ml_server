
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
		ON DELETE CASCADE
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
    ON DELETE CASCADE
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
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Lease_User1`
    FOREIGN KEY (`leasing_user_id`)
    REFERENCES `User` (`id`)
    ON DELETE CASCADE
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
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rating_User2`
    FOREIGN KEY (`being_rated_id`)
    REFERENCES `User` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Transaction`;
CREATE TABLE `Transaction` (
  'transaction_id' INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `delta` DECIMAL(10,2) NOT NULL,
  `date` DATETIME NOT NULL DEFAULT NOW(),
  `description` VARCHAR(400) NULL, 
  INDEX `fk_Transaction_User_idx` (`user_id` ASC),
  PRIMARY KEY (`transaction_id`),
  CONSTRAINT `fk_Transaction_User`
    FOREIGN KEY (`user_id`)
    REFERENCES `User` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

DROP EVENT IF EXISTS PerformTransaction;   
DROP EVENT IF EXISTS CheckExpired;
DROP TRIGGER IF EXISTS SetOccupied;
DROP PROCEDURE IF EXISTS insertTransactions;



-- ---------------
-- no renting from apartment you own
-- End date after start date
-- No two leases on one active unit. 
-- ---------------


DELIMITER $$
CREATE TRIGGER SetOccupied
	AFTER INSERT ON Lease
    FOR EACH ROW
    BEGIN
      IF (count(SELECT * FROM Unit u WHERE u.unit_id == new.unit_id AND u.occupied == 1) == 0
        AND new.start_date < new.end_date
        AND new.leasing_user_id <> (
          SELECT owner_id FROM Property p 
          WHERE p.property_id == (
            SELECT property_id FROM unit u 
            WHERE u.unit_id == new.unit_id)
        )
      )
      THEN
        UPDATE Unit SET 
          occupied = 1 
          WHERE unit_id == new.unit_id;
      END IF;
    END$$
DELIMITER ;






-- ---------------
-- Check_expired
-- Once a day, on whatever second we build the schema, runs over all leases and checks if any one expired the previous day. 
-- If so, set occupied = 0
-- ---------------

CREATE EVENT checkExpired
    ON SCHEDULE EVERY 1 DAY
    STARTS CURRENT_TIMESTAMP
    ENDS CURRENT_TIMESTAMP + INTERVAL 1 MONTH
    DO
      UPDATE unit SET occupied = 0
      WHERE unit_id IN (
        SELECT unit_id FROM Lease l 
          WHERE Datediff(l.end_date, CURRENT_TIMESTAMP()) >= 0 
          AND Datediff(l.end_date, CURRENT_TIMESTAMP()) < 1
        )
      ); 






-- ---------------
-- Perform_transaction
-- Once a month
-- add new transaction to Transaction for each payment and collection
-- ---------------

CREATE EVENT PerformTransaction
    ON SCHEDULE EVERY 1 MONTH
    STARTS CURRENT_TIMESTAMP
    ENDS CURRENT_TIMESTAMP + INTERVAL 1 MONTH -- be kind to sunapee
    DO
      START TRANSACTION;
        CALL insertTransactions();
      COMMIT;


-- ----------------
-- insertTransactions
-- Accompanying stored procedure for performTransaction() scheduled event 
-- ----------------
DELIMITER $$
CREATE PROCEDURE insertTransactions
    BEGIN
      DECLARE numRows INT DEFAULT 0;
      DECLARE currRow INT DEFAULT 0;
      SELECT count(*) from leases INTO numRows;
      SET currRow = 0;

      WHILE currRow < numRows DO
        INSERT INTO Transaction VALUES (
          -- ------------------------------
          (
            SELECT leasing_user_id
            FROM leases l
            WHERE (GETDATE() > l.start_date AND GETDATE() < l.end_date)
            LIMIT currRow, 1
          ), 
          -- ------------------------------
          (
            SELECT price_monthly
            FROM leases l
            WHERE (GETDATE() > l.start_date AND GETDATE() < l.end_date)
            LIMIT currRow, 1
          ), 
          -- ------------------------------
          CURRENT_TIMESTAMP, 
          -- ------------------------------
          "Paid monthly lease"
          -- ------------------------------
        );
        -- end INSERT

        -- Also add a transaction for each payment to a landlord
        INSERT INTO transactions VALUES (
          -- ------------------------------
          (
            SELECT owner_id FROM property p 
            WHERE p.property_id == (
              SELECT property_id FROM unit u 
              WHERE u.unit_id == (
                SELECT unit_id FROM leases l 
                LIMIT currRow, 1 -- only looks at row number (currRow)
              )
            )
          ), 
          -- ------------------------------
          (
            SELECT price_monthly
            FROM leases l
            WHERE (GETDATE() > l.start_date AND GETDATE() < l.end_date)
            LIMIT currRow, 1 -- only looks at row number (currRow)
          ), 
          -- ------------------------------
          CURRENT_TIMESTAMP, 
          -- ------------------------------
          "Collected monthly lease"
          -- ------------------------------
        ); -- end INSERT

        SET currRow = currRow + 1;

      END WHILE;  
    END$$
DELIMITER ;