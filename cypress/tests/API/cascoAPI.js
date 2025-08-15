const path = require('path');
const authAPI = require('./authAPI');
const BaseAPI = require('../../main/utils/API/baseAPI');
const JSONLoader = require('../../main/utils/data/JSONLoader');
const Randomizer = require('../../main/utils/random/randomizer');
require('dotenv').config({ path: path.join(__dirname, '../../../', '.env.test'), override: true });

class CascoAPI extends BaseAPI {
  #API;

  #user;

  #options;

  constructor(options = {
    baseURL: '' || process.env.GATEWAY_URL,
  }) {
    super(options);
    this.#options = options;
  }

  get user() {
    return this.#user;
  }

  async setToken(options = { role: 'agent' }) {
    const { role } = options;
    this.#user = await authAPI.getTestUser();

    const response = role === 'underwriter'
    ? await authAPI.authUnder({ user: this.#user, APIName: 'Casco API' })
    : await authAPI.auth({ user: this.#user, APIName: 'Casco API' });

    this.#options.headers = {};
    this.#options.headers.Authorization = `Bearer ${response.data.data.access_token}`;
    this.#API = new CascoAPI(this.#options);
  }

  async createDraftOfPolicy() {
    return this.#API.post(JSONLoader.APIEndpoints.casco.createDraftOfPolicy);
  }

  async setTFInPolicy() {
    const requestBody = Randomizer.createRandomRequestStructures(
        JSONLoader.testCars,
        JSONLoader.templateSetTFInPolicy,
    );

    const response = await this.#API.post(
        JSONLoader.APIEndpoints.casco.setTFInPolicy,
        requestBody,
    );

    return { response, requestBody };
  }

}
  