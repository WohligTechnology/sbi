
//module.exports = mongoose.model('Chatbotnews', schema,'categoryquestions');
var inshorts= require('inshorts').init();
var exports = _.cloneDeep(require("sails-wohlig-service")());
var model = {
    getnews: function (reqdata, callback) {
        inshorts.getNews('business',function(err,result){
            if(!err)
                callback(null,result);
            else
                callback(err,null);
        });
    },
    getmorenews: function (reqdata, callback) {
        inshorts.more({category:'startup',id:reqdata.id},function(err,result){
            if(!err)
                callback(null,result);
            else
                callback(err,null);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);