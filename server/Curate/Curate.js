const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const NewsDataAU = require('../models/au_news.model')
const NewsDataWorld = require('../models/world_news.model')
const NotNewsModel = require('../models/not_news.model')

router.post('/curateNews', async (req, res) => {

    let providerToPullNews = req.body.providerToPullNews.trim();

    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone

    let NewsToday = [];
    let NewsYesterday = [];

    //NZ
    if (providerToPullNews === "NZ") {
        NewsToday = await NewsData.find({
            // displayOnFE: true,
            articlePublicationDate: {
                $gte: currentDate,
                $lt: moment(currentDate).add(1, 'day').toDate()
            }

        })

        //if total news articles today are less than 20, pull yesterdays articles and add
        if (NewsToday.length < 100) {

            NewsYesterday = await NewsData.find({
                //    displayOnFE: true,
                articlePublicationDate: {
                    $lt: moment(currentDate).add(0, 'day').toDate(),
                }

            })
            for (let z = 0; z < NewsYesterday.length; z++) {
                NewsToday.push(NewsYesterday[z]);
            }
        }
    }

    //AU
    if (providerToPullNews === "AU") {
    NewsToday = await NewsDataAU.find({
        // displayOnFE: true,
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }

    })

    //if total news articles today are less than 20, pull yesterdays articles and add
    if (NewsToday.length < 100) {

        NewsYesterday = await NewsDataAU.find({
            //    displayOnFE: true,
            articlePublicationDate: {
                $lt: moment(currentDate).add(0, 'day').toDate(),
            }

        })
        for (let z = 0; z < NewsYesterday.length; z++) {
            NewsToday.push(NewsYesterday[z]);
        }
    }
    }

    //WORLD
    if (providerToPullNews === "WORLD") {
    NewsToday = await NewsDataWorld.find({
        // displayOnFE: true,
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }

    })

    //if total news articles today are less than 20, pull yesterdays articles and add
    if (NewsToday.length < 100) {

        NewsYesterday = await NewsDataWorld.find({
            //    displayOnFE: true,
            articlePublicationDate: {
                $lt: moment(currentDate).add(0, 'day').toDate(),
            }

        })
        for (let z = 0; z < NewsYesterday.length; z++) {
            NewsToday.push(NewsYesterday[z]);
        }
    }
    }

     //NOT NEWS
     if (providerToPullNews === "!NEWS") {
        NewsToday = await NotNewsModel.find({
            // displayOnFE: true,
            articlePublicationDate: {
                $gte: currentDate,
                $lt: moment(currentDate).add(1, 'day').toDate()
            }
    
        })
    
        //if total news articles today are less than 20, pull yesterdays articles and add
        if (NewsToday.length < 100) {
    
            NewsYesterday = await NotNewsModel.find({
                //    displayOnFE: true,
                articlePublicationDate: {
                    $lt: moment(currentDate).add(0, 'day').toDate(),
                }
    
            })
            for (let z = 0; z < NewsYesterday.length; z++) {
                NewsToday.push(NewsYesterday[z]);
            }
        }
        }

    if (NewsToday.length > 0) {
        //sort the array by date
        NewsToday.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)
        NewsToday = NewsToday.slice(0, 100);

        for (let f = 0; f < NewsToday.length; f++) {
            const inputDate = new Date(NewsToday[f].articlePublicationDate);

            const options = {
                day: '2-digit',
                month: 'short',
                // year: '2-digit', 
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Pacific/Auckland'
            };
            const formattedDate = inputDate.toLocaleDateString('en-US', options);
            NewsToday[f].articleAuthor = formattedDate; //updating author field as new date is of string type can t reassign to date fields
        }
        return res.json({ status: 'ok', news: NewsToday })
    } else {
        return res.json({ status: 'error', errormessage: 'Something went wrong' })
    }

})
router.post('/deleteNews', async (req, res) => {

    let dbid = req.body.dbid.trim();
    let displayOnFE = req.body.displayOnFE;
    let whichcontinent = req.body.whichcontinent;

    try {
        const updatedDisplayOnFE = !displayOnFE;
        let updatedDoc = "";

        if(whichcontinent === "NZ"){
            updatedDoc = await NewsData.findByIdAndUpdate(dbid, { $set: { displayOnFE: updatedDisplayOnFE } }, { new: true });
        }
        if(whichcontinent === "AU"){
            updatedDoc = await NewsDataAU.findByIdAndUpdate(dbid, { $set: { displayOnFE: updatedDisplayOnFE } }, { new: true });
        }
        if(whichcontinent === "WORLD"){
            updatedDoc = await NewsDataWorld.findByIdAndUpdate(dbid, { $set: { displayOnFE: updatedDisplayOnFE } }, { new: true });
        }
        if(whichcontinent === "!NEWS"){
            updatedDoc = await NotNewsModel.findByIdAndUpdate(dbid, { $set: { displayOnFE: updatedDisplayOnFE } }, { new: true });
        }
       
        if (!updatedDoc) {
            return res.json({ status: 'error', message: 'Article not found' });
        }

        return res.json({ status: 'ok', displayOnFE: updatedDoc.displayOnFE });
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', message: 'An error occurred' });
    }

})
router.post('/addClickCount', async (req, res) => {

    let dbid = req.body.dbid.trim();
    let whichcontinent = req.body.whichcontinent;

    try {
        let updatedDoc = "";

        if(whichcontinent === "NZ"){
            updatedDoc = await NewsData.findByIdAndUpdate(dbid, { $inc: { clickCount: 1 } }, { new: true });
        }
        if(whichcontinent === "AU"){
            updatedDoc = await NewsDataAU.findByIdAndUpdate(dbid, { $inc: { clickCount: 1 } }, { new: true });
        }
        if(whichcontinent === "WORLD"){
            updatedDoc = await NewsDataWorld.findByIdAndUpdate(dbid, { $inc: { clickCount: 1 } }, { new: true });
        }
        if(whichcontinent === "NOTNEWS"){
            updatedDoc = await NotNewsModel.findByIdAndUpdate(dbid, { $inc: { clickCount: 1 } }, { new: true });
        }
       
        if (!updatedDoc) {
            return res.json({ status: 'error', message: 'Article not found' });
        }

        return res.json({ status: 'ok', clickCount: updatedDoc.clickCount });
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', message: 'An error occurred' });
    }

})
module.exports = router;