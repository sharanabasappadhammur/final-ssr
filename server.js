const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Serve static files except for index.html
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/index.html") {
    next();
  } else {
    express.static(path.join(__dirname, "./build"))(req, res, next);
  }
});

// Custom handler for index.html
app.get("*", (req, res) => {
  console.log("htmlContent");

  const filePath = path.join(__dirname, "build", "index.html");
  let htmlContent = fs.readFileSync(filePath, "utf8");

  // if (req.path === "/") {
  //   // Replace the existing title tag
  //   htmlContent = htmlContent.replace(
  //     /<title>.*<\/title>/,
  //     `<title>Coffee Web</title>`
  //   );

  //   htmlContent = htmlContent.replace(
  //     /<\/head>/,
  //     `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/ttegzwmq.hjf-CoffeeWeb_Logo_White_Background_Blue_Text-(1).png" />\n</head>`
  //   );

  //   // Replace the existing meta description tag.
  //   htmlContent = htmlContent.replace(
  //     /<meta name="description" content=".*" \/>/,
  //     `<meta name="description" content="This app provides end-to-end information about the Global Coffee Industry." />`
  //   );
  // }

  if (req.path === "/") {
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

  if (req.path === "/coffeenewsfeeds") {
    const images = [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMbxvympacKlPdxFnB3VE_j6o1nngjvGRnQ&s",
      "https://sample-videos.com/img/Sample-png-image-100kb.png",
      "https://i.pinimg.com/736x/94/ba/f8/94baf875f3b3f87b99c3a4a01e0503fe.jpg"
    ];

    // Simulate a dummy API call with a 1-second delay
    setTimeout(() => {
      // Select a random image from the array
      const selectedImage = images[Math.floor(Math.random() * images.length)];

      // Replace the closing head tag with the og:image and description meta tags
      htmlContent = htmlContent.replace(
        /<\/head>/,
        `<meta property="og:image" content="${selectedImage}" />\n` +
          `<meta name="description" content="This is coffee news feeds" />\n</head>`
      );

      // Replace the existing title tag
      htmlContent = htmlContent.replace(
        /<title>.*<\/title>/,
        `<title>Coffee News Feeds</title>`
      );

      // Send the modified HTML content as the response (or continue with your logic)
      res.send(htmlContent);
    }, 1000); // 1-second delay
  }

  // res.send(htmlContent);
});

app.listen(5001, () => {
  console.log(`Server is running on http://localhost:${5001}`);
});
