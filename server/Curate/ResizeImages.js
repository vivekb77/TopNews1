// https://api.imageresizer.io/v1/images?key=245e3a1588bbdaa173f40624ef424a38e76589f4&url=https://www.nzherald.co.nz/resizer/PBnsRNaQMJVGxO2HG-wYXVTZNOk=/300x300/smart/filters:quality(70)/cloudfront-ap-southeast-2.images.arcpublishing.com/nzme/P7PKN7XKRFGDPB2IYNSW6Z3HPM.jpg
// https://newsexpress.imageresizer.io/fI0SSiP5l2?size=1240x700&format=webp&quality=100

const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const axios = require('axios');

router.post('/ResizeImages', async (req, res) => {
//pass the articleSource in post body to resize image for the source
    if (req.headers['authorization'] === 'Basic bmV3c2V4cHJlc3M6wqM1MHIwQDc9b1FYOQ==') {

        const articleSource = req.body.articleSource;

        const timeZone = 'Pacific/Auckland';
        const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone
        let imageResizerKey = "245e3a1588bbdaa173f40624ef424a38e76589f4";
        let reSizedImageId;
        let articleId;
        let countOfImagesResized = 0;
        let countOfImagesSkippedResized = 0;

        let Articles = [];
        Articles = await NewsData.find({
            displayOnFE: true,
            articleSource: articleSource,
            articlePublicationDate: {
                $gte: currentDate,
                $lt: moment(currentDate).add(1, 'day').toDate()
            }
        });

        for (let i = 0; i < Articles.length; i++) {

            //only add image if already not added to imageresizer
            if (!Articles[i].resizedImageUrl && Articles[i].teaserImageUrl) {
                try {
                    const req = await axios.get(`https://api.imageresizer.io/v1/images?key=${imageResizerKey}&url=${Articles[i].teaserImageUrl}`);

                    if (req.data.success == true) {
                        articleId = Articles[i]._id
                        reSizedImageId = req.data.response.id

                        updatedDoc = await NewsData.findByIdAndUpdate(articleId, { $set: { resizedImageUrl: reSizedImageId } }, { new: true });
                        countOfImagesResized++;
                    }
                } catch (error) {
                    console.log(`Could not add resized image url to DB at round ${i} , Error is ${error.message}`);
                }
            } else {
                countOfImagesSkippedResized++;
            }
        }
        return res.json({ status: 'ok', message: `Added ${countOfImagesResized} resized image url to DB, skipped ${countOfImagesSkippedResized} for ${req.body.articleSource}` });
    } else {
        return res.json({ status: 'error', message: `Invalid user` });
    }
});

module.exports = router;