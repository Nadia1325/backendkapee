"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var subscribeController_1 = require("../controllers/subscribeController");
var validateEmail_1 = require("../middleware/validateEmail");
var router = express_1.default.Router();
router.post("/", validateEmail_1.validateEmail, subscribeController_1.subscribe);
router.get("/", subscribeController_1.getSubscribers);
router.delete("/:id", subscribeController_1.deleteSubscriber);
exports.default = router;
