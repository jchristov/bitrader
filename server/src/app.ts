import { Trader } from './trader/trader';
import { BittrexService } from './service/bittrex.service';
import { Account } from './model/account';


const traderService = new BittrexService();
const account = new Account(0.01);
const trader = new Trader(traderService, account);

trader.getTicker()
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));