const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NotNewsModel = require('../models/not_news.model')
const NewsData = require('../models/nz_news.model')
const axios = require('axios');
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const util = require('util');

const options = {
    day: '2-digit',
    month: 'short',
    // year: '2-digit', 
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Pacific/Auckland'
};

async function getNotNews() {
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate();
    let NotNewsArray = [];
    NotNewsArray = await NotNewsModel.find({
        displayOnFE: true,
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }
    })
    NotNewsArray.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)
    NotNewsArray = NotNewsArray.slice(0, 20);

    for (let f = 0; f < NotNewsArray.length; f++) {
        const inputDate = new Date(NotNewsArray[f].articlePublicationDate);

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
        NotNewsArray[f].articleAuthor = formattedDate;
    }
    return NotNewsArray;
}

async function getNZNews() {
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate();
    let NZNewsArray1 = [];
    let NZNewsArray2 = [];
    NZNewsArray1 = await NewsData.find({
        displayOnFE: true,
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }
    })

    NZNewsArray1.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)

    //remove articles with no teaserImageUrl, because we need an image for ad
    for (let f = 0; f < NZNewsArray1.length; f++) {
        if (NZNewsArray1[f].teaserImageUrl) {
            NZNewsArray2.push(NZNewsArray1[f]);
        }
    }
    NZNewsArray2 = NZNewsArray2.slice(0, 20);

    //get HD image for stuff
    for (let m = 0; m < NZNewsArray2.length; m++) {
        let teaserImageUrl
        if (NZNewsArray2[m].articleSource === "STUFF") {
            const teaserImageUrlSpliturlArray = NZNewsArray2[m].teaserImageUrl.split(".");
            let teaserImageUrlSpliturlArraySliced = teaserImageUrlSpliturlArray.slice(0, 4);
            teaserImageUrl = `${teaserImageUrlSpliturlArraySliced.join(".")}.related.StuffLandscapeSixteenByNine.1420x800.${teaserImageUrlSpliturlArray[7]}.${teaserImageUrlSpliturlArray[8]}.jpg?format=pjpg&optimize=medium`;
        }
        else {
            teaserImageUrl = NZNewsArray2[m].teaserImageUrl;
        }
        NZNewsArray2[m].teaserImageUrl = teaserImageUrl;
    }

    for (let f = 0; f < NZNewsArray2.length; f++) {
        const inputDate = new Date(NZNewsArray2[f].articlePublicationDate);

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
        NZNewsArray2[f].articleAuthor = formattedDate;
    }
    return NZNewsArray2;
}

router.post('/CreateAd', async (req, res) => {
    try {
        await createAd();
        return res.json({ status: 'ok' })
    } catch (err) {
        return res.json({ status: 'error', message: err.message })
    }
})

