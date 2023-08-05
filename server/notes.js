// DELETE TWEET START
app.post('/api/deleteTweet', async (req, res) => {

	let dbid = req.body.dbid.trim();
	
	TweetData.findByIdAndDelete(dbid)
		.then(deletedUser => {
			// console.log(`Successfully deleted user with id ${dbid}`);
			return res.json({ status: 'ok'})
		})
		.catch(err => {
			// console.log(`Error deleting user with id ${dbid}: ${err}`);
			return res.json({ status: 'error'})
		});

})
// DELETE TWEET END

// ADD TAG START
app.post('/api/addtag', async (req, res) => {

	let dbid = req.body.dbid.trim();
	let tag = req.body.tag.trim();
	
	try{
		TweetData.findByIdAndUpdate(dbid, {tag: tag, curationstatus: "notcurated"}, {new: false}, (err, doc) => {
			if (err) return handleError(err);
		});	
		return res.json({ status: 'ok'})
	}catch{
		return res.json({ status: 'error'})
	}
})
// ADD TAG END

// PULL TWEET to show user START
app.post('/api/ShowTweets', async (req, res) => {

	let tweeterUserHadleToPullTweets = req.body.tweeterUserHadleToPullTweets.trim();
	
	const AITweets = await TweetData.find({

		//case insensitive search on handle
		TwitteruserName: { '$regex':tweeterUserHadleToPullTweets , '$options' : 'i'} ,
		curationstatus:"notcurated"
	})
	
	if(AITweets.length > 0){
		//sort the array by likes to views ratio
		AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
	return res.json({ status: 'ok', tweets: AITweets })
	}else{
		return res.json({ status: 'error', error: 'No Tweets found for user' })
	}

})
// PULL TWEET to show user END

// PULL TWEET  on topic to show user START
app.post('/api/GetTweetsOnTopic', async (req, res) => {

	let topictopulltweets = req.body.topictopulltweets.trim();
	
	const AITweets = await TweetData.find({
		//case insensitive search on handle
		tag: { '$regex':topictopulltweets , '$options' : 'i'} 

	})
	
	if(AITweets.length > 0){
		//sort the array by likes to views ratio
		AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
	return res.json({ status: 'ok', tweets: AITweets })
	}else{
		return res.json({ status: 'error', error: 'No Tweets found for topic' })
	}

})
// PULL TWEET on topic to show user END


// CURATE TWEET  START
app.post('/api/curate', async (req, res) => {

	let tweeterUserHadleToPullTweets = req.body.tweeterUserHadleToPullTweets.trim();
	let topicToPullTweets = req.body.topicToPullTweets.trim();

	
	
	if(topicToPullTweets === "null"){

		const AITweets = await TweetData.find({

			//case insensitive search on handle
			TwitteruserName: { '$regex':tweeterUserHadleToPullTweets , '$options' : 'i'} ,
			curationstatus:"notcurated"
		})

		if(AITweets.length > 0){
			//sort the array by likes to views ratio
			AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
		return res.json({ status: 'ok', tweets: AITweets })
		}
		else{
			return res.json({ status: 'error', error: 'No Tweets found for user' })
		}

	}

	if(tweeterUserHadleToPullTweets === "null"){

		const AITweets = await TweetData.find({

			//case insensitive search on handle
			tag: { '$regex':topicToPullTweets , '$options' : 'i'} ,
			curationstatus:"notcurated"
		})

		if(AITweets.length > 0){
			//sort the array by likes to views ratio
			AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)

		return res.json({ status: 'ok', tweets: AITweets })
		}
		else{
			return res.json({ status: 'error', error: 'No Tweets found for topic' })
		}
	}	
	
})
// CURATE TWEET END

// Generate AI TWEET START
app.post('/api/GenerateAITweet', async (req, res) => {

	let neednewAITweetforthisTweet = req.body.neednewAITweetforthisTweet.trim();
	let dbid = req.body.dbid.trim();
	let promptforAI = `${neednewAITweetforthisTweet}${neednewAITweetforthisTweet.slice(-1)==="." ? "" : "."}` //add . if not present
	
	const { Configuration, OpenAIApi } = require("openai");

	const configuration = new Configuration({
		apiKey: process.env.apiKey,
	});
	const openai = new OpenAIApi(configuration);
	let promptfornewtweet = `Write a new Tweet with no hashtags using the following Tweet as context. ${promptforAI}`;


	try{

	
		const newAItweet = await openai.createCompletion({
			"model": "text-curie-001",
			// "model": "text-davinci-003",
			"prompt": promptfornewtweet,
			"temperature": 0.9,
			"max_tokens": 100,
			// "top_p": 1,  this with temperature 0.9 gives bad results
			"frequency_penalty": 0.37,
			"presence_penalty": 0,
			// "stop": ["\n\n"]
		});

		console.log(newAItweet.data.usage.total_tokens)
		total_tokens_used_byAI = newAItweet.data.usage.total_tokens;
		

		if(newAItweet){

			//add tokens used to db
			TweetData.findByIdAndUpdate(dbid, {$inc: {total_tokens: total_tokens_used_byAI}}, {new: true}, (err, doc) => {
				if (err) return handleError(err);
			});
			// tokeuseremail = "genericuser@gmail.com"
			// UserData.findByIdAndUpdate(tokeuseremail, {$inc: {total_tokens: total_tokens_used_byAI}}, {new: true}, (err, doc) => {
			// 	if (err) return handleError(err);
			// });


			return res.json({ status: 'ok', newAItweet: newAItweet.data.choices[0].text })
			}else{
				return res.json({ status: 'error', error: 'Tweet Generation failed by AI' })
		}
	}
	catch(error){{
		console.log(error)
		return res.json({ status: 'error', error: 'Tweet Generation failed by AI' })
	}}
	

})
// generate AI TWEET END









