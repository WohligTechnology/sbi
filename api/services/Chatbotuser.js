var schema = new Schema({
    name: {
        type: String,
    },
    email_id: {
        type: String,
        validate: validators.isEmail(),
        //unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile_number: {
        type: Number,
    },
    date_of_birth: {
        type: String,
    },
    user_tag: {
        type: String,
    },
    user_id: {
        type: String,
    },
    policy_no: {
        type: String,
    },
});

schema.plugin(deepPopulate, {
    /*populate: {
        'user': {
            select: 'fname _id'
        }
    }*/
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
//userlogschema.plugin(uniqueValidator);
//userlogschema.plugin(timestamps);
//userlogschema = require('userlogschema');
module.exports = mongoose.model('Chatbotuser', schema,'user');
//var chatbot_user_logs = mongoose.model('chatbot_user_logs', userlogschema,"chatbot_user_logs");
var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    loginuser: function (data, callback) {
       // console.log("data", data)
        Chatbotuser.findOne({
            email_id: data.email,
            password: data.password,
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, {msg:1});
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    changepassword: function (data, callback) {
        Chatbotuser.findOneAndUpdate({
            _id: data.userid,
            password: data.oldpassword,
        },{ $set: { password: data.newpassword }}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    forgotpassword: function (data, callback) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        var d = new Date(tomorrow),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        expiry= [year, month, day].join('-');
        expiry=new Date(expiry+"T23:59:59");
        Chatbotuser.findOneAndUpdate({
            email: data.email,
        },{ $set: { resetpasswordtoken: data.resettoken,expirydate:expiry }}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    isvalidpasswordresetreq: function (data, callback) {
        
        Chatbotuser.findOne({
            resetpasswordtoken: data.resettoken,
            
        },{ expirydate: 1, _id:0 }).limit(1).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    resetpassword:function (data, callback) {
        
        Chatbotuser.findOneAndUpdate({
            resetpasswordtoken: data.resettoken,
            
        },{$set : {resetpasswordtoken: "",password:data.password}}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    
};
module.exports = _.assign(module.exports, exports, model);