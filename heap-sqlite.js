const csv = require('csv');
const db = require('better-sqlite3')(':memory:');
db.prepare('CREATE TABLE perf (f1 TEXT, f2 TEXT, f3 TEXT, f4 TEXT, f5 TEXT)').run();
const heapBefore = process.memoryUsage();

console.log ('Running test for 1.000.000 records stored in SQLite3');
csv.generate({seed: 1, columns: 5, length: 1000000})
    .pipe(csv.parse())
    .pipe(csv.transform ((record) => {
        db.prepare('INSERT INTO perf VALUES (?, ?, ?, ?, ?)').run(record);
    }))
    .on('finish', () => {
        global.gc();
        console.log ('Heap before', heapBefore);
        console.log ('Heap after', process.memoryUsage());
    })
