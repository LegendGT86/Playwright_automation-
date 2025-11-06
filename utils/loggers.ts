//Will only be used over test.step if custom formats required

export function logInfo(message: string) {
    console.log(`NOTICE!: ${message}`);
}

export function logStep(step:string) {
    console.log( `STEP: ${step}`);
}

export function logError(message:string) {
    console.log(` ERROR: ${message}`);
}