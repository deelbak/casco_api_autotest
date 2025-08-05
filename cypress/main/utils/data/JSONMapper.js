const Logger = require('../log/logger');

class JSONMapper {
    static getNestedProperty(flattenedObject, path) {
        const keys = [];
        const values = [];

        for (const key in flattenedObject) {
            if( key.endsWith('.' + path) || key === path) {
                keys.push(key);
                values.push(flattenedObject[key]);
            }
        }

        return { keys, values };
    }

    static deleteNotSimilarProperty(flattenedObj, mappingSchema) {
    const keysToDelete = [];
    const outputObj = { ...flattenedObj };
    
    for (const key in outputObj) {
      if (Object.hasOwn(outputObj, key)) {
        let shouldDelete = true;
        for (const path in mappingSchema) {
          if (Object.hasOwn(mappingSchema, path)) {
            if (key.endsWith(`.${path}`) || key === path) {
              shouldDelete = false;
              break;
            }
          }
        }

        if (shouldDelete) keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => delete outputObj[key]);
    return outputObj;
  }
}

module.exports = JSONMapper;