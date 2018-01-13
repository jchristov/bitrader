import {BittrexService} from './trader/bittrex.service';

BittrexService.initBittrexApi();
// BittrexService.submit();
BittrexService.cyclicCheck()