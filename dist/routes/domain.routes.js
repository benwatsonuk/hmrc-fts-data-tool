"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_controller_1 = require("../controllers/domain.controller");
const router = (0, express_1.Router)();
router.get("/:domain", domain_controller_1.getDomainInfo);
exports.default = router;
