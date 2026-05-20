"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBuiltinSkill = executeBuiltinSkill;
const axios_1 = require("axios");
async function executeBuiltinSkill(type, params) {
    switch (type) {
        case 'time':
            return executeTimeSkill();
        case 'http':
            return executeHttpSkill(params);
        case 'json':
            return executeJsonSkill(params);
        case 'regex':
            return executeRegexSkill(params);
        default:
            throw new Error(`Unknown builtin skill type: ${type}`);
    }
}
function executeTimeSkill() {
    const now = new Date();
    return {
        datetime: now.toISOString(),
        timestamp: now.getTime(),
        date: now.toDateString(),
        time: now.toTimeString(),
    };
}
async function executeHttpSkill(params) {
    const { url, method = 'GET', headers = {}, body } = params;
    if (!url) {
        throw new Error('URL is required for HTTP skill');
    }
    try {
        const response = await (0, axios_1.default)({
            url,
            method,
            headers,
            data: body,
        });
        return {
            status: response.status,
            data: response.data,
            headers: response.headers,
        };
    }
    catch (error) {
        throw new Error(`HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function executeJsonSkill(params) {
    const { action, data } = params;
    if (!action) {
        throw new Error('Action is required for JSON skill');
    }
    switch (action) {
        case 'parse':
            if (typeof data !== 'string') {
                throw new Error('Data must be a string for parse action');
            }
            try {
                return { result: JSON.parse(data) };
            }
            catch (error) {
                throw new Error('Invalid JSON');
            }
        case 'stringify':
            try {
                return { result: JSON.stringify(data) };
            }
            catch (error) {
                throw new Error('Failed to stringify data');
            }
        default:
            throw new Error(`Unknown JSON action: ${action}`);
    }
}
function executeRegexSkill(params) {
    const { text, pattern, flags = '' } = params;
    if (!text || !pattern) {
        throw new Error('Text and pattern are required for regex skill');
    }
    try {
        const regex = new RegExp(pattern, flags);
        const matches = text.match(regex);
        return {
            matches: matches || [],
            groups: matches?.groups || {},
        };
    }
    catch (error) {
        throw new Error(`Invalid regex pattern: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=builtin-skills.js.map