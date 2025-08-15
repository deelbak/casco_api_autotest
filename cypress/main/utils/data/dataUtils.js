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

    static passBugsCasco(mappedData) {
    const outputData = { ...mappedData };
    // Pass Casco bug with "client_form" value
    if (typeof outputData['contracts.0.agent_comission'] === 'string') {
      outputData['contracts.0.agent_comission'] = Number(outputData['contracts.0.agent_comission']);
    }
    return outputData;
  }

  static passBugsQuoteToOnes(mappedData) {
    const outputData = { ...mappedData };
    // Pass Quote to ones bug with agent_commision value
    if (typeof outputData.agent_commission === 'string') {
      outputData.agent_commission = Number(outputData.agent_commission);
    }
    return outputData;
  }

  static passBugsESBD(mappedData, getPolicyData) {
    const outputData = { ...mappedData };
    // Pass ESBD bug with "client_form" value
    if (outputData['contracts.0.clients.0.client_form'] !== getPolicyData.contracts[0].clients[0].client_form) {
      outputData['contracts.0.clients.0.client_form'] = getPolicyData.contracts[0].clients[0].client_form;
    }
    // Pass ESBD bug with "verify_type_id" value
    if (outputData['contracts.0.beneficiarys.0.verify_type_id'] !== getPolicyData.contracts[0].beneficiarys[0].verify_type_id) {
      outputData['contracts.0.beneficiarys.0.verify_type_id'] = getPolicyData.contracts[0].beneficiarys[0].verify_type_id;
    }

    return outputData;
  }

  static passBugsTWB(mappedData, getPolicyData) {
    const outputData = { ...mappedData };
    // Pass TWB bug with "verify_bool" value without verification
    if (getPolicyData.contracts[0].verify_bool === 1
    && outputData['contracts.0.verify_bool'] === 0) {
      outputData['contracts.0.verify_bool'] = getPolicyData.contracts[0].verify_bool;
    } 


    // // Pass TWB bug with "ins_premium" value
    const insuredObjects = getPolicyData.contracts[0].insured_objects;

    for (let i = 0; i < insuredObjects.length; i += 1) {
      const actual = insuredObjects[i].ins_premium;
      const expected = outputData[`contracts.0.insured_objects.${i}.ins_premium`];

      if (actual !== expected) {
        outputData[`contracts.0.insured_objects.${i}.ins_premium`] = actual;
      }
    }

    return outputData;
  }


}

module.exports = DataUtils;