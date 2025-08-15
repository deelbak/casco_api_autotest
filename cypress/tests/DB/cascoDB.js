const path = require('path');
const BaseDB = require('../../main/utils/DB/baseDB');
const Logger = require('../../main/utils/log/logger');
require('dotenv').config({ path: path.join(__dirname, '../../../', '.env.test'), override: true });

class CascoDB extends BaseDB {
    constructor() {
        super(
            '' || prcocess.env.DB_HOST,
            '' || prcocess.env.DB_USERNAME,
            '' || prcocess.env.DB_PASSWORD,
            '' || prcocess.env.DB_CASCO,
            '' || prcocess.env.DB_PORT
        )
    }
}