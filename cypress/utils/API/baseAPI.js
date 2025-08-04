const axios = require('axios');
const Logger = require('../log/logger');

class BaseAPI {
    #baseURL;
    #logString;
    #timeout;
    #headers;
    #logBaseURL;
    #axiosInstance;

    constructor(baseURL, logString, timeout, headers) {
        this.#baseURL = baseURL;
        this.#logString = logString;
        this.#timeout = timeout;
        this.#headers = headers;
        this.#axiosInstance = this.createInstance();        
    }
    
    createInstance() {
    if (this.#logString) Logger.log(`${this.#logString} ${this.#baseURL}`);
        return axios.create({
            baseURL: this.#baseURL,
            headers: this.#headers,
            timeout: this.#timeout,
        });
    }

    async get(endpoint, params) {
        Logger.log(`[req] ▶ get ${JSON.stringify(params || {})} from ${endpoint}:`);
        try {
            const response = await this.#axiosInstance.get(`/${endpoint}`, { params });
            Logger.log(`[res] ◀ ${this.#logBaseURL}${endpoint} - ${response.status} ${response.statusText}`);
            return response.data;
        } catch (error) {
            Logger.error(`[res] ◀ ${this.#logBaseURL}${endpoint} - Error: ${error.message}`);
            Logger.log(`[res]   status: ${error.response ? error.response.status : 'unknown'}`);
            Logger.log(`[res]   data: ${error.response ? JSON.stringify(error.response.data) : 'unknown'}`);
            throw error;
        }
    }

    async post(endpoint, data) {
        Logger.log(`[req] ▶ post ${JSON.stringify(data || {})} to ${endpoint}:`);
        try {
            const response = await this.#axiosInstance.post(`/${endpoint}`, data);
            Logger.log(`[res] ◀ ${this.#logBaseURL}${endpoint} - ${response.status} ${response.statusText}`);
            return response.data;
        } catch (error) {
            Logger.error(`[res] ◀ ${this.#logBaseURL}${endpoint} - Error: ${error.message}`);
            Logger.log(`[res]   status: ${error.response ? error.response.status : 'unknown'}`);
            Logger.log(`[res]   data: ${error.response ? JSON.stringify(error.response.data) : 'unknown'}`);
            throw error;
        }
    }

    async put(endpoint, data) {
        Logger.log(`[req] ▶ put ${JSON.stringify(data || {})} to ${endpoint}:`);
        try {
            const response = await this.#axiosInstance.put(`/${endpoint}`, data);
            Logger.log(`[res] ◀ ${this.#logBaseURL}${endpoint} - ${response.status} ${response.statusText}`);
            return response.data;
        } catch (error) {
            Logger.error(`[res] ◀ ${this.#logBaseURL}${endpoint} - Error: ${error.message}`);
            Logger.log(`[res]   status: ${error.response ? error.response.status : 'unknown'}`);
            Logger.log(`[res]   data: ${error.response ? JSON.stringify(error.response.data) : 'unknown'}`);
            throw error;
        }
    }   

    async delete(endpoint, params) {
        Logger.log(`[req] ▶ delete from ${endpoint} with params: ${JSON.stringify(params || {})}`);
        try {
            const response = await this.#axiosInstance.delete(`/${endpoint}`, { params });
            Logger.log(`[res] ◀ ${this.#logBaseURL}${endpoint} - ${response.status} ${response.statusText}`);
            return response.data;
        } catch (error) {
            Logger.error(`[res] ◀ ${this.#logBaseURL}${endpoint} - Error: ${error.message}`);
            Logger.log(`[res]   status: ${error.response ? error.response.status : 'unknown'}`);
            Logger.log(`[res]   data: ${error.response ? JSON.stringify(error.response.data) : 'unknown'}`);
            throw error;
        }
    }
}