async function createAd() {
    let NZNewsArray = await getNZNews();
    let NotNewsArray = await getNotNews();
    const formattedDate = new Date().toLocaleDateString('en-US', options);

    const width = 1080;
    let height = 1650;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    const post = {
        testTitle: "Labour still protecting the status quo",
    }

    context.font = "bold 50pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#000000";

    let Yposition = 250;
    const lineHeight = 70;

    const randomNum = Math.floor(Math.random() * 18);
    await downloadImage(NZNewsArray[randomNum].teaserImageUrl, './teaserimage.png');

    //LOGO
    const logoImagePosition = {
        w: 900,
        h: 220,
        x: 90,
        y: 20,
    };

    //horizontal line
    context.fillStyle = "#d5d5d5";
    context.fillRect(30, Yposition, 1020, 10);
    Yposition = Yposition + 100;
    context.fillStyle = "#000000";

    //!NEWS
    const NotNews = formatTitle(NotNewsArray[randomNum].articleTitle);
    // const NotNews = formatTitle(post.testTitle);
    context.fillText(NotNews[0], 80, Yposition, 900);
    if (NotNews[1]) context.fillText(NotNews[1], 80, Yposition + (lineHeight * 1), 900);
    if (NotNews[2]) context.fillText(NotNews[2], 80, Yposition + (lineHeight * 2), 900);
    //display source as per lines of text
    context.font = "bold 30pt 'PT Sans'";
    context.fillStyle = "#808080";
    if (NotNews[0] && !NotNews[1] && !NotNews[2]) {
        context.fillText(`${NotNewsArray[randomNum].articleSource} || ${NotNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 1) + 30);
        Yposition = Yposition + (lineHeight * 1) + 90;
    }
    if (NotNews[0] && NotNews[1] && !NotNews[2]) {
        context.fillText(`${NotNewsArray[randomNum].articleSource} || ${NotNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 2) + 30);
        Yposition = Yposition + (lineHeight * 2) + 90;
    }
    if (NotNews[0] && NotNews[1] && NotNews[2]) {
        context.fillText(`${NotNewsArray[randomNum].articleSource} || ${NotNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 3) + 30);
        Yposition = Yposition + (lineHeight * 3) + 90;
    }

    //horizontal line
    context.fillStyle = "#d5d5d5";
    context.fillRect(30, Yposition, 1020, 10);
    Yposition = Yposition + 60;

    //NZ NEWS
    context.fillStyle = "#000000";
    context.font = "bold 50pt 'PT Sans'";
    const teaserImagePosition = {
        w2: 920,
        h2: 500,
        x2: 80,
        y2: Yposition,
    };
    Yposition = Yposition + 600;
    const NZNews = formatTitle(NZNewsArray[randomNum].articleTitle);
    context.fillText(NZNews[0], 80, Yposition, 900);
    if (NZNews[1]) context.fillText(NZNews[1], 80, Yposition + (lineHeight * 1), 900);
    if (NZNews[2]) context.fillText(NZNews[2], 80, Yposition + (lineHeight * 2), 900);
    //display source as per lines of text
    context.font = "bold 30pt 'PT Sans'";
    context.fillStyle = "#808080";
    if (NZNews[0] && !NZNews[1] && !NZNews[2]) {
        context.fillText(`${NZNewsArray[randomNum].articleSource} || ${NZNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 1) + 30);
        Yposition = Yposition + (lineHeight * 1) + 100;
    }
    if (NZNews[0] && NZNews[1] && !NZNews[2]) {
        context.fillText(`${NZNewsArray[randomNum].articleSource} || ${NZNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 2) + 30);
        Yposition = Yposition + (lineHeight * 2) + 100;
    }
    if (NZNews[0] && NZNews[1] && NZNews[2]) {
        context.fillText(`${NZNewsArray[randomNum].articleSource} || ${NZNewsArray[randomNum].articleAuthor}`, 80, Yposition + (lineHeight * 3) + 30);
        Yposition = Yposition + (lineHeight * 3) + 100;
    }

    //Credits
    context.fillStyle = "#808080";
    context.font = "bold 15pt 'PT Sans'";
    context.fillText(`@NewsExpressNZ || ${formattedDate}`, 700, Yposition);

    loadImage("./teaserimage.png").then((image) => {
        const { w2, h2, x2, y2 } = teaserImagePosition;
        context.drawImage(image, x2, y2, w2, h2);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./twitteradimage.png", buffer);
    })

    loadImage("./adlogo.png").then((image) => {
        const { w, h, x, y } = logoImagePosition;
        context.drawImage(image, x, y, w, h);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./twitteradimage.png", buffer);
    });
    console.log('Twitter Ad image created');
}

async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const writeFileAsync = util.promisify(fs.writeFile);
    await writeFileAsync(filename, response.data);

    console.log('Teaser Image downloaded');
}

function formatTitle(title) {
    let output = [];
    if (title.length >= 30) {
        const firstLine = getMaxNextLine(title);
        const secondLine = getMaxNextLine(firstLine.remainingChars);
        const thirdLine = getMaxNextLine(secondLine.remainingChars);
        output = [firstLine.line];
        let fmSecondLine = [secondLine.line];
        output.push(fmSecondLine);

        let fmThirdLine = [thirdLine.line];
        //if title is longer than x characters, add the ... character
        if (thirdLine.remainingChars.length > 0) fmThirdLine += " ...";

        output.push(fmThirdLine);
    }

    else if (title.length >= 10) {
        const firstLine = getMaxNextLine(title);
        output = [firstLine.line, firstLine.remainingChars];
    }
    // Otherwise, return the short title.
    else {
        output = [title];
    }

    return output;
};

function getMaxNextLine(input, maxChars = 30) {
    const allWords = input.split(" ");
    const lineIndex = allWords.reduce((prev, cur, index) => {
        if (prev?.done) return prev;
        const endLastWord = prev?.position || 0;
        const position = endLastWord + 1 + cur.length; //+1 is to count space
        if (position >= maxChars) {
            return { done: true, index };
        } else {
            //issue - last word is selected twice
            index = index + 1; //FIX if chars are less than maxChars, need to add 1 to index or it will be selected in remaining characters
            return { position, index };
        }
    });

    const line = allWords.slice(0, lineIndex.index).join(" ");
    let remainingChars;
    // FIX  if only one word, select nothing here because it is already selected above
    if (allWords.length == 1) {
        remainingChars = allWords.slice(1).join(" ");
    } else {
        remainingChars = allWords.slice(lineIndex.index).join(" ");
    }
    return { line, remainingChars };
};
// https://blog.logrocket.com/creating-saving-images-node-canvas/

module.exports = router;