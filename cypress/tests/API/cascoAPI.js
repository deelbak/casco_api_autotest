const path = require('path');
const authAPI = require('./authAPI');
const BaseAPI = require('../../main/utils/API/baseAPI');
const JSONLoader = require('../../main/utils/data/JSONLoader');
const Randomizer = require('../../main/utils/random/randomizer');
const { parseTwoDigitYear } = require('moment');
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
    return await this.#API.post(JSONLoader.APIEndpoints.casco.createDraftOfPolicy);
  }

  async getVehicle () {
    const params = {
        vin: JSONLoader.testCars.vin,
    };

    return await this.#API(APIEndpoints.getVehicle, params);
  }

  async getAveragePriceFromKolesaKZ() {
    const params = {
        mark: JSONLoader.testCars[0].mark,
        model: JSONLoader.testCars[0].model,
        year: JSONLoader.testCars.year,
    };

    return await this.#API.get(
        JSONLoader.APIEndpoints.getAveragePrice, params
    );
  }

  async getTariffToSpecifiedVehicle() {
    const currentYear = moment().year();
    const calculatedVehicleAge = currentYear - JSONLoader.testCars[0].year;

    const params = {
        vehicle_type_id: JSONLoader.testCars[0].type_id,
        vehicle_age: calculatedVehicleAge,
        insurance_sum: this.getAveragePriceFromKolesaKZ(),
        page: Randomizer.getRandomInteger(2, 1),
        per_page: Randomizer.getRandomInteger(20, 10),
    };

    const response = await this.#API.get(
        JSONLoader.APIEndpoints.getTariffs, params
    );
    const firstTariff = response.data?.data?.[0];


    return firstTariff.id;
  }

    async setVehicleInPolicy() {
    const requestBody = Randomizer.createRandomRequestStructures(
        JSONLoader.testCars,
        JSONLoader.templateSetTFInPolicy,
    );

    const response = await this.#API.post(
        JSONLoader.APIEndpoints.casco.setVehicleInPolicy,
        requestBody,
    );

    return { response, requestBody };
  }

}
  