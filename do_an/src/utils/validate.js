const response = require('./responseFormat');

/**
 * Simple validation middleware
 * @param {Object} schema - Object containing field names and their validation rules
 */
const validate = (schema) => (req, res, next) => {
    const errors = [];
    const body = req.body;

    for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${field} là bắt buộc`);
            continue;
        }

        if (value !== undefined && value !== null) {
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${field} phải có ít nhất ${rules.minLength} ký tự`);
            }
            if (rules.isEmail && !/\S+@\S+\.\S+/.test(value)) {
                errors.push(`${field} không đúng định dạng email`);
            }
            if (rules.isPhone && !/^\d{10,11}$/.test(value)) {
                errors.push(`${field} không đúng định dạng số điện thoại (10-11 số)`);
            }
        }
    }

    if (errors.length > 0) {
        return response.error(res, errors[0], 400); // Return first error for simplicity
    }

    next();
};

module.exports = validate;
