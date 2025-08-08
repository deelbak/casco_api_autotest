const path = require('path');
const authAPI = require('./authAPI');
const BaseAPI = require('../../main/utils/API/baseAPI');
const JSONLoader = require('../../main/utils/data/JSONLoader');
require('dotenv').config({ path: path.join(__dirname, '../../../', '.env.test'), override: true});

class DictionaryAPI extends BaseAPI {
    #API

    constructor(options = {}) {
        super(
            options.baseURL || process.env.GATEWAY_URL,
            options.logString,
            options.timeout,
            options.headers
        );
    }

    async setToken() {
        const response = await authAPI.authAPI({ APIName: 'Dictionary API'});
        this.#API = new DictionaryAPI({
            headers: {
                Authorization: `Bearer ${response.data.data.access_token}`
            }
        });
    }

    async toggleServer() {
        const params = {
            setting: JSONLoader.configData.servers
        }

        return await this.#API.post(JSONLoader.APIEndpoints.dictionary.servers, params);
    }

    async toggleVerification() {
        const params = {
            value: Number(JSONLoader.configData.verification)
        }

        return await this.#API.post(JSONLoader.APIEndpoints.dicitionary.verifyBool, params);
    }
}

module.exports = new DictionaryAPI();