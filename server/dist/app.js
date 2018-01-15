"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trader_1 = require("./trader/trader");
var bittrex_service_1 = require("./service/bittrex.service");
var account_1 = require("./model/account");
var traderService = new bittrex_service_1.BittrexService();
var account = new account_1.Account(0.01);
var trader = new trader_1.Trader(traderService, account);
trader.getTicker()
    .then(function (res) {
    console.log(res);
})
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=app.js.map