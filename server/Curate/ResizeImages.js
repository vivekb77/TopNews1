// https://api.imageresizer.io/v1/images?key=245e3a1588bbdaa173f40624ef424a38e76589f4&url=https://www.nzherald.co.nz/resizer/PBnsRNaQMJVGxO2HG-wYXVTZNOk=/300x300/smart/filters:quality(70)/cloudfront-ap-southeast-2.images.arcpublishing.com/nzme/P7PKN7XKRFGDPB2IYNSW6Z3HPM.jpg
// https://newsexpress.imageresizer.io/fI0SSiP5l2?size=1240x700&format=webp&quality=100

const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const axios = require('axios');

router.post('/ResizeImages', async (req, res) => {

    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone
    let imageResizerKey = "245e3a1588bbdaa173f40624ef424a38e76589f4";
    let reSizedImageId;
    let articleId;
    let countOfImagesResized = 0;

    let Articles = [];
    Articles = await NewsData.find({
        displayOnFE: true,
        articleSource: 'NZ Herald',
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }
    });

    for (let i = 0; i < Articles.length; i++) {

        //only add image if already not added to imageresizer
        if (!Articles[i].resizedImageUrl && Articles[i].teaserImageUrl) {
            const req = await fetch(`https://api.imageresizer.io/v1/images?key=${imageResizerKey}&url=${Articles[i].teaserImageUrl}`, {
                method: 'GET'
            })
            const data = await req.json()

            if (data.success == true) {
                articleId = Articles[i]._id
                reSizedImageId = data.response.id

                try {
                    updatedDoc = await NewsData.findByIdAndUpdate(articleId, { $set: { resizedImageUrl: reSizedImageId } }, { new: true });
                    countOfImagesResized++;
                } catch (error) {
                    console.log(`Could not add resized image url to DB at round ${i}`);
                }
            }
        }
    }
    return res.json({ status: 'ok', message: `Added ${countOfImagesResized} resized image url to DB` });
});

module.exports = router;