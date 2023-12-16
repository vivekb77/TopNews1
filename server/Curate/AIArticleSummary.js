const { Configuration, OpenAIApi } = require("openai");
async function summarizePageContent(e) {
  if (e.data && e.data.textContent) {

    const pagecontent = e.data.textContent.slice(0, 6000); // ~14000 tokens
    const prompts = {
      'a': "Summarize this in MAXIMUM " + 100 + " words",
      'b': "Summarize this in MAXIMUM " + 100 + " words.",
      'c': "Summarize this in MAXIMUM " + 100 + " words. Make sure the result is in the input language. Show the result in bullet point format"
    };

    const configuration = new Configuration({
        // apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);


    try {
      const content = prompts.b + ": " + "\n\n" + pagecontent;
      console.log("Summary of ----> "+content);
      
      const response = await openai.createChatCompletion({
        "model": "gpt-3.5-turbo-16k",
        "messages": [{
          "role": "user",
          "content": content
        }]
    });
      if (response.status==200) {
        const usage = response.data.usage;
        const result = response.data.choices[0].message.content;
        console.log("usage" +JSON.stringify(usage))
        console.log("Result " +JSON.stringify(result))
      } else {
        console.error("OpenAI API request failed with status code:", response.status);
      }
    } catch (e) {
      console.error("An error occurred:", e.message);
    }
  }
}

const sampleEventData = {
  data: {
    textContent: `The pending election did nothing to dampen activity in the auction rooms over the last week, in fact it seemed to have had the opposite effect, with the auction rooms having their busiest week so far this year.

    There were 367 properties offered at the residential property auctions monitored by interest.co.nz over the week of 7-13 October, the highest number in any week so far this year.
    
    It was the first time in 2023 more than 300 properties have been offered at the auctions we monitor. The previous busiest week was at the height of the summer season in the last week of March when 294 properties were offered.
    
    The latest auctions also had the highest number of sales achieved so far this year, with 167 properties selling under the hammer, giving an overall sales rate of 46%.`

}
};

// summarizePageContent(sampleEventData);
