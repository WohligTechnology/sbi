var SchemaTypes = mongoose.Schema.Types;
var schema = new Schema({
    policyno: {
        type: String,
    },
    inceptiondate: {
        type: Date,
    },
    expirydate: {
        type: Date,
    },
    service_tax_amount: {
        //type:SchemaTypes.Double,
        type:Number,
    }, 
    premium_amount: {
        //type:SchemaTypes.Double,
        type:Number,
    },
    agent_name: {
        type: String,
    },
    agent_contact_no: {
        type: String,
    },
    customer_contact_no: {
        type: String,
    },
    customer_email: {
        type: String,
    },
    user_id: {
        type: Number,
    },
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Chatbotpolicy', schema,'chatbotpolicy');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    createpolicy: function (data, callback) {
        Chatbotpolicy.saveData({
            policyno: data.policyno,
            inceptiondate: data.inception_date,
            expirydate: data.expiry_date,
            service_tax_amount:data.stamount,
            premium_amount:data.prem_amount,
            agent_name:data.agent_name,
            agent_contact_no:data.agent_no,
            customer_contact_no:data.cust_no,
            customer_email:data.cust_email,
            user_id:data.user_id,
        },function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, {"message":"1"});
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    editpolicy: function (data, callback) {
        var id = data._id;
        delete data._id;
        Chatbotpolicy.findOneAndUpdate({
            _id:id
        },{$set : data},function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, {"message":"1"});
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    viewpolicy: function (data, callback) {
        var maxrow = 2;
        var searchobj = {};
        if(data.skey != '' && data.sval !='')
        {
                if(data.skey == 'policyno')
                {
                    searchobj = {
                        policyno:{ $regex: '.*' + data.sval + '.*',$options:"i" }
                    };
                }
                else if(data.skey == 'customer_email')
                {
                    searchobj = {
                        customer_email:{ $regex: '.*' + data.sval + '.*',$options:"i" }
                    };
                }
                else if(data.skey == 'agent_name')
                {
                    searchobj = {
                        agent_name:{ $regex: '.*' + data.sval + '.*',$options:"i" }
                    };
                }
                else if(data.skey == 'customer_contact_no')
                {
                    searchobj = {
                        customer_contact_no:{ $regex: '.*' + data.sval + '.*',$options:"i" }
                    };
                }
        }
        
        data.orderCount = data.orderCount ? data.orderCount : 0;
        Chatbotpolicy.count(searchobj).exec(function (err, count) {
            if(count > 0)
            {
                Chatbotpolicy.find(searchobj).skip((data.viewPage-1)*maxrow).limit(maxrow).exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } 
                    else {
                        if (found) {
                            var responseobj = {count:count,data:found};
                            //console.log(found);
                            callback(null, responseobj);
                        } else {
                            callback({
                                message: "-1"
                            }, null);
                        }
                    }

                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);