import * as request from 'request';

export class Http {
    static get(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            request(url, {json: true}, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                resolve(body);
            })
        })
    }
}