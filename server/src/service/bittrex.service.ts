import * as bittrex from 'node-bittrex-api';
// import * as request from 'request';
import { TraderService } from './traderService';

const apiKey = '559c7f63912b431c940cc1945cf57f8b';
const apiSecret = '236174da16934089929e842cac450514';

export class Bittrex extends TraderService {

}

export namespace BittrexService {
    export function initBittrexApi() {
        bittrex.options({
            'apikey': apiKey,
            'apisecret': apiSecret,
            'secret': apiSecret
        });
    }

    const infinity = 1000000;
    const buyThreshold = 0.3;
    const refreshRate = 10; // in min

    let beginAmount = 0.010488;
    let last = 0.0765; // bought for this price
    let lastValue = 0;
    let topValue = last;
    let account = beginAmount;

    let isBought = false;
    let boughtAmount = 0;

    let minuteAverage = infinity;

    export async function submit() { 
        // bittrex.websockets.client(function() {
        //     console.log('Websocket connected');
        //     bittrex.websockets.subscribe(['BTC-XRP'], function(data) {
        //         console.log(data.M);
        //         if (data.M === 'updateExchangeState') {
        //         data.A.forEach(function(data_for) {
        //             console.log('Market Update for '+ data_for.MarketName, data_for);
        //         });
        //       }
        //     });
        //   });
    
        const balance = await getBalance();
        console.log(balance);
        console.log(typeof balance);
    
          bittrex.websockets.listen(function(data, client) {
            if (data.M === 'updateSummaryState') {
              data.A.forEach(function(data_for) {
                data_for.Deltas.forEach(function(marketsDelta) {
                    if (marketsDelta.MarketName === 'BTC-ETH') {
    
                        checkValue(marketsDelta.Last);
                        console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta.Last);
                    }
                });
              });
            }
          });
    }

    function percent(val: number, initValue: number): number {
        const a = (val * 100);
        return a / initValue;
    }

    function getGain(last: number, value: number): number {
        let x = value;
        let complete = last;

        if (last < value) {
            complete = value;
            x = last;
        }

        let delta = complete - x;
        const isMinus = last >= value;
        // delta *= ( isMinus ? 1 : -1 );
        // let percentage = (delta * 100) / last;
        let percentage = percent(delta, last);
        percentage *= (isMinus ? -1 : 1);
        return percentage;
    }

    function accountInfo() {
        console.log(`Account: ${account} BTC`);
        console.log(`Initial Account: ${beginAmount} BTC`);
        console.log(`Bougth ETH: ${boughtAmount} ETH\n`);
    }
    
    function checkValue(value: number) {
        console.log(`Actual: ${value}`);

        if (isBought) {
            const overallGain = getGain(last, value);
            if (lastValue !== value) {
                console.log(`Last: ${last}`);
                console.log(`Overall: ${overallGain.toFixed(2)} %`);
                const topGain = getGain(topValue, value);
                console.log(`Top value: ${topValue}`);
                console.log(`Top value gain: ${topGain} %`);
                console.log('\n');
                lastValue = value;

                if (overallGain < 0) {
                    sell(value);
                    return;
                }

                if (topGain < 0 && overallGain > 0) {
                    if ( (overallGain + topGain) < overallGain / 2 ) {
                        sell(value);
                        return;
                    } 
                    // else {
                    //     topValue = value; // reclasificate value to top, if overall gain is +, but topGain -, and loss is less than 1/2
                    // }
                }
                topValue = value > topValue ? value : topValue;
            }
        } else {
            const topGain = getGain(topValue, value);
            if (topGain > buyThreshold) {
                buy(value);
            }
            topValue = value;
        }    
    }

    async function getBalance(): Promise<any> {
        return new Promise((resolve, reject) => {
            // data.result.Available
            bittrex.getbalance({ currency: 'DCT' }, (data, err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(data.result.Available);
                resolve(data.result.Available);
            })
        }).catch(err => {
            console.log(err);
        });
    }

    function start() {
        setInterval(async () => {
            getTicker();
        }, refreshRate * 60 * 1000);
    }

    export function cyclicCheck() {

        const coinInteval = setInterval(async () => {            
            // to be sure to start with + gain, check every 10min if gain is +
            bittrex.getticker({ market: 'BTC-ETH' }, (ticker) => {
                console.log(`${new Date().toTimeString()} => ${ticker.result.Last}`);
                if (minuteAverage === infinity) {
                    minuteAverage = ticker.result.Last;
                } else {
                    const gain = getGain(minuteAverage, ticker.result.Last);
                    console.log(`${new Date().toTimeString()}10 minutes gain ${gain.toFixed(6)}`);
                    if (gain > buyThreshold) {
                        clearInterval(coinInteval);
                        buy(ticker.result.Last);
                        start();
                    } else {
                        minuteAverage = ticker.result.Last
                    }
                    
                }
            });
        }, 1000 * 60 * refreshRate);
    }
    
    function getTicker() {
        bittrex.getticker({ market: 'BTC-ETH' }, (ticker) => {
            if (ticker.result) {
                checkValue(ticker.result.Last);
            }
            // console.log(ticker.result.Last);
        });
    }

    function buy(price: number) {
        const amount = account / price;
        boughtAmount += amount;
        account = 0;
        topValue = price;
        last = price;
        isBought = true;
        console.log(`BUY`);
        accountInfo();
    }

    function sell(price: number) {
        account = boughtAmount * price;
        boughtAmount = 0;
        last = price;
        isBought = false;
        console.log(`SELL`);
        accountInfo();
    }

    // async function getCoinMarketInfo(): Promise<any> {
    //     const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=10';
    //     return new Promise((resolve, reject) => {
    //         // https.get(url, (res) => {
    //         //     resolve(res.json());
    //         // });

    //         request(url, {json: true}, (err, res, body) => {
    //             if (err) {
    //                 reject(err);
    //             }
    //             resolve(body);
    //         })
            
    //     });
    // }
}
