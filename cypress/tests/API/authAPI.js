const path = require('path');
const Logger = require('../../main/utils/log/logger');
const BaseAPI = require('../../main/utils/API/baseAPI');
const Randomizer = require('../../main/utils/random/randomizer');
const JSONLoader = require('../../main/utils/data/JSONLoader');
require('dotenv').config({ path: path.join(__dirname, '../../../', '.env.test'), override: true});

class AuthAPI extends BaseAPI {
    #API;

    #login;

    #password;

    #options;

    #loginUnder;

    #passwordUnder;

    constructor(options = {
        baseURL: '' || process.env.GATEWAY_URL,
    }) {
        super(options);
        this.#options = options;
        this.#login = '' || process.env.AUTH_LOGIN;
        this.#password = '' || process.env.AUTH_PASSWORD;

        this.#loginUnder = '' || process.env.AUTH_LOGIN_UNDER;
        this.#passwordUnder = '' || process.env.AUTH_UNDER_PASSWORD;
    }

    async auth({ user, APIName }) {
        const params = user
        ? { login: user.login, password: user.password }
        : { login: this.#login, password: this.#password };
        Logger.log(`[inf] -> logged in ${APIName} as ${params.login}`);

        return this.post(JSONLoader.APIEndpoints.auth.login, params);
    }

    async authUnder({ user, APIName }) {
        const params = user
        ? { login: user.login, password: user.password }
        : { login: this.#loginUnder, password: this.#passwordUnder };
        Logger.log(`[inf] ▶ logged in ${APIName} as ${params.login}`);

        return this.post(JSONLoader.APIEndpoints.auth.login, params);
    }

    async setToken() {
        const response = await this.auth({ APIName: 'Auth API' });
        this.#options.logString = '[inf] ▶ set base API URL:';
        this.#options.headers = {};
        this.#options.headers.Authorization = `Bearer ${response.data.data.access_token}`;
        this.#API = new AuthAPI(this.#options);
    }

    async getTestUser() {
        const { isManager } = options;
        const { isAgent } = options;
        const { isPartner } = options;
        const { isOnline } = options;

        let users = ( await this.#API.get(JSONLoader.APIEndpoints.auth.testUsers))
        .data.filter((elem) => elem.product === JSONLoader.APIConfigData.product);

        if(isManager) users = users.filter((elem) => elem.manager);
        if(isAgent)   users = users.filter((elem) => elem.agent);
        if(isPartner) users = users.filter((elem) => elem.partner);
        if(isOnline)  users = users.filter((elem) => elem.online);

        return users[Randomizer.getRandomInteger(users.length - 1)];
    }
}

module.exports = new AuthAPI();