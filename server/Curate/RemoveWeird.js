const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsData = require('../models/nz_news.model')
const NewsDataAU = require('../models/au_news.model')
const NewsDataWorld = require('../models/world_news.model')
const NotNewsModel = require('../models/not_news.model')

//remove articles which have specific words
router.post('/removeWeirdArticles', async (req, res) => {
    
    let removedWeirdArticlesCount = 0;
    let skippedWeirdArticlesCount = 0;

    let DBsToCheckArticles = ["NZ","AU","WORLD","!NEWS"];
    let MongoModalNames = ["NewsData","NewsDataAU","NewsDataWorld","NotNewsModel"];
    
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
        //remove articles which have these words death,died, crash,crashes
        const notWeirdArticles =[];
        const weirdArticles = [];
        const weirdArticleIds = [];

        await ArticlesArray.forEach(article => {
            if (article.articleTitle.toLowerCase().includes('death') || article.articleTitle.toLowerCase().includes('edition') || article.articleTitle.toLowerCase().includes('died') || article.articleTitle.toLowerCase().includes('quiz') || article.articleTitle.toLowerCase().includes('crash') || article.articleTitle.toLowerCase().includes('crashes') || article.articleTitle.toLowerCase().includes('dead') || article.articleTitle.toLowerCase().includes('die') || article.articleTitle.toLowerCase().includes('debate') || article.articleTitle.toLowerCase().includes('open mike') || article.articleTitle.toLowerCase().includes('caption competition') || article.articleTitle.toLowerCase().includes('daily review') || article.articleTitle.toLowerCase().includes('have your say') || article.articleTitle.toLowerCase().includes('injured') || article.articleTitle.toLowerCase().includes('arrest')){
                weirdArticleIds.push(article._id); // Store the _id of the weird article
                // weirdArticles.push(article.articleTitle); //just to print
            removedWeirdArticlesCount++;
            } else {
                // notWeirdArticles.push(article.articleTitle); //just to print
                skippedWeirdArticlesCount++; 
            }
        });

        if (weirdArticleIds.length > 0) {
            try{
                if(DBsToCheckArticles[i] == "NZ"){
                    await NewsData.updateMany({ _id: { $in: weirdArticleIds } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "AU"){
                    await NewsDataAU.updateMany({ _id: { $in: weirdArticleIds } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "WORLD"){
                    await NewsDataWorld.updateMany({ _id: { $in: weirdArticleIds } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
                if(DBsToCheckArticles[i] == "!NEWS"){
                    await NotNewsModel.updateMany({ _id: { $in: weirdArticleIds } }, { $set: { displayOnFE: 'false' } }, { new: true });
                }
            }
            catch(err){
                console.log(err);
                return res.json({ status: 'error' , message : "Error in removing weird articles"})
            }
        }
    }
    return res.json({ status: 'ok', removedWeirdArticlesCount:removedWeirdArticlesCount, skippedWeirdArticlesCount:skippedWeirdArticlesCount });
})
module.exports = router;