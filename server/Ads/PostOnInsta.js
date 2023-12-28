const express = require('express')
const router = express.Router()
const axios = require('axios');
const fs = require('fs');

const shortLivedAccessToken = 'EAAFgkJpMGDABOy1K2dGMf6HisB8WEye3eCViQviI2xZAq4E357bxQ5QjCUF5B0HzPaeBBO96AeZCjIZB9lOnL7ImjnpIY2k4YkuZAwBfQVXXlwljfT7O8LMSABAGmZBL7X0DqJoiZBfAaFpTLk96X26qUXqAS1WZBr3Ec68EOCzdq0xo4Dm340hZAbmPrDFulAT0wFypEMVMUcQDatOgSNBjWwKuBAq4OXN2WNltOacZD'; //get this from fb dev acount
const instagram_business_account_id = '17841463474746520';
let longLivedAccessToken = 'EAAFgkJpMGDABO6fo5IOqbFIsw8g88GeZCn5riigPtL1FtwiljzjuQcTLUensnXpUnunuLTEdUS1xz8RcfdZBrP2xUHxH0uUNXwiZBvPLpnzwClWUiJ4WR6VMk9WwyTt8rzoeLaTCr5UpfnHnMZAFNlQWHXIBgguf0b1T6QYWq03C4vKZAs4t2ocffZAASIpgVTcUsmIKfO'; // replace every 60 days
const imageResizerKey = "245e3a1588bbdaa173f40624ef424a38e76589f4";

router.post('/PostOnInsta', async (req, res) => {

    if (req.headers['authorization'] === 'Basic bmV3c2V4cHJlc3M6wqM1MHIwQDc9b1FYOQ==') {

        const upload_or_post_image = req.body.upload_or_post_image;
        const image_name_or_id = req.body.image_name_or_id;

        try {
            //only post from 7am to 11pm
            const currentTimeUTC = new Date();
            const nztOffset = 13 * 60;
            const currentTimeNZT = new Date(currentTimeUTC.getTime() + nztOffset * 60 * 1000);
            const startTimeNZT = new Date(currentTimeNZT);
            startTimeNZT.setHours(6, 55, 0);
            const endTimeNZT = new Date(currentTimeNZT);
            endTimeNZT.setHours(23, 5, 0);
            if (currentTimeNZT >= startTimeNZT && currentTimeNZT <= endTimeNZT) {

                if (upload_or_post_image === "uploadImage") {
                    console.log("Uploading image to image resizer");
                    const image_id = await uploadImageToImageResizer(image_name_or_id);
                    if (image_id) {
                        return res.json({ status: "ok", message: `Uploaded image to Image Resizer`, image_id: image_id, uploaded_at: currentTimeNZT })
                    } else {
                        return res.json({ status: `error`, message: `Uploaded image to Image Resizer failed`, upload_tried_at: currentTimeNZT })
                    }
                } else if (upload_or_post_image === "postImage") {
                    console.log("Posting image to Insta");
                    var currentHour = new Date().getHours();
                    let postsuccessfail;
                    if (currentHour % 2 === 0) {
                        postsuccessfail =  await InstaPostAPost(image_name_or_id);
                        await ImageResizerDeleteImage(image_name_or_id);
                    } else {
                        postsuccessfail = await InstaPostAStory(image_name_or_id);
                        // postsuccessfail = await PostAReel();
                        await ImageResizerDeleteImage(image_name_or_id);
                    }
                    if (postsuccessfail) {
                        return res.json({ status: "ok", message: "Posted image to Insta", posted_at: currentTimeNZT })
                    } else {
                        return res.json({ status: "error", message: "Not posted image to Insta", post_tried_at: currentTimeNZT })
                    }
                } else {
                    console.log("Not uploaded or posted. Valid values are uploadImage or postImage");
                    return res.json({ status: 'error', message: `Not uploaded or posted. Valid values are uploadImage or postImage ` + currentTimeNZT })
                }
            } else {
                console.log("Skipping uploading or posting on Insta: " + currentTimeNZT);
                return res.json({ status: 'ok', message: "Skipped posting or uploading on Insta: " + currentTimeNZT })
            }
        } catch (err) {
            console.log(err);
            return res.json({ status: 'error', message: err.message })
        }
    } else {
        return res.json({ status: 'error', message: `Invalid user` });
    }
})

