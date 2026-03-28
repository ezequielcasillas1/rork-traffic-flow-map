import fs from 'fs';
import path from 'path';
import { OpenAI } from "openai";
import sharp from "sharp";
import https from "https";

const openai = new OpenAI({
  apiKey: "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"
});

async function downloadImage(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

async function resizeImage(inputPath, sizes) {
  for (const size of sizes) {
    const outputPath = inputPath.replace(".png", `-${size}x${size}.png`);
    await sharp(inputPath)
      .resize(size, size)
      .toFile(outputPath);
    console.log(`✅ Resized: ${outputPath}`);
  }
}

async function generateIcon() {
  try {
    const response = await openai.images.generate({
      prompt: "A colorful traffic tracker app icon showing a car on a map with a rainbow over it, in flat vector-style, centered, with a transparent background",
      n: 1,
      size: "1024x1024",
      response_format: "url"
    });

    const imageUrl = response.data[0].url;
    const savePath = path.join(process.cwd(), "traffic-tracker-icon.png");

    console.log("✅ Image URL:", imageUrl);
    await downloadImage(imageUrl, savePath);
    console.log("✅ Saved original icon:", savePath);

    await resizeImage(savePath, [1024, 512, 192, 128, 64]);
    console.log("🎉 All icons generated!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generateIcon();
