const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NotNewsModel = require('../models/not_news.model')
const NewsData = require('../models/nz_news.model')
const axios = require('axios');
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const util = require('util');

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
        if (NZNewsArray1[f].teaserImageUrl && NZNewsArray1[f].articleSource !== "STUFF") {
            NZNewsArray2.push(NZNewsArray1[f]);
        }
    }
    NZNewsArray2 = NZNewsArray2.slice(0, 20);
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
        return res.json({ status: 'error' })
    }
})

async function createAd() {
    let NZNewsArray = await getNZNews();
    let NotNewsArray = await getNotNews();

    const width = 1080;
    const height = 1550;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    // const post = {
    //     testTitle: "notebook1 notebook2 notebooks3 notebook4 notebook5 notebook6 notebook7"
    // }

    context.font = "bold 50pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#000000";

    let Yposition = 250;
    const lineHeight = 60;

    const randomNum = Math.floor(Math.random() * 18);
    await downloadImage(NZNewsArray[randomNum].teaserImageUrl, './Ads/teaserimage.png');

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
    context.fillText(NotNews[0], 100, Yposition, 900);
    if (NotNews[1]) context.fillText(NotNews[1], 100, Yposition + (lineHeight * 1), 900);
    if (NotNews[2]) context.fillText(NotNews[2], 100, Yposition + (lineHeight * 2), 900);
    //display source as per lines of text
    context.font = "bold 30pt 'PT Sans'";
    context.fillStyle = "#808080";
    if (NotNews[0] && !NotNews[1] && !NotNews[2]) {
        context.fillText(`${NotNewsArray[0].articleSource} || ${NotNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 1) + 30);
        Yposition = Yposition + (lineHeight * 1) + 100;
    }
    if (NotNews[0] && NotNews[1] && !NotNews[2]) {
        context.fillText(`${NotNewsArray[0].articleSource} || ${NotNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 2) + 30);
        Yposition = Yposition + (lineHeight * 2) + 100;
    }
    if (NotNews[0] && NotNews[1] && NotNews[2]) {
        context.fillText(`${NotNewsArray[0].articleSource} || ${NotNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 3) + 30);
        Yposition = Yposition + (lineHeight * 3) + 100;
    }

    //horizontal line
    context.fillStyle = "#d5d5d5";
    context.fillRect(30, Yposition, 1020, 10);
    Yposition = Yposition + 60;

    //NZ NEWS
    context.fillStyle = "#000000";
    context.font = "bold 50pt 'PT Sans'";
    const teaserImagePosition = {
        w2: 900,
        h2: 500,
        x2: 100,
        y2: Yposition,
    };
    Yposition = Yposition + 600;
    const NZNews = formatTitle(NZNewsArray[randomNum].articleTitle);
    // const NZNews = formatTitle(post.testTitle);
    context.fillText(NZNews[0], 100, Yposition, 900);
    if (NZNews[1]) context.fillText(NZNews[1], 100, Yposition + (lineHeight * 1), 900);
    if (NZNews[2]) context.fillText(NZNews[2], 100, Yposition + (lineHeight * 2), 900);
    //display source as per lines of text
    context.font = "bold 30pt 'PT Sans'";
    context.fillStyle = "#808080";
    if (NZNews[0] && !NZNews[1] && !NZNews[2]) {
        context.fillText(`${NZNewsArray[0].articleSource} || ${NZNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 1) + 30);
        Yposition = Yposition + (lineHeight * 1) + 100;
    }
    if (NZNews[0] && NZNews[1] && !NZNews[2]) {
        context.fillText(`${NZNewsArray[0].articleSource} || ${NZNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 2) + 30);
        Yposition = Yposition + (lineHeight * 2) + 100;
    }
    if (NZNews[0] && NZNews[1] && NZNews[2]) {
        context.fillText(`${NZNewsArray[0].articleSource} || ${NZNewsArray[0].articleAuthor}`, 100, Yposition + (lineHeight * 3) + 30);
        Yposition = Yposition + (lineHeight * 3) + 100;
    }


    loadImage("./Ads/teaserimage.png").then((image) => {
        const { w2, h2, x2, y2 } = teaserImagePosition;
        context.drawImage(image, x2, y2, w2, h2);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./Ads/twitteradimage.png", buffer);
    })

    loadImage("./Ads/adlogo.png").then((image) => {
        const { w, h, x, y } = logoImagePosition;
        context.drawImage(image, x, y, w, h);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./Ads/twitteradimage.png", buffer);
    });
    console.log('Twitter Ad created');
}

async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const writeFileAsync = util.promisify(fs.writeFile);
    await writeFileAsync(filename, response.data);

    console.log('Teaser Image downloaded');
}

function formatTitle(title) {
    let output = [];
    if (title.length >= 25) {
        const firstLine = getMaxNextLine(title);
        const secondLine = getMaxNextLine(firstLine.remainingChars);
        const thirdLine = getMaxNextLine(secondLine.remainingChars);
        output = [firstLine.line];

        let fmSecondLine = secondLine.line;
        let fmThirdLine = thirdLine.line;
        //if title is longer than 150 characters, add the ... character
        // if (thirdLine.remainingChars.length > 0) fmThirdLine += " ...";
        output.push(fmSecondLine);
        output.push(fmThirdLine);
    }
    // If 20 characters or longer, add the entire second line, using a max of half
    // the characters, making the first line always slightly shorter than the
    // second.
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

function getMaxNextLine(input, maxChars = 25) {
    const allWords = input.split(" ");
    const lineIndex = allWords.reduce((prev, cur, index) => {
        if (prev?.done) return prev;
        const endLastWord = prev?.position || 0;
        const position = endLastWord + 1 + cur.length;
        return position >= maxChars ? { done: true, index } : { position, index };
    });

    const line = allWords.slice(0, lineIndex.index).join(" ");
    const remainingChars = allWords.slice(lineIndex.index).join(" ");
    // console.log(lineIndex.index + " line---> " + line, " rem---> " + remainingChars)
    return { line, remainingChars };
};
// https://blog.logrocket.com/creating-saving-images-node-canvas/

module.exports = router;