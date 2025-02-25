const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

    //create image for insta
    // await axios
    //     .post('http://localhost:1337/api/CreateAd')
    //     .then((response) => {
    //         if (response.status === 200) {
    //             console.log('Created Image for Insta: ', response.data)
    //         }
    //     })
    //     .catch((e) => {
    //         console.error("Error creating image for insta " + e)
    //     })


    // upload image created by above to image resizer

        const uploadresponse = await axios.post('https://topnews7.vercel.app/api/PostOnInsta',
            {
                "upload_or_post_image": "uploadImage",
                "image_name_or_id": "twitteradimage.png"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic bmV3c2V4cHJlc3M6wqM1MHIwQDc9b1FYOQ==',
                }
            });
            
        if (uploadresponse.status === 200 && uploadresponse.data.image_id) {
            console.log('Image uploaded to image resizer, Image id :', uploadresponse.data.image_id);

            //post on insta
            const postresponse = await axios.post('https://topnews7.vercel.app/api/PostOnInsta',
                {
                    "upload_or_post_image": "postImage",
                    "image_name_or_id": uploadresponse.data.image_id
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic bmV3c2V4cHJlc3M6wqM1MHIwQDc9b1FYOQ==',
                    }
                });
            if (postresponse.status === 200) {
                console.log("Image posted to Insta, status " +postresponse.status);
            }else{
                console.log("Image not posted to Insta. Error: ", postresponse.data.message);
            }
        }else{
            console.log("Image Not uploaded to image resizer. Error: ", uploadresponse.data.message);
        }

};

exports.handler = schedule("@hourly", handler);

// netlify functions:serve
// http://localhost:9999/.netlify/functions/<name>