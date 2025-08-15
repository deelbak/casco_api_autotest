const moment = require('moment');
const JSONLoader = require('../data/JSONLoader');
const TimeUtils = require('../time/timeUtils');
const DataUtils = require('../data/dataUtils');

class Randomizer {
  static getRandomDatesIntervalFromTomorrow(count, unitOfTime) {
    const nextDayObject = moment().add(1, 'days').startOf('day');
    const unixOne = nextDayObject.unix();
    const unixTwo = moment(moment().add(1, 'days').startOf('day')).add(count, unitOfTime).unix();

    const startDateUnix = moment.unix(this.getRandomFloat(unixOne, unixTwo)).unix();
    let finishDateUnix;
    do {
      finishDateUnix = moment.unix(this.getRandomFloat(startDateUnix, unixTwo)).unix();
    } while ((finishDateUnix - startDateUnix) < 86400 * 2);

    const startDateObject = moment.unix(startDateUnix).startOf('day');
    const finishDateObject = moment.unix(finishDateUnix).startOf('day');
    const startDate = startDateObject.format(JSONLoader.testData.datesFormat);
    const finishDate = finishDateObject.format(JSONLoader.testData.datesFormat);

    const daysDifferenceIncluded = finishDateObject.diff(startDateObject, 'days') + 1;

    const getAbsoluteMonth = (date) => {
      const months = Number(moment(date, JSONLoader.testData.datesFormat).format('MM'));
      const years = Number(moment(date, JSONLoader.testData.datesFormat).format('YYYY'));
      return months + (years * 12);
    };

    const currentMonth = getAbsoluteMonth(moment.unix(unixOne)
      .format(JSONLoader.testData.datesFormat));
    const startMonth = getAbsoluteMonth(startDate);
    const finishMonth = getAbsoluteMonth(finishDate);
    let startMonthDifference = startMonth - currentMonth;
    let finishMonthDifference = finishMonth - currentMonth;

    if (nextDayObject.date() === 1) startMonthDifference += 1;
    if (nextDayObject.date() === 1) finishMonthDifference += 1;

    return {
      startDate,
      finishDate,
      startMonthDifference,
      finishMonthDifference,
      daysDifferenceIncluded,
    };
  }

