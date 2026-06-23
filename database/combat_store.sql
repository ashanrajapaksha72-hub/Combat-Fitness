-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 23, 2026 at 02:17 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `combat_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL,
  `in_stock` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `brand`, `price`, `in_stock`) VALUES
(1, 'Compression Fit T-Shirts', 'Combat Fitness', 5500, 1),
(2, 'ISOLATE Pre-Workout', 'WHEY', 7000, 1),
(3, 'WHEY Protein', 'WHEY', 30000, 1),
(4, 'ISOLATED Creatine', 'Dymatize', 7000, 1),
(5, 'Compression Shorts', 'Combat Fitness', 4000, 1),
(6, 'Compression Long Sleeve Shirt', 'Combat Fitness', 6000, 1),
(7, 'Workout Gloves', 'Combat Fitness', 2000, 1),
(8, 'Lifting Belts', 'Yellow', 5000, 1),
(9, 'Dumbell (15KG)', NULL, 8500, 1),
(10, 'Barbell Weight Plates', NULL, 6000, 1),
(22, 'Pre Workout', 'Pro Series', 10000, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_flavors`
--

DROP TABLE IF EXISTS `product_flavors`;
CREATE TABLE IF NOT EXISTS `product_flavors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `flavor` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_flavors`
--

INSERT INTO `product_flavors` (`id`, `product_id`, `flavor`) VALUES
(1, 2, 'Fruit Punch'),
(2, 2, 'Blue Raspberry'),
(3, 3, 'Chocolate'),
(4, 3, 'Vanilla'),
(5, 3, 'Strawberry'),
(6, 4, 'Chocolate'),
(7, 4, 'Vanilla'),
(8, 4, 'Strawberry'),
(33, 22, 'Fruit Punch'),
(32, 22, 'Strawberry'),
(31, 22, 'Vanilla');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`, `sort_order`) VALUES
(1, 1, '../Images/product1.png', 0),
(2, 1, '../Images/product1.png', 1),
(3, 1, '../Images/product1.png', 2),
(4, 2, '../Images/product2.png', 0),
(5, 2, '../Images/product2.png', 1),
(6, 2, '../Images/product2.png', 2),
(7, 3, '../Images/product3.png', 0),
(8, 3, '../Images/Vanilla.png', 1),
(9, 3, '../Images/Strawberry.png', 2),
(10, 4, '../Images/product4.png', 0),
(11, 4, '../Images/product4.png', 1),
(12, 4, '../Images/product4.png', 2),
(13, 5, '../Images/COmpressionShort.png', 0),
(14, 5, '../Images/COmpressionShort.png', 1),
(15, 5, '../Images/COmpressionShort.png', 2),
(16, 6, '../Images/CompressionLongSleeves.png', 0),
(17, 6, '../Images/CompressionLongSleeves.png', 1),
(18, 6, '../Images/CompressionLongSleeves.png', 2),
(19, 7, '../Images/WorkoutGloves.png', 0),
(20, 7, '../Images/WorkoutGloves.png', 1),
(21, 7, '../Images/WorkoutGloves.png', 2),
(22, 8, '../Images/LiftingBelts.png', 0),
(23, 8, '../Images/LiftingBelts.png', 1),
(24, 8, '../Images/LiftingBelts.png', 2),
(25, 9, '../Images/Dumbell.png', 0),
(26, 9, '../Images/Dumbell.png', 1),
(27, 9, '../Images/Dumbell.png', 2),
(28, 10, '../Images/Barbell.png', 0),
(29, 10, '../Images/Barbell.png', 1),
(30, 10, '../Images/Barbell.png', 2),
(55, 22, '../images/preworkout2.png', 2),
(54, 22, '../images/preworkout3.png', 1),
(53, 22, '../images/preworkout.png', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
