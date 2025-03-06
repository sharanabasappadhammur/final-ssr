require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");

const app = express();

// Serve static files from the 'build' directory
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/index.html") {
    next();
  } else {
    express.static(path.join(__dirname, "./build"))(req, res, next);
  }
});

app.get("/image-resize", async (req, res) => {
  const { imageUrl, width, height, quality } = req.query;

  try {
    // Fetch the image from the URL
    const response = await axios({
      url:
        imageUrl ||
        "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png",
      responseType: "arraybuffer"
    });

    const imageBuffer = Buffer.from(response.data, "binary");

    // Resize and compress the image using sharp
    const outputBuffer = await sharp(imageBuffer)
      .resize({
        width: parseInt(width) || 300,
        height: parseInt(height) || 200
      })
      .jpeg({ quality: parseInt(quality) || 80 }) // Optional quality compression for JPEG
      .toBuffer();

    // Send the processed image
    res.set("Content-Type", "image/jpeg");
    res.send(outputBuffer);
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).send("Error processing image");
  }
});

app.get("*", async (req, res) => {
  const filePath = path.join(__dirname, "build", "index.html");
  let htmlContent = fs.readFileSync(filePath, "utf8");
  const userAgent = req.headers["user-agent"].toLowerCase();

  if (
    (req.path.includes("/coffeenewsfeeds") && req.query.newsId) ||
    req.path.includes("/news")
  ) {
    const API_BASE_URL = [
      {
        clientUrl: "dev-pwa.devptest.com",
        apiBaseUrl: "https://dev-api.devptest.com"
      },
      {
        clientUrl:
          "pp-coffeewebtech-c7dja8bdgkh9cpcm.southindia-01.azurewebsites.net",
        apiBaseUrl: "https://pp-coffeewebapi.devptest.com"
      },
      {
        clientUrl: "coffeeweb.com",
        apiBaseUrl: "https://www.coffeewebapi.com"
      }
    ];

    const currentHost = req.headers.host;

    const matchedConfig = API_BASE_URL.find((config) =>
      currentHost.includes(config.clientUrl)
    );

    const apiBaseUrl =
      matchedConfig?.apiBaseUrl || "https://dev-api.devptest.com";

    const apiUrl = `${apiBaseUrl}/api/news/getNewsMetaTagInformation/${
      req.query.newsId || 0
    }/${req.query.newsId ? "NA" : req.params[0].split("/").pop()}`;

    try {
      const response = await axios.get(apiUrl);

      const newsData = response.data.returnLst[0];
      const originalImageUrl =
        newsData.nwsFeedMedia[0].webimgpath ||
        "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png";
      const shortDescription =
        newsData.shortDescription || "This is coffee news feeds";
      const subject = newsData.subject || "This is coffee news feeds";

      htmlContent = htmlContent.replace(
        /<\/head>/,
        `<meta property="og:image" content="https://${currentHost}/image-resize?imageUrl=${originalImageUrl}&width=500&height=300&quality=80" />\n` +
          `<meta name="description" content="${shortDescription}" />\n</head>`
      );
      htmlContent = htmlContent.replace(
        /<title>.*<\/title>/,
        `<title>${subject}</title>`
      );

      res.send(htmlContent);
    } catch (error) {
      // In case of error, fallback to default image and metadata
      htmlContent = htmlContent.replace(
        /<\/head>/,
        `<meta property="og:image" content="https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png" />\n` +
          `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
      );

      htmlContent = htmlContent.replace(
        /<title>.*<\/title>/,
        `<title>CoffeeWeb</title>`
      );

      res.send(htmlContent);
    }
  } else {
    // Default fallback for non-news pages
    htmlContent = htmlContent.replace(
      /<\/head>/,
      `<meta property="og:image" content="https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png" />\n` +
        `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
    );

    htmlContent = htmlContent.replace(
      /<title>.*<\/title>/,
      `<title>CoffeeWeb</title>`
    );

    res.send(htmlContent);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
