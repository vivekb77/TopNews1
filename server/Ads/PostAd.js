const express = require('express')
const router = express.Router()


router.post('/PostAd', async (req, res) => {
    try {
        await postAd();
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error' })
    }
})

async function postAd() {

}

module.exports = router;