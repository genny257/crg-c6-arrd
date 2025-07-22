"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const zod_1 = require("zod");
// Define the schema for a chat message
exports.MessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'model']),
    content: zod_1.z.string(),
});
