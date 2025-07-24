"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.updateReport = exports.getReportById = exports.createReport = exports.getAllReports = void 0;
// src/services/report.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllReports = async () => {
    return await prisma.report.findMany({
        orderBy: { createdAt: 'desc' }
    });
};
exports.getAllReports = getAllReports;
const createReport = async (data) => {
    return await prisma.report.create({ data });
};
exports.createReport = createReport;
const getReportById = async (id) => {
    return await prisma.report.findUnique({ where: { id } });
};
exports.getReportById = getReportById;
const updateReport = async (id, data) => {
    return await prisma.report.update({ where: { id }, data });
};
exports.updateReport = updateReport;
const deleteReport = async (id) => {
    return await prisma.report.delete({ where: { id } });
};
exports.deleteReport = deleteReport;