app.post('/api/admin', async (req, res) => {

	try {
		const Analyse = await TweetData.find({
			Email: 'generic@email.com'
		})
		AdminArray = []
		for (let i = 0; i < Analyse.length; i++) {
			// console.log(Analyse[i].TwitteruserName)
			AdminArray.push(Analyse[i].TwitteruserName)

		}

		return res.json({ status: 'ok', AdminArray: AdminArray })

	} catch (error) {
		res.json({ status: 'error', error: 'Admin error occured' })
	}
})





// list all databases in mongo db
// const {MongoClient} = require('mongodb');
// main();
// async function main(){
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://user:de2LxbUlkcOYBgXJ@galaxzcluster.sofxyos.mongodb.net/?retryWrites=true&w=majority";
 

//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         await  listDatabases(client);
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

// main().catch(console.error);


// 	async function listDatabases(client){
// 		databasesList = await client.db().admin().listDatabases();
	 
// 		console.log("Databases:");
// 		databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// 	};





function addTweets(){
	try {
		
		 User.updateOne(
			{ email: "vivek@galaxz.com" },
			{ $set: { quote: userTweetsArray.toString() } }
		)
		
		console.log(userTweetsArray.toString())
		console.log("tweets added to db")
		
	} catch (err) {
		// res.json({ status: 'error', error: 'error happened' })
		console.log(err)

	}
}




// AI


let tweeterUserIdToAnalyse;
let userTweetsArrayforAI = [];
let AIanalysisArray= [];
let TotalTokensUsed =0 ;
let PromptTokensUsed = 0;
let CompletionTokensUsed = 0;

app.post('/api/ai', async (req, res) => {
	const token = req.headers['x-access-token']

	tweeterUserIdToAnalyse = req.body.tweeterUserIdToAnalyse;

	try {

		//get tweets from DB for the user
		const TwiterUser =  await TweetData.findOne({
			TwitteruserName: tweeterUserIdToAnalyse,
		})

		for (i=0;i<TwiterUser.Tweets.length;i++){ 
			userTweetsArrayforAI.push(TwiterUser.Tweets[i]);

		}

		//open ai call
		console.log("totals runs will be  -- "+userTweetsArrayforAI.toString().length/5000)

	let slicedata = 0;

	// for (let i = 0; i < userTweetsArrayforAI.toString().length/5000; i++)
	for (let i = 0; i < 4; i++)
	{
		console.log("run is "+i)
		// console.log("slicedata is "+slicedata)

		let prompttext = userTweetsArrayforAI.toString().slice(slicedata, slicedata+4900);
		// let prompt: `What are the key points from this text:\n\n\"\"\"\n${prompttext}\n\"\"\"\n\nThe key points are:`,
		// console.log("prompt is "+prompt)

		finalprompt = `Read these tweets then answer the following questions:\n\n\"\"\"\n${prompttext}\n\"\"\"\n\nQuestions:\n1. What topic do the tweets talk about?\n2. Who are mentioned in these tweets?\n3. Pull all hashtags in these tweets.\n4. Sentiment of tweets.\n\nAnswers:\n1.`;

		const { Configuration, OpenAIApi } = require("openai");
		
		const configuration = new Configuration({
		apiKey: "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",
		});

	
		const openai = new OpenAIApi(configuration);

		const response = await openai.createCompletion({
			"model": "text-curie-001",
			"prompt": finalprompt,
			"temperature": 0.9,
			"max_tokens": 200,
			"top_p": 1,
			"frequency_penalty": 0.37,
			"presence_penalty": 0,
			"stop": ["\n\n"]
		});

		AIanalysisArray.push(response.data.choices[0].text.trim())

		TotalTokensUsed = TotalTokensUsed + response.data.usage.total_tokens;
		PromptTokensUsed = PromptTokensUsed + response.data.usage.prompt_tokens;
		CompletionTokensUsed = CompletionTokensUsed + response.data.usage.completion_tokens;
		// console.log("comp tokens "+CompletionTokensUsed)
		slicedata = slicedata+4900;
		


	}
	
		//update DB with AI analysis
		await TweetData.updateOne(
			{ TwitteruserName: tweeterUserIdToAnalyse },
			{ $set: { AIAnalysis: AIanalysisArray } }
		)
		await TweetData.updateOne(
			{ TwitteruserName: tweeterUserIdToAnalyse },
			{ $set: { TotalTokensUsed: TotalTokensUsed.toString()} }
		)
		await TweetData.updateOne(
			{ TwitteruserName: tweeterUserIdToAnalyse },
			{ $set: { PromptTokensUsed: PromptTokensUsed.toString() } }
		)
		await TweetData.updateOne(
			{ TwitteruserName: tweeterUserIdToAnalyse },
			{ $set: { CompletionTokensUsed: CompletionTokensUsed.toString() } }
		)


		return res.json({ status: 'ok', AItweets: AIanalysisArray })

	} catch (error) {
		console.log(JSON.stringify(error))
		res.json({ status: 'error', error: 'Something went wrong' })
	}
})



