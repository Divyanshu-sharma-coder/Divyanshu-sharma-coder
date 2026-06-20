const fs = require('fs');
const path = require('path');

async function updateQuote() {
  try {
    const quotesPath = path.join(__dirname, 'quotes.json');
    if (!fs.existsSync(quotesPath)) {
      throw new Error('quotes.json file is missing in the repository root.');
    }

    const quotes = require(quotesPath);
    if (!quotes || quotes.length === 0) {
      throw new Error('quotes.json is empty or invalid.');
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const item = quotes[randomIndex];

    const quoteText = item.quote || item.text || "Simplicity is the ultimate sophistication.";
    const authorText = item.author || "Unknown";

    // The design block that will go inside the anchors
    const cardDesign = `\n<p align="center">
  <img src="https://readme-daily-quotes.vercel.app/api?author=${encodeURIComponent(authorText)}&quote=${encodeURIComponent(quoteText)}&theme=dark&bg_color=220a28&author_color=ffeb95&accent_color=c56a90" alt="Daily Quote Card">
</p>\n`;

    const readmePath = path.join(__dirname, 'README.md');
    if (!fs.existsSync(readmePath)) {
      throw new Error('README.md file not found.');
    }

    let readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Regex that targets exactly what is between your comments
    const regex = /()[\s\S]*?()/;

    if (regex.test(readmeContent)) {
      // Swaps old content out, puts new content in
      readmeContent = readmeContent.replace(regex, `$1${cardDesign}$2`);
      console.log('Successfully updated the daily quote at the bottom.');
    } else {
      // If you forgot to add the tags, this appends them safely to the bottom
      readmeContent += `\n\n${cardDesign}\n`;
      console.log('Anchors not found. Appended new anchors and quote to the bottom.');
    }

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
  } catch (error) {
    console.error('Error updating quote:', error.message);
    process.exit(0); 
  }
}

updateQuote();
