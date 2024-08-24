const OpenAI = require("openai");
const config = require("../config");

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

const instructions = `
You are a social marketing agent specializing in creating short, trending content for social media based on information from internet.
Include relevant and suggested hashtags at the end of content that will help in making content trending or viral.
`;

async function complete(messages) {
  const completion = await client.chat.completions.create({
    messages: [{ role: "system", content: instructions.trim() }, ...messages],
    model: config.openai.models.completion,
  });

  return completion.choices[0].message.content;
}

async function draw(prompt) {
  const image = await client.images.generate({
    model: config.openai.models.image,
    prompt,
    size: "1024x1024",
    quality: "standard",
    n: 1,
  });

  return image.data[0].url;
}

module.exports = {
  complete,
  draw,
};
