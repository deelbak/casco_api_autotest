const moment = require('moment');
const JSONLoader = require('../data/JSONLoader');

class Randomizer {
    static getRandomDatesIntervalFromTomorrow(count, unitOfTime) {
        const nextDayObject = moment().add(1, 'day').startOf('day');
        unixOne = nextDayObject.unix();
        unixTwo = moment(nextDayObject).add(count, unitOfTime).unix();

        const startDateUnix = moment.unix(this.getRandomFloat(startDateUnix, unixTwo)).unix();

        let finishDateUnix;
        do {
            finishDateUnix = moment.unix(this.getRandomFloat(startDateUnix, unixTwo)).unix();
        } while ((finishDateUnix - startDateUnix) < 86400 * 2);

        const startDateObject = moment.unix(startDateUnix).startOf('day');
        const finishDateObject = moment.unix(finishDateUnix).startOf('day');
        const startDate = startDateObject.format(JSONLoader.testData.datesFormat);
        const finishDate = finishDateObject.format(JSONLoader.testData.datesFormat);

        const daysDifferenceIncluded = finishDateObject.diff(startDateObject, 'days') + 1;

        const currentMonth = getAbsoluteMonth(moment.unix(unixOne).format(JSONLoader.testData.datesFormat));
        const startMonth = getAbsoluteMonth(startDate);
        const finishMonth = getAbsoluteMonth(finishDate);

        let startMonthDifference = startMonth - currentMonth;
        let finishMonthDifference = finishMonth - currentMonth;

        if(nextDayObject.date() === 1) {
            startMonthDifference++;
            finishMonthDifference++;
        }

        return {
            startDate,
            finishDate,
            startMonthDifference,
            finishMonthDifference,
            daysDifferenceIncluded
        };
    }
}
