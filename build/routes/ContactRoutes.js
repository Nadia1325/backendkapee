"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ContactController_1 = require("../controllers/ContactController");
var contactRouter = (0, express_1.Router)();
// Route to create a new contact message
contactRouter.post("/create-contact", ContactController_1.createContact);
// You can add more routes later, e.g., get all messages, delete, etc.
exports.default = contactRouter;
