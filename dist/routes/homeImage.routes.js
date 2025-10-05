"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeImage_controller_1 = require("../controllers/homeImage.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/active', homeImage_controller_1.getActiveHomeImages);
// Admin routes
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, homeImage_controller_1.getHomeImages);
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, homeImage_controller_1.upload.single('image'), homeImage_controller_1.uploadHomeImage);
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, homeImage_controller_1.upload.single('image'), homeImage_controller_1.updateHomeImage);
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, homeImage_controller_1.deleteHomeImage);
exports.default = router;
