"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ai.routes.ts
const express_1 = require("express");
const zod_1 = require("zod");
const flow_1 = require("@genkit-ai/flow");
const ai_service_1 = require("../services/ai.service");
const router = (0, express_1.Router)();
const chatSchema = zod_1.z.object({
    messages: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'model']),
        content: zod_1.z.string(),
    })),
});
router.post('/chat', async (req, res) => {
    try {
        const { messages } = chatSchema.parse(req.body);
        const response = await (0, flow_1.runFlow)(ai_service_1.chatbotFlow, [messages]);
        res.status(200).json({ response });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error processing chat request', error });
    }
});
router.post('/mission-assignment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await (0, flow_1.runFlow)(ai_service_1.missionAssignmentFlow, [id]);
        res.status(200).json(recommendations);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suggestion des volontaires.', error: error.message });
    }
});
router.post('/generate-blog-post', async (req, res) => {
    try {
        const { topic } = req.body;
        const blogPost = await (0, flow_1.runFlow)(ai_service_1.generateBlogPostFlow, [topic]);
        res.status(200).json(blogPost);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: 'Error generating blog post', error });
    }
});
exports.default = router;
