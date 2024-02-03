const axios = require('axios');

(async () => {
    try {
        for (let i = 0; true; i++) {
            let resp =  await axios.get('https://www.poonampandeyisalive.com/')
            console.log("hi", resp.status, i);
        }
    } catch (e) {
        console.log(e);
    }
})()