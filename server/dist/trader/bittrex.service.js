"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bittrex = require("node-bittrex-api");
var apiKey = '559c7f63912b431c940cc1945cf57f8b';
var apiSecret = '236174da16934089929e842cac450514';
var BittrexService;
(function (BittrexService) {
    function initBittrexApi() {
        bittrex.options({
            'apikey': apiKey,
            'apisecret': apiSecret,
            'secret': apiSecret
        });
    }
    BittrexService.initBittrexApi = initBittrexApi;
    var infinity = 1000000;
    var buyThreshold = 0.3;
    var refreshRate = 10;
    var beginAmount = 0.010488;
    var last = 0.0765;
    var lastValue = 0;
    var topValue = last;
    var account = beginAmount;
    var isBought = false;
    var boughtAmount = 0;
    var minuteAverage = infinity;
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, getBalance()];
                    case 1:
                        balance = _a.sent();
                        console.log(balance);
                        console.log(typeof balance);
                        bittrex.websockets.listen(function (data, client) {
                            if (data.M === 'updateSummaryState') {
                                data.A.forEach(function (data_for) {
                                    data_for.Deltas.forEach(function (marketsDelta) {
                                        if (marketsDelta.MarketName === 'BTC-ETH') {
                                            checkValue(marketsDelta.Last);
                                            console.log('Ticker Update for ' + marketsDelta.MarketName, marketsDelta.Last);
                                        }
                                    });
                                });
                            }
                        });
                        return [2];
                }
            });
        });
    }
    BittrexService.submit = submit;
    function percent(val, initValue) {
        var a = (val * 100);
        return a / initValue;
    }
    function getGain(last, value) {
        var x = value;
        var complete = last;
        if (last < value) {
            complete = value;
            x = last;
        }
        var delta = complete - x;
        var isMinus = last >= value;
        var percentage = percent(delta, last);
        percentage *= (isMinus ? -1 : 1);
        return percentage;
    }
    function accountInfo() {
        console.log("Account: " + account + " BTC");
        console.log("Initial Account: " + beginAmount + " BTC");
        console.log("Bougth ETH: " + boughtAmount + " ETH\n");
    }
    function checkValue(value) {
        console.log("Actual: " + value);
        if (isBought) {
            var overallGain = getGain(last, value);
            if (lastValue !== value) {
                console.log("Last: " + last);
                console.log("Overall: " + overallGain.toFixed(2) + " %");
                var topGain = getGain(topValue, value);
                console.log("Top value: " + topValue);
                console.log("Top value gain: " + topGain + " %");
                console.log('\n');
                lastValue = value;
                if (overallGain < 0) {
                    sell(value);
                    return;
                }
                if (topGain < 0 && overallGain > 0) {
                    if ((overallGain + topGain) < overallGain / 2) {
                        sell(value);
                        return;
                    }
                }
                topValue = value > topValue ? value : topValue;
            }
        }
        else {
            var topGain = getGain(topValue, value);
            if (topGain > buyThreshold) {
                buy(value);
            }
            topValue = value;
        }
    }
    function getBalance() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        bittrex.getbalance({ currency: 'DCT' }, function (data, err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            resolve(data.result.Available);
                        });
                    }).catch(function (err) {
                        console.log(err);
                    })];
            });
        });
    }
    function start() {
        var _this = this;
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                getTicker();
                return [2];
            });
        }); }, refreshRate * 60 * 1000);
    }
    function cyclicCheck() {
        var _this = this;
        var coinInteval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                bittrex.getticker({ market: 'BTC-ETH' }, function (ticker) {
                    console.log(new Date().toTimeString() + " => " + ticker.result.Last);
                    if (minuteAverage === infinity) {
                        minuteAverage = ticker.result.Last;
                    }
                    else {
                        var gain = getGain(minuteAverage, ticker.result.Last);
                        console.log(new Date().toTimeString() + "10 minutes gain " + gain.toFixed(6));
                        if (gain > buyThreshold) {
                            clearInterval(coinInteval);
                            buy(ticker.result.Last);
                            start();
                        }
                        else {
                            minuteAverage = ticker.result.Last;
                        }
                    }
                });
                return [2];
            });
        }); }, 1000 * 60 * refreshRate);
    }
    BittrexService.cyclicCheck = cyclicCheck;
    function getTicker() {
        bittrex.getticker({ market: 'BTC-ETH' }, function (ticker) {
            if (ticker.result) {
                checkValue(ticker.result.Last);
            }
        });
    }
    function buy(price) {
        var amount = account / price;
        boughtAmount += amount;
        account = 0;
        topValue = price;
        last = price;
        isBought = true;
        console.log("BUY");
        accountInfo();
    }
    function sell(price) {
        account = boughtAmount * price;
        boughtAmount = 0;
        last = price;
        isBought = false;
        console.log("SELL");
        accountInfo();
    }
})(BittrexService = exports.BittrexService || (exports.BittrexService = {}));
//# sourceMappingURL=bittrex.service.js.map