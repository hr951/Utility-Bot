const os = require('os');
const mongoose = require('mongoose');

// ----- CPU -----
function getCPUUsage() {
    const stats1 = getCPUStats();

    return new Promise((resolve) => {
        setTimeout(() => {
            const stats2 = getCPUStats();

            const idleDiff = stats2.idle - stats1.idle;
            const totalDiff = stats2.total - stats1.total;
            const usagePercent = 100 - Math.floor((100 * idleDiff) / totalDiff);

            resolve(usagePercent);
        }, 1000);
    });
};

function getCPUStats() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;

    for (const cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }

    return {
        idle,
        total: user + nice + sys + idle + irq
    };
};
// ----- CPU ----- 

// ----- RAM -----
function getRAMUsage() {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // GB
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);  // GB
    const usedMem = (totalMem - freeMem).toFixed(2);
    const botUsedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // MB

    const ramUsage = {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        botUsed: botUsedMem,
        percentage: ((botUsedMem / (totalMem * 1024)) * 100).toFixed(2)
    };

    return ramUsage;
}
// ----- RAM -----

// ----- DB -----
async function getDBUsage() {
    // データベース全体の統計を取得
    const stats = await mongoose.connection.db.command({ dbStats: 1 });

    const dbUsage = {
        name: stats.db,
        size: (stats.dataSize / 1024 / 1024).toFixed(2),
        used: (stats.storageSize / 1024 / 1024).toFixed(2),
        collections: stats.collections,
        indexes: stats.indexes 
    };

    return dbUsage;
}

module.exports = { getCPUUsage, getRAMUsage, getDBUsage };