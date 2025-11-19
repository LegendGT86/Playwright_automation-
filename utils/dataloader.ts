import * as fs from "fs";
import { parse } from 'csv-parse/sync';
import path from "path";


function resolvePath(filePath: string): string {
    if (path.isAbsolute(filePath)) 
        return filePath 
    const projectRoot = path.resolve(__dirname, '../');  
    return path.join(projectRoot, filePath);
}
//Added error handling for file operations and debugging
function safeReadFile(filePath: string): string {
    if(!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`); 
    }

    try{
        return fs.readFileSync(filePath, 'utf-8');        
    }
    catch(err){
        throw new Error(`Error reading file ${filePath}: ${err}`);
    }
}

//Load JSON file and parse with error handling
export function loadJSON<T = any>(filePath:string): T{
    const content = safeReadFile(filePath);
    try{
        return JSON.parse(content);
    }
    catch(err){
            throw new Error(`Error parsing JSON from file ${filePath}: ${err}`);
        }
    }

//Load CSV file and parse with error handling
export function loadCSV<T = any>(filePath:string): T[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try{
        return parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    }catch(err){
        throw new Error(`Error parsing CSV from file ${filePath}: ${err}`);
    }
}
//This function decides which format to load based on env variable or config file
export function loadTestData<T = any>(filePath: string): T[] {
    let config: { dataFormat?: string, dataFile?: string } = {};

    if (fs.existsSync("config/testConfig.json")) {
        try {
            config = loadJSON<{ dataFormat?: string, dataFile?: string }>("config/testConfig.json");
        } catch (err) {
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
        } else if (dataFile.endsWith('.json')) {
            dataFormat = 'json';
        } else {
            throw new Error(`Could not identify data format from file: ${dataFile}`);
        }
    }

    if (dataFormat === 'json') {
        return loadJSON<T[]>(dataFile);
    } else if (dataFormat === 'csv') {
        return loadCSV<T>(dataFile);
    } else {
        throw new Error(`Unsupported data format: ${dataFormat}`);
    }
}