//to upload image to insta, url is needed , cant upload from local storage, here we upload image created by createAd.js to imageresizer
async function uploadImageToImageResizer(image_name_or_id) {

    try {
        // const localImagePath = '/tmp/twitteradimage.png'; // this is created by createad.js
        const localImagePath = `/tmp/${image_name_or_id}`; // this is created by createad.js
        const imageBuffer = fs.readFileSync(localImagePath);

        const imageUploadResponse = await axios.post(
            `https://api.imageresizer.io/v1/images?key=${imageResizerKey}`, imageBuffer,
            {
                headers: { 'Content-Type': 'application/octet-stream' }
            }
        );
        if (imageUploadResponse.status === 200 && imageUploadResponse.data.success === true) {
            let image_id = imageUploadResponse.data.response.id
            console.log("Image uploaded to image resizer");
            return image_id;
        } else {
            console.log("Did not upload local image to imageresizer");
            return null;
        }
    } catch (error) {
        console.log(`Could not upload local image to imageresizer , Error is ${error.message}`);
        return null;
    };

}

async function InstaPostAPost(image_name_or_id) {
    // try {
        image_url = `https://newsexpress.imageresizer.io/${image_name_or_id}?size=1080x1800&format=webp&qualty=80`;
        let post_caption = `Read latest NZ NEWS, link in bio`;

        //post upload
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media?image_url=${image_url}&caption=${post_caption}&access_token=${longLivedAccessToken}`,
        );
        if (response.data.id) {
            console.log('Insta Post uploaded')
            //post post
            const response1 = await axios.post(
                `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media_publish?creation_id=${response.data.id}&access_token=${longLivedAccessToken}`,
            );
            if (response1.data.id) {
                console.log('Insta Post posted')
            }
        }
        return "success";
    // } catch (error) {
    //     console.error('Error posting Insta post:', error.response ? error.response.data : error.message);
    //     return null;
    // }
}

async function InstaPostAStory(image_name_or_id) {
    image_url = `https://newsexpress.imageresizer.io/${image_name_or_id}?size=1080x1800&format=webp&qualty=80`;
    let post_caption = `Read latest NZ NEWS, link in bio`;
    // try {
        //story upload
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media?media_type=STORIES&image_url=${image_url}&access_token=${longLivedAccessToken}`,
        );
        if (response.data.id) {
            console.log('Insta Story uploaded')

            //story post
            const response1 = await axios.post(
                `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media_publish?creation_id=${response.data.id}&access_token=${longLivedAccessToken}`,
            );
            if (response1.data.id) {
                console.log('Insta Story posted')
            }
        }
        return "success";
    // } catch (error) {
    //     console.error('Error posting Insta Story:', error.response ? error.response.data : error.message);
    //     return null;
    // }
}


async function ImageResizerDeleteImage(image_id) {
    try {
        const deletedImage = await axios.get(
            `https://api.imageresizer.io/v1/images/${image_id}/delete?key=${imageResizerKey}`,
        );
        if (deletedImage.status === 200 && deletedImage.data.success === true) {
            console.log('Image deleted');
        } else {
            console.log('Image not deleted');
        }
    } catch (error) {
        console.log(`Ad Image not deleted from imageresizer , Error is ${error.message}`);
    }
}

//Reel posting is a lil complicated, will skip for now, see here - https://github.com/fbsamples/reels_publishing_apis/blob/main/insta_reels_publishing_api_sample/index.js
async function PostAReel() {
    try {
        //reel upload and then post to wall
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media?media_type=REELS&video_url=${image_url}&access_token=${longLivedAccessToken}`,
        );
        if (response.data.id) {
            console.log('Reel uploaded')

            const response1 = await axios.post(
                `https://graph.facebook.com/v18.0/${instagram_business_account_id}/media_publish?creation_id=${response.data.id}&access_token=${longLivedAccessToken}`,
            );
            if (response1.data.id) {
                console.log('Reel posted')
            }
        }

    } catch (error) {
        console.error('Error posting reel:', error.response ? error.response.data : error.message);
    }
}

module.exports = router;

// await getLongLivedAccessToken(); //only use this to generate long lived token
async function getLongLivedAccessToken() {
    //get long live token from short live token
    // the token from facebook graph explorer is short lived ie 1 hour, so we need to create long lived 60 days token from short live token
    //https://graph.facebook.com/{graph-api-version}/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={your-access-token}
    //app-id and app-secret can be found in fb dev account 
    try {
        const longlivedtoken = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=387649156945968&client_secret=db19d06416ce4e0cd76978761ea8cfb2&fb_exchange_token=${shortLivedAccessToken}`,
        );
        if (longlivedtoken.status === 200) {
            longLivedAccessToken = longlivedtoken.data.access_token
            console.log(`Long live access token created ${longLivedAccessToken}`);
        } else {
            console.log(`Long live access token not created`);
        }
    } catch (e) {
        console.log(`Long live access token not created ${e.message}`);
    }
}

//to get insta business account id and access token
// https://developers.facebook.com/docs/instagram-api/getting-started
// https://developers.facebook.com/tools/explorer
//select these permissions
// pages_show_list
// business_management
// instagram_basic
// instagram_content_publish
// then generate token

// {
//     "instagram_business_account": {
//       "id": "17841463474746520"
//     },
//     "id": "184468404754544" // facebook page id
//   }