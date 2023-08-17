const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const NewsDataAU = require('../models/au_news.model')
const NewsDataWorld = require('../models/world_news.model')
const UserData = require('../models/user.model')
const axios = require('axios');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


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
       
        if (!updatedDoc) {
            return res.json({ status: 'error', message: 'Article not found' });
        }

        return res.json({ status: 'ok', displayOnFE: updatedDoc.displayOnFE });
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', message: 'An error occurred' });
    }

})


//auto remove duplicate titled articles
router.post('/cronremoveDuplicateTitles', async (req, res) => {
    
    const updatedDisplayOnFE = "false";
    let removedDuplicateArticlesCount = 0;
    let skippedDuplicateArticlesCount = 0;

    // let DBsToCheckArticles = ["NZ","AU","WORLD"];
    let DBsToCheckArticles = ["NZ"]; //lets do for NZ now as cron job times out
    
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone
    let ArticlesArray = [];

    for(i=0;i<DBsToCheckArticles.length;i++)
    {
        if(DBsToCheckArticles[i] == "NZ"){
            ArticlesArray = await NewsData.find({
                displayOnFE: true,
                articlePublicationDate: {
                    $gte: currentDate,
                    $lt: moment(currentDate).add(1, 'day').toDate()
                    }
            })
        }
        if(DBsToCheckArticles[i] == "AU"){
            ArticlesArray = await NewsDataAU.find({
                displayOnFE: true,
                articlePublicationDate: {
                    $gte: currentDate,
                    $lt: moment(currentDate).add(1, 'day').toDate()
                    }
            })
        }
        if(DBsToCheckArticles[i] == "WORLD"){
            ArticlesArray = await NewsDataWorld.find({
                displayOnFE: true,
                articlePublicationDate: {
                    $gte: currentDate,
                    $lt: moment(currentDate).add(1, 'day').toDate()
                    }
            })
        }
        //remove duplicates
        const uniqueTitles = new Set();
        const duplicateTitles = [];

        await ArticlesArray.forEach(article => {
            if (uniqueTitles.has(article.articleTitle)) {
            duplicateTitles.push(article._id); // Store the _id of the duplicate document
            removedDuplicateArticlesCount++;
            } else {
            uniqueTitles.add(article.articleTitle);
            skippedDuplicateArticlesCount++; 
            }
        });
        
        if (duplicateTitles.length > 0) {
            try{
                await NewsData.updateMany({ _id: { $in: duplicateTitles } }, { $set: { displayOnFE: updatedDisplayOnFE } }, { new: true });
            }
            catch(err){
                return res.json({ status: 'error' , message : "Error in removing duplicates"})
            }
        }
        return res.json({ status: 'ok', removedDuplicateArticlesCount:removedDuplicateArticlesCount, skippedDuplicateArticlesCount:skippedDuplicateArticlesCount });
        
    }

})
module.exports = router;