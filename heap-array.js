var csv = require('csv');
var dataArray = [];
var heapBefore = process.memoryUsage();

console.log('Running test for 1.000.000 records stored in NodeJS Array');
csv.generate({ seed: 1, columns: 5, length: 1000000 })
    .pipe(csv.parse())
    .pipe(csv.transform((record) => {
        dataArray.push(record);
    }))
    .on('finish', () => {
        global.gc();
        console.log('Heap before', heapBefore);
        console.log('Heap after', process.memoryUsage());
    })
