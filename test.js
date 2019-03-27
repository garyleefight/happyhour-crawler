const cheerio = require('cheerio');
const superagent = require('superagent');
const url = require('url');
const fs = require('fs');




exports.crawlHandler = function (event, context, callback) {
    try {
        const header = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Cookie': 'session-id=143-6757255-9625101; ubid-main=131-3869253-5810040; skin=noskin; i18n-prefs=USD; x-wl-uid=1aUtcfQgsvHqx+ItE73KBXb/wuS862OqnH+YH2CueSWO7yGT3RPlp3PA73lRIJJf7VVCK62bbAXA=; s_fid=5AEAE171F602C369-3EB306A53740D0E2; s_vn=1585185447255%26vn%3D1; regStatus=pre-register; c_m=undefinedwww.google.comSearch%20Engine; s_cc=true; s_dslv=1553651104590; s_nr=1553651104596-New; aws-ubid-main=383-3244585-7108574; aws-target-static-id=1553651319867-257951; aws-target-data=%7B%22support%22%3A%221%22%7D; aws-target-visitor-id=1553651319872-594250.28_82; aws-userInfo=%7B%22arn%22%3A%22arn%3Aaws%3Asts%3A%3A382786123233%3Aassumed-role%2FAdmin%2Flisirui-Isengard%22%2C%22alias%22%3A%22lisirui%22%2C%22username%22%3A%22assumed-role%2FAdmin%2Flisirui-Isengard%22%2C%22keybase%22%3A%22%22%2C%22issuer%22%3A%22https%3A%2F%2Fisengard.amazon.com%2Ffederate%3Faccount%5Cu003d382786123233%5Cu0026role%5Cu003dAdmin%5Cu0026destination%5Cu003d%22%7D; aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-mkto-trk=id%3A112-TZM-766%26token%3A_mch-aws.amazon.com-1553544249616-92674; aws_lang=en; csm-hit=tb:s-6K1277V9BYZCZBEH9E6E|1553658553430&t:1553658553994&adb:adblk_no; session-token=jc9VrC0Whn/u7t+KYcwDALfhtELyJlV6eQGrvIrW/7B6X+srhWCCHjM3SFz6t9iUMA5FUKbISjyf7HTvvrY06P+/4aVThdnuLcaILNoTLd3rp+kXCxwi6TgN3Jf2QdL7DSYG7eX3iRaXG2b065KQU68ExwAGmZoxT/t6En3yviiHqzIeZNUPZWb5gVDOtFSD; session-id-time=2082758401l'
        };
        const request = event;
        console.log(request);
        if (request && request.prodUrl) {
            const targetUrl = request.prodUrl;
            validateUrl(targetUrl);
            superagent.get(targetUrl).set(header).end((err, res) => {
                if (err) {
                    throw Error('failed to get image');
                }
                let $ = cheerio.load(res.text);
                const imgLink = $('body #imgTagWrapperId img').attr('data-old-hires');
                const name = $('body #imgTagWrapperId img').attr('alt');
                const price = $('body #priceblock_ourprice').text();
                console.log('img:' + imgLink);
                console.log('price:' + price);
                const result = {
                    price,
                    imgLink,
                    name
                }
                console.log(result);
                callback(null,result.toString());
            });
        } else {
            throw Error('Invalid request');
        }
    } catch (e) {
        callback(e);
    }


}

const validateUrl = (requestUrl) => {
    const expectedHost = 'primenow.amazon.com';
    const prefix = 'dp';
    const result = url.parse(requestUrl);
    const pathArray = result.pathname.split('/');
    const host = result.host;
    if (expectedHost === host && pathArray.length === 3 && pathArray[1] === prefix) {
        return;
    }
    throw Error('Fail to parse url');
}

