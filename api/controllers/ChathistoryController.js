module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    savebookmark: function (req, res) {
        if (req.body) {
            Chathistory.savebookmark(req.body, res.callback);
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
    viewbookmark: function (req, res) {
        if (req.body) {
            Chathistory.viewbookmark(req.body, res.callback);
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
    getbookmark: function (req, res) {
        if (req.body) {
            Chathistory.getbookmark(req.body, res.callback);
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
};
module.exports = _.assign(module.exports, controller);