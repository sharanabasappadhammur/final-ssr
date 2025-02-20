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

  if (req.path === "/") {
    htmlContent = htmlContent.replace(
      /<\/head>/,
      `<meta property="og:image" content="https://coffeeweb.s3.amazonaws.com/1avmd1x5.3ne-Screenshot-2025-02-20-233752.png" />\n</head>`
    );

    // Replace the existing title tag
    htmlContent = htmlContent.replace(
      /<title>.*<\/title>/,
      `<title>Coffee Web</title>`
    );
  }

  if (req.path === "/coffeenewsfeeds") {
    htmlContent = htmlContent.replace(
      /<\/head>/,
      `<meta property="og:image" content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8P9RV-96KMhJK6EwQS-XoN1kdyF663o7EW0Eiu9LA1yliUOw-GkfOyOG2RTSqYhepjo&usqp=CAU" />\n</head>`
    );
  }

  console.log(htmlContent);

  res.send(htmlContent);
});

app.listen(5001, () => {
  console.log(`Server is running on http://localhost:${5001}`);
});
