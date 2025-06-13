const fieldValidator = (requestedFieldObject, validFieldsArray) => {
    if (!Array.isArray(validFieldsArray) || !requestedFieldObject || !validFieldsArray.length) return false;
    const invalidFields = Object.keys(requestedFieldObject).filter(field => !validFieldsArray.includes(field) || !requestedFieldObject[field]);
    if (invalidFields.length) return false;
    else return true;
}

module.exports = { fieldValidator }