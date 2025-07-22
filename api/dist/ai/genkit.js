"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const googleai_1 = require("@genkit-ai/googleai");
const genkit_1 = require("genkit");
exports.ai = (0, genkit_1.genkit)({
    plugins: [
        (0, googleai_1.googleAI)({
            apiVersion: 'v1beta',
        }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
});
