// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const axios = require("axios");
// const sharp = require("sharp");

// const app = express();

// app.use((req, res, next) => {
//   if (req.path === "/" || req.path === "/index.html") {
//     next();
//   } else {
//     express.static(path.join(__dirname, "./build"))(req, res, next);
//   }
// });

// app.get("*", async (req, res) => {
//   const filePath = path.join(__dirname, "build", "index.html");
//   let htmlContent = fs.readFileSync(filePath, "utf8");

//   if (req.path.includes("/coffeenewsfeeds") && req.query.newsId) {
//     const apiUrl = `https://dev-api.devptest.com/api/news/GetNewsAndMediaById/${req.query.newsId}`;
//     const token =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNDc0ODM2NDYiLCJuYmYiOjE3Mzk5NjA5MjksImV4cCI6MTc0MDU2NTcyOSwiaWF0IjoxNzM5OTYwOTI5fQ.-E9DZ0iLiVpa_7J_46ajwO9lxUv-eII0V6dpikjExaA"; // Replace with the actual token

//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const newsData = response.data.returnLst[0];
//       const originalImageUrl =
//         newsData.nwsFeedMedia[0].webimgpath ||
//         // "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeenewsfeeds/Certified+Lots.png" ||
//         "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png";
//       const shortDescription =
//         newsData.shortDescription || "This is coffee news feeds";
//       const subject = newsData.subject || "This is coffee news feeds";

//       // Fetch and compress the image on the fly using Sharp
//       const imageResponse = await axios({
//         url: originalImageUrl,
//         responseType: "arraybuffer"
//       });

//       const compressedImageBuffer = await sharp(imageResponse.data)
//         .resize(500) // Resize the image to 300px width (adjust as needed)
//         .jpeg({ quality: 90 }) // Adjust quality (70) for compression
//         .toBuffer();

//       // Create a base64 version of the compressed image
//       const compressedImageBase64 = `data:image/jpeg;base64,${compressedImageBuffer.toString(
//         "base64"
//       )}`;

//       // console.log(originalImageUrl);
//       console.log(compressedImageBase64);

//       htmlContent = htmlContent.replace(
//         /<\/head>/,
//         `<meta property="og:image" content="${compressedImageBase64}" />\n` +
//           `<meta name="description" content="${shortDescription}" />\n</head>`
//       );
//       htmlContent = htmlContent.replace(
//         /<title>.*<\/title>/,
//         `<title>${subject}</title>`
//       );

//       res.send(htmlContent);
//     } catch (error) {
//       // In case of error, fallback to default image and metadata
//       htmlContent = htmlContent.replace(
//         /<\/head>/,
//         `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
//           `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
//       );

//       htmlContent = htmlContent.replace(
//         /<title>.*<\/title>/,
//         `<title>CoffeeWeb</title>`
//       );

//       res.send(htmlContent);
//     }
//   } else {
//     // Default fallback for non-news pages
//     htmlContent = htmlContent.replace(
//       /<\/head>/,
//       `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
//         `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
//     );

//     htmlContent = htmlContent.replace(
//       /<title>.*<\/title>/,
//       `<title>CoffeeWeb</title>`
//     );

//     res.send(htmlContent);
//   }
// });

// app.listen(5000, () => {
//   console.log(`Server is running on http://localhost:${5000}`);
// });
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");

const app = express();

app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/index.html") {
    next();
  } else {
    express.static(path.join(__dirname, "./build"))(req, res, next);
  }
});

app.get("/image-proxy", async (req, res) => {
  const { imageUrl, width, height, quality } = req.query;

  try {
    // Fetch the image from the URL
    const response = await axios({
      url:
        imageUrl ||
        "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeenewsfeeds/Vietnam+Diff.png",
      responseType: "arraybuffer"
    });

    const imageBuffer = Buffer.from(response.data, "binary");

    console.log("tetwtst");

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
    /facebook|fbav|fban|twitter|instagram|linkedin|whatsapp|snapchat|googlebot|bingbot|pinterest|reddit|tiktok/i.test(
      userAgent
    )
  ) {
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
  } else if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(userAgent)) {
    // User agent is a browser
    res.send("Hello from a browser!");
  }

  // if (req.path.includes("/coffeenewsfeeds") && req.query.newsId) {
  //   const apiUrl = `https://dev-api.devptest.com/api/news/GetNewsAndMediaById/${req.query.newsId}`;
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNDc0ODM2NDYiLCJuYmYiOjE3Mzk5NjA5MjksImV4cCI6MTc0MDU2NTcyOSwiaWF0IjoxNzM5OTYwOTI5fQ.-E9DZ0iLiVpa_7J_46ajwO9lxUv-eII0V6dpikjExaA"; // Replace with the actual token

  //   try {
  //     const response = await axios.get(apiUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     const newsData = response.data.returnLst[0];
  //     const originalImageUrl =
  //       newsData.nwsFeedMedia[0].webimgpath ||
  //       // "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeenewsfeeds/Certified+Lots.png" ||
  //       "https://coffeeweb.s3.ap-south-1.amazonaws.com/coffeeweb_menu_icons/CoffeeWeb_Logo_White_Background_Blue_Text.png";
  //     const shortDescription =
  //       newsData.shortDescription || "This is coffee news feeds";
  //     const subject = newsData.subject || "This is coffee news feeds";

  //     // console.log(originalImageUrl);
  //     // console.log(compressedImageBase64);

  //     htmlContent = htmlContent.replace(
  //       /<\/head>/,
  //       // `<meta property="og:image" content="${compressedImageBase64}" />\n` +
  //       `<meta property="og:image" content="https://final-ssr-production.up.railway.app/image-proxy?imageUrl=${newsData.nwsFeedMedia[0].webimgpath}&width=500&height=300&quality=80" />\n` +
  //         `<meta name="description" content="${shortDescription}" />\n</head>`
  //     );
  //     htmlContent = htmlContent.replace(
  //       /<title>.*<\/title>/,
  //       `<title>${subject}</title>`
  //     );

  //     res.send(htmlContent);
  //   } catch (error) {
  //     // In case of error, fallback to default image and metadata
  //     htmlContent = htmlContent.replace(
  //       /<\/head>/,
  //       `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
  //         `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
  //     );

  //     htmlContent = htmlContent.replace(
  //       /<title>.*<\/title>/,
  //       `<title>CoffeeWeb</title>`
  //     );

  //     res.send(htmlContent);
  //   }
  // } else {
  //   // Default fallback for non-news pages
  //   htmlContent = htmlContent.replace(
  //     /<\/head>/,
  //     `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n` +
  //       `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />\n</head>`
  //   );

  //   htmlContent = htmlContent.replace(
  //     /<title>.*<\/title>/,
  //     `<title>CoffeeWeb</title>`
  //   );

  //   res.send(htmlContent);
  // }
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
