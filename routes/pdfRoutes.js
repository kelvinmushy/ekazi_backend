const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

router.get('/generate-pdf', async (req, res) => {
  try {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content for the PDF
    const content = `
      <html>
        <head>
          <title>Applicant CV</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            h1 {
              text-align: center;
            }
            .section {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Applicant CV</h1>
          <div class="section">
            <h2>Name: John Doe</h2>
            <p>Email: john.doe@example.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div class="section">
            <h2>Work Experience</h2>
            <p>Software Engineer at XYZ Corp</p>
            <p>January 2020 - Present</p>
          </div>
          <div class="section">
            <h2>Education</h2>
            <p>Bachelor of Science in Computer Science, University of Technology (Graduated in 2014)</p>
          </div>
        </body>
      </html>
    `;

    // Set the HTML content to the page
    await page.setContent(content);

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Close the browser
    await browser.close();

    // Set the response headers and send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
