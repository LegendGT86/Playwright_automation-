import { Page, TestInfo } from '@playwright/test';

// Time taken to perform the test
export async function trackPerformanceStep(
    page: Page,
    stepName: string,
    action: () => Promise<void>,
    testInfo: TestInfo,
    performanceData: { totalTime: number }
)   {
    const start = Date.now();
    await action();

    const duration = Date.now() - start;
    const message = `⏱️ Step ${ stepName } completed in ${ duration } ms`;
    console.log (message);
    performanceData.totalTime += duration;

    await testInfo.attach( stepName, {
        body: message,
        contentType: 'text/plain',
    })
}