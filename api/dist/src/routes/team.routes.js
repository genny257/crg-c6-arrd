"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/team.routes.ts
const express_1 = require("express");
const team_controller_1 = require("../controllers/team.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/team/structure', auth_1.protect, team_controller_1.getTeamStructure);
exports.default = router;
