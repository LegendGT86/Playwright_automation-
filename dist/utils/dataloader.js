"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJSON = loadJSON;
exports.loadCSV = loadCSV;
exports.loadTestData = loadTestData;
const fs = __importStar(require("fs"));
const sync_1 = require("csv-parse/sync");
const path_1 = __importDefault(require("path"));
function resolvePath(filePath) {
    if (path_1.default.isAbsolute(filePath))
        return filePath;
    const projectRoot = path_1.default.resolve(__dirname, '../');
    return path_1.default.join(projectRoot, filePath);
}
//Added error handling for file operations and debugging
function safeReadFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch (err) {
        throw new Error(`Error reading file ${filePath}: ${err}`);
    }
}
//Load JSON file and parse with error handling
function loadJSON(filePath) {
    const content = safeReadFile(filePath);
    try {
        return JSON.parse(content);
    }
    catch (err) {
        throw new Error(`Error parsing JSON from file ${filePath}: ${err}`);
    }
}
//Load CSV file and parse with error handling
function loadCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try {
        return (0, sync_1.parse)(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    }
    catch (err) {
        throw new Error(`Error parsing CSV from file ${filePath}: ${err}`);
    }
}
//This function decides which format to load based on env variable or config file
function loadTestData(filePath) {
    let config = {};
    if (fs.existsSync("config/testConfig.json")) {
        try {
            config = loadJSON("config/testConfig.json");
        }
        catch (err) {
            throw new Error(`Warning: Could not load config file: ${err}`);
        }
    }
    const dataFile = process.env.DATA_FILE || filePath || config.dataFile;
    if (!dataFile) {
        throw new Error("Data file path must be specified via parameter, env, or config");
    }
    let dataFormat = process.env.DATA_FORMAT || config.dataFormat;
    if (!dataFormat) {
        if (dataFile.endsWith('.csv')) {
            dataFormat = 'csv';
        }
        else if (dataFile.endsWith('.json')) {
            dataFormat = 'json';
        }
        else {
            throw new Error(`Could not identify data format from file: ${dataFile}`);
        }
    }
    if (dataFormat === 'json') {
        return loadJSON(dataFile);
    }
    else if (dataFormat === 'csv') {
        return loadCSV(dataFile);
    }
    else {
        throw new Error(`Unsupported data format: ${dataFormat}`);
    }
}
