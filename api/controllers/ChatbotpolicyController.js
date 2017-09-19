module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    createpolicy: function (req, res) {
        if (req.body) {
            Chatbotpolicy.createpolicy(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    viewpolicy: function (req, res) {
        if (req.body) {
            Chatbotpolicy.viewpolicy(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    editpolicy: function (req, res) {
        if (req.body) {
            Chatbotpolicy.editpolicy(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);