  static getRandomString(
    hasLowerCase = false,
    hasUpperCase = false,
    hasNumber = false,
    hasCyrillic = false,
    chosenLetter = false,
    minLength = 1,
    maxLength = 10,
  ) {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const cyrillicLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

    const length = this.getRandomInteger(maxLength, minLength);

    let randomString = '';
    if (chosenLetter) randomString += chosenLetter;

    let requiredCharacters = '';
    if (hasLowerCase) {
      requiredCharacters
      += lowerCaseLetters.charAt(Math.floor(Math.random() * lowerCaseLetters.length));
    }

    if (hasUpperCase) {
      requiredCharacters
      += upperCaseLetters.charAt(Math.floor(Math.random() * upperCaseLetters.length));
    }

    if (hasNumber) {
      requiredCharacters
      += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    if (hasCyrillic) {
      requiredCharacters
      += cyrillicLetters.charAt(Math.floor(Math.random() * cyrillicLetters.length));
    }

    randomString += requiredCharacters;

    const characters = (hasLowerCase ? lowerCaseLetters : '')
    + (hasUpperCase ? upperCaseLetters : '')
    + (hasNumber ? numbers : '')
    + (hasCyrillic ? cyrillicLetters : '');
    const charactersLength = characters.length;
    const randomLength = length - randomString.length;

    for (let i = 0; i < randomLength; i += 1) {
      randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return this.stringShuffler(randomString);
  }

  static stringShuffler(inputString) {
    const array = inputString.split('');
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array.join('');
  }

  static getRandomInteger(max = 9, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  static getInsurancePeriodByUnit(insurancePeriodUnit) {
    switch (insurancePeriodUnit) {
      case 1:
        return this.getRandomInteger(JSONLoader.testData.insurance_period_limit[3], 1);
      case 2:
        return this.getRandomInteger(JSONLoader.testData.insurance_period_limit[2], 1);
      default:
        return this.getRandomInteger(JSONLoader.testData.insurance_period_limit[1], 1);
    }
  }

  static getAmortization(insurancePaymentConditionId) {
    if (insurancePaymentConditionId === 3 || insurancePaymentConditionId === 5) {
      return this.getRandomInteger(1, 0);
    }
    return 0;
  }

  static randomizeSetPolicyRequest(requestData) {
    const params = { ...requestData };
    const randomInterval = Math.floor(Math.random() * 31 + 1);
    const datesInterval = TimeUtils.getDatesInterval(
      randomInterval,
      'days',
      {
        reversInterval: true,
        startNextDay: false,
      },
    );
    const inspectionAbsenceReasonIdArr = JSONLoader.testData.inspection_absence_reason_id;
    params.insurance_start_date = TimeUtils.reformatDate(datesInterval.startDate);
    params.inspection_required = false;
    params.payment_plan_id = this.getRandomInteger(5, 1);
    params.inspection_absence_reason_id = inspectionAbsenceReasonIdArr[
      this.getRandomInteger(inspectionAbsenceReasonIdArr.length - 1)
    ];
    params.signatory_holder = {
      full_name: JSONLoader.testData.signatorys_holder_full_name,
      attorney_number: JSONLoader.testData.signatorys_holder_attorney_number,
      issued_at: JSONLoader.testData.signatorys_holder_issued_at,
    };
    params.signatory_insurer = {
      full_name: JSONLoader.testData.signatorys_insurer_full_name,
      attorney_number: JSONLoader.testData.signatorys_insurer_attorney_number,
      issued_at: JSONLoader.testData.signatorys_insurer_issued_at,
    };
    return params;
  }

  static createRandomRequestStructuresWithoutFile(testClients, requestTemplate) {
    const clientsArr = DataUtils.filterClients(testClients, { isJuridical: false });
    const randomHolderIndex = this.getRandomInteger(clientsArr.length - 1);
    let randomInsuredIndex;
    do {
      randomInsuredIndex = this.getRandomInteger(clientsArr.length - 1);
    } while (randomInsuredIndex === randomHolderIndex);
    const tempHolder = clientsArr[randomHolderIndex];
    const tempInsured = clientsArr[randomInsuredIndex];
    const carsArr = JSONLoader.testCars;
    const randomCar = carsArr[this.getRandomInteger(carsArr.length - 1)];
    const detailingArr = JSONLoader.testData.id_detailing;
    const insuranceGroupIdArr = JSONLoader.testData.insurance_group_id;
    const salesArr = JSONLoader.testData.id_sales;
    const insurancetTerritoryIdArr = JSONLoader.testData.insurance_territory_id;
    const insurancePaymentConditionIdArr = JSONLoader.testData.insurance_payment_condition_id;
    const randominsurancePaymentConditionId = this.getRandomInteger(
      insurancePaymentConditionIdArr.length - 1,
      1,
    );
    const insuranceAmount = this.getRandomInteger(
      JSONLoader.testData.max_insurance_amount,
      JSONLoader.testData.min_insurance_amount,
    );
    const tariff = this.getRandomInteger(
      JSONLoader.testData.max_tariff,
      JSONLoader.testData.min_tariff,
    );
    const documentGivedByArr = JSONLoader.testData.document_gived_by;
    const [status] = JSONLoader.testData.status;
    const params = { ...requestTemplate };
    params.holder = {
      ...params.holder,
      esbd_id: tempHolder.client_id,
      client_form_id: tempHolder.client_form_id,
      country_id: JSONLoader.testData.country_id,
      affiliation: false,
      resident_bool: tempHolder.resident_bool,
      iin: tempHolder.iin,
      first_name: tempHolder.first_name,
      last_name: tempHolder.last_name,
      middle_name: tempHolder.middle_name,
      born: TimeUtils.reformatDate(tempHolder.born),
      sex_id: tempHolder.sex_id,
      document_type_id: tempHolder.document_type_id,
      document_number: tempHolder.document_number,
      document_gived_date: TimeUtils.reformatDate(tempHolder.document_gived_date),
      document_gived_by: documentGivedByArr[this.getRandomInteger(documentGivedByArr.length - 1)],
      address: this.getRandomString(true, true, true, true, true, 10, 20),
      email: tempHolder.email,
      phone: tempHolder.phone,
      pdl: JSONLoader.testData.pdl,
      verify_type_id: Number(JSONLoader.configData.verification) || 3,
      verify_bool: Number(JSONLoader.configData.verification),
    };
    params.beneficiary = {
      ...params.beneficiary,
      with_encumbrance: Math.random() < 0.5,
      esbd_id: tempInsured.client_id,
      client_form_id: tempInsured.client_form_id,
      country_id: JSONLoader.testData.country_id,
      affiliation: false,
      resident_bool: tempInsured.resident_bool,
      iin: tempInsured.iin,
      first_name: tempInsured.first_name,
      last_name: tempInsured.last_name,
      middle_name: tempInsured.middle_name,
      born: TimeUtils.reformatDate(tempInsured.born),
      sex_id: tempInsured.sex_id,
      document_type_id: tempInsured.document_type_id,
      document_number: tempInsured.document_number,
      document_gived_date: TimeUtils.reformatDate(tempInsured.document_gived_date),
      document_gived_by: 1,
      address: this.getRandomString(true, true, true, true, true, 10, 20),
      email: tempInsured.email,
      phone: tempInsured.phone,
      pdl: JSONLoader.testData.pdl,
      verify_type_id: Number(JSONLoader.configData.verification) || 3,
      verify_bool: Number(JSONLoader.configData.verification),
    };
    params.insurance_group_id = insuranceGroupIdArr[
      this.getRandomInteger(insuranceGroupIdArr.length - 1)
    ];
    params.restoration_insurance_amount = Math.random() < 0.5;
    params.status = status;
    params.with_amortization = this.getAmortization(randominsurancePaymentConditionId);
    params.contract_type_id = JSONLoader.testData.contract_type_id;
    params.id_sales = salesArr[this.getRandomInteger(salesArr.length - 1)];
    params.id_detailing = detailingArr[this.getRandomInteger(detailingArr.length - 1)];
    params.insurance_type_id = JSONLoader.testData.insurance_type_id;
    params.cr_lr_id = this.getRandomInteger(31, 1);
    params.product_id = JSONLoader.testData.product_id;
    params.risk_ids = JSONLoader.testData.risk_ids;
    params.validity_period = JSONLoader.testData.validity_period;
    params.insurance_period_unit = this.getRandomInteger(3, 1);
    params.insurance_period = this.getInsurancePeriodByUnit(params.insurance_period_unit);
    params.reinsurance_required = false;
    params.manager_id = JSONLoader.testData.manager_id;
    params.agent_id = JSONLoader.testData.agent_id;
    params.agent_commission = this.getRandomInteger(
      JSONLoader.testData.max_agent_commission,
      JSONLoader.testData.min_agent_commission,
    );
    params.rvd_percent = JSONLoader.testData.rvd_percent;
    params.with_loss_history = JSONLoader.testData.with_loss_history;
    params.franchise = {
      loss_percent: this.getRandomInteger(
        JSONLoader.testData.max_franchise_loss_percent,
        JSONLoader.testData.min_franchise_loss_percent,
      ),
      min_loss: this.getRandomInteger(JSONLoader.testData.min_franchise_loss_amount),
      max_loss: this.getRandomInteger(
        JSONLoader.testData.max_franchise_loss_amount,
        JSONLoader.testData.min_franchise_loss_amount,
      ),
      damage_percent: this.getRandomInteger(
        JSONLoader.testData.max_franchise_damage_percent,
        JSONLoader.testData.min_franchise_damage_percent,
      ),
      min_damage: this.getRandomInteger(JSONLoader.testData.min_franchise_damage_amount),
      max_damage: this.getRandomInteger(
        JSONLoader.testData.max_franchise_damage_amount,
        JSONLoader.testData.min_franchise_damage_amount,
      ),
      tariff,
      insurance_territory_id: insurancetTerritoryIdArr[
        this.getRandomInteger(insurancetTerritoryIdArr.length - 1)
      ],
      insurance_payment_condition_id: randominsurancePaymentConditionId,
      cost_type_id: this.getRandomInteger(3, 1),
      vehicles: [
        {
          esbd_id: randomCar.tf_id,
          reg_num: randomCar.reg_num,
          vin: randomCar.vin,
          type_id: randomCar.type_id,
          year: randomCar.year,
          engine_volume: randomCar.engine_volume,
          mark: randomCar.mark,
          model: randomCar.model,
          reg_cert_num: randomCar.reg_cert_num,
          dt_reg_cert: TimeUtils.reformatDate(randomCar.dt_reg_cert),
          region_id: randomCar.region_id,
          country_id: randomCar.country_id,
          big_city_bool: randomCar.big_city_bool,
          insurance_amount: insuranceAmount,
          kolesa_average_sum: Math.round(insuranceAmount * (1 + this.getRandomInteger(
            JSONLoader.testData.kolesa_max_percent,
            JSONLoader.testData.kolesa_min_percent,
          ) / 100
          )),
          premium: tariff * (insuranceAmount / 100),
        },
      ],
    };
    params.questionnaire_answers = {
      airport_commercial_transport: Math.random() < 0.5,
      chemical_transport: Math.random() < 0.5,
      emergency_services_vehicles: Math.random() < 0.5,
      commercial_goods_transport: Math.random() < 0.5,
      explosive_transport: Math.random() < 0.5,
      leased_out: Math.random() < 0.5,
      liquid_gas_transport: Math.random() < 0.5,
      military_or_police_vehicles: Math.random() < 0.5,
      nuclear_use: Math.random() < 0.5,
      other_insurance: Math.random() < 0.5,
      other_risk_factors: this.getRandomString(true, true, true, true, true, 5, 30),
      other_usage_purposes: this.getRandomString(true, true, true, true, true, 5, 30),
      racing_use: Math.random() < 0.5,
      usage_purpose: this.getRandomInteger(1, 0),
      used_as_taxi_or_bus: Math.random() < 0.5,
      used_in_restricted_airport_area: Math.random() < 0.5,
    };
    return params;
  }

  static createRandomRequestStructures(testClients, requestTemplate) {
    const clientsArr = DataUtils.filterClients(testClients, { isJuridical: false });
    const randomHolderIndex = this.getRandomInteger(clientsArr.length - 1);
    let randomInsuredIndex;
    do {
      randomInsuredIndex = this.getRandomInteger(clientsArr.length - 1);
    } while (randomInsuredIndex === randomHolderIndex);
    const tempHolder = clientsArr[randomHolderIndex];
    const tempInsured = clientsArr[randomInsuredIndex];
    const detailingArr = JSONLoader.testData.id_detailing;
    const insuranceGroupIdArr = JSONLoader.testData.insurance_group_id;
    const salesArr = JSONLoader.testData.id_sales;
    const documentGivedByArr = JSONLoader.testData.document_gived_by;
    const [status] = JSONLoader.testData.status;
    const params = { ...requestTemplate };
    params.holder = {
      ...params.holder,
      esbd_id: tempHolder.client_id,
      client_form_id: tempHolder.client_form_id,
      country_id: JSONLoader.testData.country_id,
      affiliation: false,
      resident_bool: tempHolder.resident_bool,
      iin: tempHolder.iin,
      first_name: tempHolder.first_name,
      last_name: tempHolder.last_name,
      middle_name: tempHolder.middle_name,
      born: TimeUtils.reformatDate(tempHolder.born),
      sex_id: tempHolder.sex_id,
      document_type_id: tempHolder.document_type_id,
      document_number: tempHolder.document_number,
      document_gived_date: TimeUtils.reformatDate(tempHolder.document_gived_date),
      document_gived_by: documentGivedByArr[this.getRandomInteger(documentGivedByArr.length - 1)],
      address: this.getRandomString(true, true, true, true, true, 10, 20),
      email: tempHolder.email,
      phone: tempHolder.phone,
      pdl: JSONLoader.testData.pdl,
      verify_type_id: Number(JSONLoader.configData.verification) || 3,
      verify_bool: Number(JSONLoader.configData.verification),
    };
    params.beneficiary = {
      ...params.beneficiary,
      with_encumbrance: Math.random() < 0.5,
      esbd_id: tempInsured.client_id,
      client_form_id: tempInsured.client_form_id,
      country_id: JSONLoader.testData.country_id,
      affiliation: false,
      resident_bool: tempInsured.resident_bool,
      iin: tempInsured.iin,
      first_name: tempInsured.first_name,
      last_name: tempInsured.last_name,
      middle_name: tempInsured.middle_name,
      born: TimeUtils.reformatDate(tempInsured.born),
      sex_id: tempInsured.sex_id,
      document_type_id: tempInsured.document_type_id,
      document_number: tempInsured.document_number,
      document_gived_date: TimeUtils.reformatDate(tempInsured.document_gived_date),
      document_gived_by: 1,
      address: this.getRandomString(true, true, true, true, true, 10, 20),
      email: tempInsured.email,
      phone: tempInsured.phone,
      pdl: JSONLoader.testData.pdl,
      verify_type_id: Number(JSONLoader.configData.verification) || 3,
      verify_bool: Number(JSONLoader.configData.verification),
    };
    params.insurance_group_id = insuranceGroupIdArr[
      this.getRandomInteger(insuranceGroupIdArr.length - 1)
    ];
    params.restoration_insurance_amount = Math.random() < 0.5;
    params.status = status;
    params.contract_type_id = JSONLoader.testData.contract_type_id;
    params.id_sales = salesArr[this.getRandomInteger(salesArr.length - 1)];
    params.id_detailing = detailingArr[this.getRandomInteger(detailingArr.length - 1)];
    params.insurance_type_id = JSONLoader.testData.insurance_type_id;
    params.cr_lr_id = this.getRandomInteger(31, 1);
    params.product_id = JSONLoader.testData.product_id;
    params.risk_ids = JSONLoader.testData.risk_ids;
    params.validity_period = JSONLoader.testData.validity_period;
    params.insurance_period_unit = this.getRandomInteger(3, 1);
    params.insurance_period = this.getInsurancePeriodByUnit(params.insurance_period_unit);
    params.reinsurance_required = false;
    params.manager_id = JSONLoader.testData.manager_id;
    params.agent_id = JSONLoader.testData.agent_id;
    params.agent_commission = this.getRandomInteger(40, 1);
    params.rvd_percent = JSONLoader.testData.rvd_percent;
    params.with_loss_history = JSONLoader.testData.with_loss_history;
    params.questionnaire_answers = {
      airport_commercial_transport: Math.random() < 0.5,
      chemical_transport: Math.random() < 0.5,
      emergency_services_vehicles: Math.random() < 0.5,
      commercial_goods_transport: Math.random() < 0.5,
      explosive_transport: Math.random() < 0.5,
      leased_out: Math.random() < 0.5,
      liquid_gas_transport: Math.random() < 0.5,
      military_or_police_vehicles: Math.random() < 0.5,
      nuclear_use: Math.random() < 0.5,
      other_insurance: Math.random() < 0.5,
      other_risk_factors: this.getRandomString(true, true, true, true, true, 5, 30),
      other_usage_purposes: this.getRandomString(true, true, true, true, true, 5, 30),
      racing_use: Math.random() < 0.5,
      usage_purpose: this.getRandomInteger(1, 0),
      used_as_taxi_or_bus: Math.random() < 0.5,
      used_in_restricted_airport_area: Math.random() < 0.5,
    };
    return params;
  }
}

module.exports = Randomizer;