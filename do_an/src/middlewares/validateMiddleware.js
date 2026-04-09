const response = require('../utils/responseFormat');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { 
        abortEarly: false,
        allowUnknown: true // Allow extra fields that might be handled separately
    });
    
    if (error) {
        const errorDetails = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message.replace(/"/g, '')
        }));
        return response.error(res, 'Dữ liệu không hợp lệ', 400, errorDetails);
    }
    next();
};

module.exports = validate;