app.post('/api/download', async (req, res) => {
	const token = req.headers['x-access-token']

	dataToDownload = [];
	
	tweeterUserIdToDownlaod = req.body.tweeterUserIdToAnalyse;

	try {

		//get tweets from DB for the user
		const TwiterUserData =  await TweetData.findOne({
			TwitteruserName: tweeterUserIdToDownlaod,
		})

		for (i=0;i<TwiterUserData.AIAnalysis.length;i++){ 
			dataToDownload.push(TwiterUserData.AIAnalysis[i]);

		}

		return res.json({ status: 'ok', AItweets: dataToDownload })

	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'Something went wrong' })
	}
})


app.post('/api/downloadtweets1111', async (req, res) => {
	const token = req.headers['x-access-token']

	dataToDownload = [];
	
	tweeterUserIdToDownlaod = req.body.tweeterUserIdToAnalyse;

	try {

		//get tweets from DB for the user
		const TwiterUserData =  await TweetData.findOne({
			TwitteruserName: tweeterUserIdToDownlaod,
		})

		for (i=0;i<TwiterUserData.Tweets.length;i++){ 
			dataToDownload.push(TwiterUserData.Tweets[i]);

		}


		return res.json({ status: 'ok', Usertweets: dataToDownload })

	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'Something went wrong' })
	}
})






// this is 

// a 

// new 

// use case
//https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query#boolean
// https://developer.twitter.com/en/docs/twitter-api/enterprise/rules-and-filtering/operators-by-product


app.post('/api/downloadtweets', async (req, res) => {
	
	let tweeterUserIdToAnalyse = req.body.tweeterUserIdToAnalyse;
	console.log(tweeterUserIdToAnalyse);
	
	const token = 'qqqqqqqqqAAAk%2BaE8tKnN2qy%2BVI%3D5vwJOXxAPCslAncjT7C2JTWJzW9yUtWIAPIs9FABTqIFpB97n2';

	const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
	
	try {
		
	async function getRequest() {
	
		//“Twitter API”, in "" will do exact search 
		// -wordhere will not include word in the search
		// has:media has:images has:links has:videos
		// place:"new york city" OR place:seattle
		// place_country:US OR place_country:MX OR place_country:CA
		// from:twitteruser -has:hashtags
		//followers_count:500 tweets_count:1000  following_count:500
	
		
		const params = {
			// 'query': ' "openai" -is:retweet -is:quote is:reply lang:en ',
			'query': 'from:TestEraAI -is:retweet -is:quote is:reply lang:en ',
			'max_results': 0,
			// 'start_time': '2023-01-11T00:00:00Z',
			// 'end_time': '2023-01-15T00:00:00Z',
			'tweet.fields':('author_id','created_at','id', 'lang', 'public_metrics' )
			
		}
	
		const res = await needle('get', endpointUrl, params, {
			headers: {
				"User-Agent": "v2RecentSearchJS",
				"authorization": `Bearer ${token}`
			}
		})
	
		if (res.body) {
			return res.body;
			
		} else {
			throw new Error('Unsuccessful request');
		}
	}
	


	(async () => {
	
		try {
			// Make request
			const response111 = await getRequest();
			console.log("dfsdsfds-----"+JSON.stringify(response111));

				for (i=0;i<response111.data.length;i++){ 
					// if(response111.data[i].public_metrics.impression_count>1000)
					// {
				
						await AllTweetData.create({
								TweetText: response111.data[i].text,
								TweetId: response111.data[i].id,
								retweet_count: response111.data[i].public_metrics.retweet_count,
								reply_count:response111.data[i].public_metrics.reply_count,
								like_count:response111.data[i].public_metrics.like_count,
								quote_count:response111.data[i].public_metrics.quote_count,
								impression_count:response111.data[i].public_metrics.impression_count,
							
						})
					// }
				}
				console.log("tweets with likes and all added to DB")

		} catch (e) {
			console.log("error is "+e);
			process.exit(-1);
		}
		
		process.exit();
		
	})();
	
	}
	
	catch (err) {
			res.json({ status: 'error', error: 'error occured line 398' })
			console.log("error is  ---" +err)
		}
	
})





