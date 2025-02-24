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

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "build", "index.html");
  let htmlContent = fs.readFileSync(filePath, "utf8");

  if (req.path.includes("/coffeenewsfeeds") && req.query.newsId) {
    const apiUrl = `https://dev-api.devptest.com/api/news/GetNewsAndMediaById/${req.query.newsId}`;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNDc0ODM2NDYiLCJuYmYiOjE3Mzk5NjA5MjksImV4cCI6MTc0MDU2NTcyOSwiaWF0IjoxNzM5OTYwOTI5fQ.-E9DZ0iLiVpa_7J_46ajwO9lxUv-eII0V6dpikjExaA"; // Replace with the actual token

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const newsData = response.data.returnLst[0];
        const selectedImage =
          newsData.nwsFeedMedia[0].webimgpath ||
          "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png";
        const shortDescription =
          newsData.shortDescription || "This is coffee news feeds";
        const subject = newsData.subject || "This is coffee news feeds";

        console.log(selectedImage);

        htmlContent = htmlContent.replace(
          /<\/head>/,
          `<meta property="og:image" content="${selectedImage}" />\n` +
            `<meta name="description" content="${shortDescription}" />\n</head>`
        );
        htmlContent = htmlContent.replace(
          /<title>.*<\/title>/,
          `<title>${subject}</title>`
        );

        res.send(htmlContent);
      })
      .catch((error) => {
        // Replace the closing head tag with the og:image and description meta tags
        htmlContent = htmlContent.replace(
          /<\/head>/,
          `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
            `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
        );

        // Replace the existing title tag
        htmlContent = htmlContent.replace(
          /<title>.*<\/title>/,
          `<title>CoffeeWeb</title>`
        );

        res.send(htmlContent);

        // console.error("Error fetching news data:", error);.
        // res.status(500).send("Error loading news feed");
      });
  } else {
    // Replace the closing head tag with the og:image and description meta tags
    htmlContent = htmlContent.replace(
      /<\/head>/,
      `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
        `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
    );

    // Replace the existing title tag
    htmlContent = htmlContent.replace(
      /<title>.*<\/title>/,
      `<title>CoffeeWeb</title>`
    );

    res.send(htmlContent);
  }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
