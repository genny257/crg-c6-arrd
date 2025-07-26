"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/genkit.routes.ts
const express_1 = require("express");
const ai_service_1 = require("../services/ai.service");
const flow_1 = require("@genkit-ai/flow");
const router = (0, express_1.Router)();
router.post('/chatbot', async (req, res) => {
    try {
        const { messages } = req.body;
        const response = await (0, flow_1.runFlow)(ai_service_1.chatbotFlow, messages);
        res.status(200).json({ response });
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing chat request', error });
    }
});
router.post('/mission-assignment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await (0, flow_1.runFlow)(ai_service_1.missionAssignmentFlow, id);
        res.status(200).json(recommendations);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suggestion des volontaires.', error: error.message });
    }
});
router.post('/generate-blog-post', async (req, res) => {
    try {
        const { topic } = req.body;
        const blogPost = await (0, flow_1.runFlow)(ai_service_1.generateBlogPostFlow, topic);
        res.status(200).json(blogPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating blog post', error });
    }
});
exports.default = router;
