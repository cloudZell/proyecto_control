const express = require("express");
const router = express.Router();

const viewController = require("../controllers/viewController");

// Rutas principales
router.get("/", viewController.getHome);
router.get("/student", viewController.getStudent);
router.get("/scan", viewController.getScan);

module.exports = router;


