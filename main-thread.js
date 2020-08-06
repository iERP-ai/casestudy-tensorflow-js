// index.js
const { Worker } = require('worker_threads')

function runService(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker-thread.js', { workerData });

        worker.on('message', (data) => {
            switch (data.type) {
                case 'epochUpdate':
                    console.log('Epoch:', data.epochNumber, 'Loss:', data.loss);
                    break;
                case 'trainingCompleted':
                    resolve();
                    break;
                default:
                // code block
            }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${ code }`));
        })
    })
}

function generateTrainingData() {
    //Here you will prepare your training data
    return [[1, 2], [2, 3], [3, 4], [5, 6], [7, 8]];
}

function generateTestData() {
    //Here you will prepare your testing data
    return [3, 5, 7, 11, 15];
}

async function run() {
    const trainingData = generateTrainingData();
    const testData = generateTestData();
    const result = await runService({
        type: 'training',
        trainingData: trainingData,
        testData: testData,
    });
}

run().catch((err) => console.error(err))
