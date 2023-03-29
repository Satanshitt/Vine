const { model, Schema } = require('mongoose');

module.exports = model('applications', new Schema({
    id: { type: String, required: true },
    code: { type: String, required: true },
    messageID: { type: String, required: true },
    staff: { type: String },
    reason: { type: String },
    status: { type: String, default: "Postulado" }
}));