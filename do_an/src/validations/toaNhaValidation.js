const Joi = require('joi');

const toaNhaSchema = Joi.object({
    MaToaNha: Joi.string().required().messages({
        'string.empty': 'Mã tòa nhà không được để trống',
        'any.required': 'Mã tòa nhà là trường bắt buộc'
    }),
    TenToaNha: Joi.string().required().messages({
        'string.empty': 'Tên tòa nhà không được để trống',
        'any.required': 'Tên tòa nhà là trường bắt buộc'
    }),
    SoLuongPhong: Joi.number().integer().min(1).optional().messages({
        'number.base': 'Số lượng phòng phải là số',
        'number.min': 'Số lượng phòng phải ít nhất là 1'
    })
});

module.exports = {
    toaNhaSchema
};
