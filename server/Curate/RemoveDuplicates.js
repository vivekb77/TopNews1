const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const NewsDataAU = require('../models/au_news.model')
const NewsDataWorld = require('../models/world_news.model')
const NotNewsModel = require('../models/not_news.model')

//auto remove duplicate titled articles
router.post('/removeDuplicateTitles', async (req, res) => {
    
    let removedDuplicateArticlesCount = 0;
    let skippedDuplicateArticlesCount = 0;

    let DBsToCheckArticles = ["NZ","AU","WORLD","!NEWS"];
    
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
        if(DBsToCheckArticles[i] == "!NEWS"){
            ArticlesArray = await NotNewsModel.find({
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
                if(DBsToCheckArticles[i] == "NZ"){
                    await NewsData.updateMany({ _id: { $in: duplicateTitles } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "AU"){
                    await NewsDataAU.updateMany({ _id: { $in: duplicateTitles } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "WORLD"){
                    await NewsDataWorld.updateMany({ _id: { $in: duplicateTitles } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "!NEWS"){
                    await NotNewsModel.updateMany({ _id: { $in: duplicateTitles } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
            }
            catch(err){
                return res.json({ status: 'error' , message : "Error in removing duplicates"})
            }
        }
    }
    return res.json({ status: 'ok', removedDuplicateArticlesCount:removedDuplicateArticlesCount, skippedDuplicateArticlesCount:skippedDuplicateArticlesCount });
})
module.exports = router;