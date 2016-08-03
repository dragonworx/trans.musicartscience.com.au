DROP TABLE `my_db`.`transactions`;

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bsb` varchar(45) DEFAULT NULL,
  `acc` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `desc` varchar(512) DEFAULT NULL,
  `cheque` decimal(15,2) DEFAULT NULL,
  `debit` decimal(15,2) DEFAULT NULL,
  `credit` decimal(15,2) DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `account` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=latin1;

SELECT * FROM my_db.transactions;