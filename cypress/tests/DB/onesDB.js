const path = require('path');
const BaseDB = require('../../main/utils/DB/baseDB');
const Logger = require('../../main/utils/log/logger');
const JSONLoader = require('../../main/utils/data/JSONLoader');

class onesDB extends BaseDB {
    constructor() {
        super(
            '' || process.env.DB_HOST,
            '' || process.env.DB_USERNAME,
            '' || process.env.DB_PASSWORD,
            '' || process.env.DB_ONES_DATABASE,
            '' || process.env.DB_PORT,
        );
    }

    async waitStatusCodeUpdate(policy_numder) {
        Logger.log('[inf] ▶ wait policy status update on ONES');
        const target = 'status';

        while (true) {
            const onesStatus = ( await this.sqlSelect(
                'policies',
                target,
                'WHERE `policy_number` = ?',
                [policy_number],
                Boolean(JSONLoader.configData.noLogger)
            )).pop()[target];

            if(onesStatus === JSONLoader.dictOnes.policy_status.issued) break;
        }
    }
}

module.exports = new onesDB();