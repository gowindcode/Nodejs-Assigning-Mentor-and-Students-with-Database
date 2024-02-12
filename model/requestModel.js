const mongoose = require("mongoose")
const requestSchema = mongoose.Schema(

    //student make request for time change, batch shift, course update, 
    //ask mentor assign and with reason message
    {
        studentId: {type: Number, required: true},
        batch: {type: String, required: true},
        mentor: {type: String, required: true},
        reasonMessage: {type: String, required: true},
        verified: {type: Boolean, required: true, default: "student"}
    }, {timestamps: true}
);

const RequestModel = mongoose.model("requests", requestSchema);

module.exports = RequestModel