const Logger = require('../log/logger');
const JSONLoader = require('../data/JSONLoader');
const onesDB = require('../tests/DB/onesDB');
const authAPI = require('../tests/API/authAPI');
const onesAPI = require('../tests/API/onesAPI');
const ESBDAPI = require('../tests/API/ESBAPI');
const kaspiDB = require('../tests/DB/kaspiDB');
const kaspiAPI = require('../tests/API/kaspiAPI');
const dictionaryAPI = require('../tests/API/dictionaryAPI');
const allureCommandline = require('allure-commandline');

exports.mochaHooks = {
    async beforeAll() {
        Logger.log('[inf] ▶ start test');
        if (JSONLoader.configData.parallel) {
            const title = this.test.parent.suites[0].tests[0].file.split('/').pop().split('.').reverse().pop();
            Logger.log(`${title}'s test log:`, title);
        }

        await onesDB.createConnection();
        await kaspiDB.createConnection();
        await authAPI.setToken();
        await onesAPI.setToken();
        await ESBDAPI.setToken();
        await kaspiAPI.setToken();
        await dictionaryAPI.setToken();
        await dictionaryAPI.toggleServer();
        await dictionaryAPI.toggleVerification();
    },

    async afterAll() {
        await onesDB.closeConnection();
        await kaspiDB.closeConnection();

        this.test.parent.suites[0].tests.some((test) => test.state === 'failed') 
        ? Logger.log(JSONLoader.confingData.failed)
        : Logger.log(JSONLoader.configData.passed);

        if (JSONLoader.configData.parallel) {
            Logger.logParallel();
            Logger.logToFileParallel();
        }
    },
};