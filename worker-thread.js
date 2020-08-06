//worker.js
const tf = require('@tensorflow/tfjs-node');
const { parentPort, workerData } = require('worker_threads');

if (workerData.type === 'training') {
    const xs = tf.tensor2d(workerData.trainingData, [workerData.trainingData.length, 2]);
    const ys = tf.tensor1d(workerData.testData);

    const epochs = 10;
    const batchSize = 1;

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 3, inputShape: 2 }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    model.fit(xs, ys, {
        epochs,
        batchSize,
        verbose: 0,
        callbacks: {
            onEpochEnd: async (epochNumber, loss) => {
                parentPort.postMessage({ type: 'epochUpdate', epochNumber: epochNumber, loss: loss.loss });
            },
        }
    }).finally(() => {
        parentPort.postMessage({ type: 'trainingCompleted' });
    });

}

