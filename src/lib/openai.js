const OpenAI = require("openai");
const config = require("../config");

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

const instructions = `
You are a content creation expert called Postmatick, helping people create content for LinkedIn posts as well as blog posts or articles.
You also help them in creating effective prompts for image generation using DALL-E 3.
Extract key points and highlights from provided information and write content in an informational manner, prefer story-telling style.
Avoid including additional metadata with the content.
`;

async function complete(messages) {
  const completion = await client.chat.completions.create({
    messages: [{ role: "system", content: instructions.trim() }, ...messages],
    model: config.openai.models.completion,
  });

  return completion.choices[0].message.content;
}

async function draw(prompt, size = "1024x1024") {
  const image = await client.images.generate({
    model: config.openai.models.image,
    prompt,
    size,
    quality: "standard",
    n: 1,
  });

  return image.data[0].url;
}

module.exports = {
  complete,
  draw,
};
