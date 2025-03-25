const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Resume templates
const templates = {
    "template1": `
       <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume</title>
    <link rel="stylesheet" href="styles.css">
</head>


<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
        display: flex;
        justify-content: center;
    }

    .resume-container {
        max-width: 800px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 15px;
    }

    header h1 {
        margin: 0;
        color: #333;
    }

    header p {
        margin: 5px 0;
        color: #555;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    h2 {
        color: #333;
        border-bottom: 2px solid #007bff;
        padding-bottom: 5px;
    }

    .entry {
        margin-bottom: 15px;
    }

    ul {
        padding-left: 20px;
    }

    .footer {
        text-align: center;
        margin-top: 20px;
        font-style: italic;
        color: #555;
    }
</style>



<body>

    <div class="resume-container">
        <header>
            <h1>{{name}}</h1>
            <p>{{jobTitle}} | Software Engineer | Web Developer</p>
            <p>Email: {{email}} | Phone: {{phone}}</p>
            <p><a href="#">LinkedIn</a> | <a href="#">GitHub</a> | <a href="#">Portfolio</a></p>
        </header>

        <section class="profile">
            <h2>Profile Summary</h2>
            <p>Passionate software engineer with expertise in web development, problem-solving, and scalable
                applications.</p>
        </section>

        <section class="education">
            <h2>Education</h2>
            <div class="entry">
                <h3>Bachelor of Technology in Computer Science</h3>
                <p>XYZ University, 2018 - 2022</p>
            </div>
        </section>

        <section class="experience">
            <h2>Work Experience</h2>
            <div class="entry">
                <h3>Software Engineer</h3>
                <p>ABC Tech | 2022 - Present</p>
                <ul>
                    <li>Developed web applications using HTML, CSS, JavaScript, and React.</li>
                    <li>Optimized database queries to improve performance by 40%.</li>
                    <li>Collaborated with cross-functional teams to deliver scalable solutions.</li>
                </ul>
            </div>
        </section>

        <section class="skills">
            <h2>Skills</h2>
            <ul>
                <li>HTML, CSS, JavaScript</li>
                <li>React, Node.js, Express</li>
                <li>MongoDB, SQL</li>
                <li>Problem Solving & Debugging</li>
            </ul>
        </section>

        <section class="projects">
            <h2>Projects</h2>
            <div class="entry">
                <h3>Portfolio Website</h3>
                <p>A personal portfolio showcasing projects and achievements.</p>
            </div>
            <div class="entry">
                <h3>Task Management App</h3>
                <p>A to-do list web app with user authentication and cloud storage.</p>
            </div>
        </section>

        <section class="footer">
            <p>References available upon request.</p>
        </section>
    </div>

</body>

</html>
    `,
    "template2": `
        <html>
        <head><title>Resume</title></head>
        <body>
            <h2>Professional Resume</h2>
            <h1>{{name}}</h1>
            <h3>{{jobTitle}}</h3>
            <p>Contact: {{email}} | {{phone}}</p>
        </body>
        </html>
    `,
    "template3": `
        <html>
        <head><title>Resume</title></head>
        <body>
            <div style="border: 2px solid black; padding: 10px;">
                <h1 style="color: blue;">{{name}}</h1>
                <h3>{{jobTitle}}</h3>
                <p>Email: {{email}}</p>
                <p>Phone: {{phone}}</p>
            </div>
        </body>
        </html>
    `,
    "template4": `
        <html>
        <head><title>Resume</title></head>
        <body>
            <table border="1" width="100%">
                <tr><th>Name</th><td>{{name}}</td></tr>
                <tr><th>Job Title</th><td>{{jobTitle}}</td></tr>
                <tr><th>Email</th><td>{{email}}</td></tr>
                <tr><th>Phone</th><td>{{phone}}</td></tr>
            </table>
        </body>
        </html>
    `
};

app.post('/generate-pdf', async (req, res) => {
    try {
        const { templateType, name, jobTitle, email, phone } = req.body;
        const selectedTemplate = templates[templateType] || templates["template1"];

        // Replace placeholders with user data
        const htmlContent = selectedTemplate
            .replace("{{name}}", name)
            .replace("{{jobTitle}}", jobTitle)
            .replace("{{email}}", email)
            .replace("{{phone}}", phone);

        // Launch Puppeteer
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
        res.end(pdfBuffer);
    } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).send("Failed to generate PDF");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
