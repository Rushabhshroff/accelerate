const IAP = require('./src/utils/iap')
const { iap } = require('./src/config.json')
IAP.verifyPayment('google', {
    receipt: " ",
    productId: "com.cryvis.stockexchangegame.premium03",
    packageName: "com.cryvis.stockexchangegame",
    subscription: true,
    keyObject: iap
}, (err, res) => {
    if(err){
        console.log(err);
    }
    
})
