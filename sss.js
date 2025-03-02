const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();

app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/index.html") {
    next();
  } else {
    express.static(path.join(__dirname, "./build"))(req, res, next);
  }
});

app.get("*", async (req, res) => {
  const filePath = path.join(__dirname, "build", "index.html");
  let htmlContent = fs.readFileSync(filePath, "utf8");

  const userAgent = req.headers["user-agent"].toLowerCase();
  const newsId = req.query.newsId;

  if (
    /facebook|fbav|fban|twitter|instagram|linkedin|whatsapp|snapchat|googlebot|bingbot|pinterest|reddit|tiktok/i.test(
      userAgent
    ) &&
    req.path.includes("/newsFeeds") &&
    newsId
  ) {
    const apiUrl = `https://example.com/api/newsFeed?newsId=${newsId}`;
    try {
      const response = await axios.get(apiUrl);
      const newsDetail = response.data; // https://example.com/blogImage.jpg
      const blogImage =
        newsDetail.thubminlImage ||
        "https://coffeeweb.s3.ap-south-1.amazonaws.com/defaultImage.png";
      const shortDescription =
        newsDetail.shortDescription || "This is news feeds";
      const subject = newsDetail.subject || "This is news feeds";

      htmlContent = htmlContent.replace(
        /<\/head>/,
        // `<meta property="og:image" content="${compressedImageBase64}" />\n` +
        `<meta property="og:image" content="${blogImage}" />\n` +
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
        `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
          `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
      );

      htmlContent = htmlContent.replace(
        /<title>.*<\/title>/,
        `<title>CoffeeWeb</title>`
      );

      res.send(htmlContent);
    }
  } else if (req.path.includes("/home")) {
    // Default fallback for non-news pages
    htmlContent = htmlContent.replace(
      /<\/head>/,
      `<meta property="og:image" content="https://e.com/homeimage.png" />\n` +
        `<meta name="description" content="This is home screen" />\n</head>`
    );

    htmlContent = htmlContent.replace(
      /<title>.*<\/title>/,
      `<title>Home Screen</title>`
    );

    res.send(htmlContent);
  }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
