var schema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    chat_timestamp: {
        type: String,
    },
    sessionId: {
        type:Number,
    },
    user_request : {
        type:String
    },
    response: {
        topic : String,
		sessionId : Number,
		type : String,
    }
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
module.exports = mongoose.model('Chathistory', schema,'chathistory');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'chathistory'));
var model = {
    viewbookmark: function (data, callback) {
        console.log("data", data);
        var userid = data.userid;
        Chathistory.aggregate([
			//user_id: userid
        {$group: { _id: "$sessionId", count:{$sum:1} } },
        { $match: { user_id: userid } }
		]).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
					//var results = _.groupBy(found, "sportsListCategory.name");
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    getbookmark: function (data, callback) {
        console.log("data", data)
        Chathistory.findOne({
            _id: mongoose.Types.ObjectId(data.selected),
        }, [ "user", "chatlist"]).sort({ 
            createdAt : -1 
        }).limit(1).exec(function (err, found) {
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
    savebookmark: function (data, callback) {
        Chathistory.saveData({
            user: data.userid,
            chatlist: data.chatlist,
            name:data.name,
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
    
};
module.exports = _.assign(module.exports, exports, model);