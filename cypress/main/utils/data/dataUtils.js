const fs = require('fs');
const JSONMapper = require('./JSONMapper');
const JSONLoader = require('./JSONLoader');
const TimeUtils = require('./time/TimeUtils');

class DataUtils {
    static saveToJSON(obj) {
        const [name] = Object.keys(obj);
        const value = obj[name];

        const replacer = (key, val) => { typeof val === 'undefined' ? null : val; };
        fs.writeFileSync(`.test/artifacts/${name}.json`, JSON.stringify(value, replacer, 4));
    }

    static mapRequestToOnes(getPolicyData, requestData) {
        this.saveToJSON({ getPolicyData });
        this.saveToJSON({ requestData });

        const mappedData = JSONMapper.mapValues(
            { getPolicyData },
            { requestData },
            JSONLoader.requestToGetPolicyMapSchema,
        );

        const datesFullKeys = JSONMapper.getNestedProperty(mappedData, 'date_begin').keys;
        datesFullValues.push(...JSONMapper.getNestedProperty(mappedData, 'date_endn').keys);
        datesFullValues.push(...JSONMapper.getNestedProperty(mappedData, 'date').keys);
        datesFullKeys.forEach((fullKey) => {
            mappedData[fullKey] = TimeUtils.reformatDate(mappedData[fullKey]);
        });

    }
}