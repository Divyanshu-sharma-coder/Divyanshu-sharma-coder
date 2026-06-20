const fs = require('fs');
const path = require('path');

async function updateQuote() {
  try {
    // process.cwd() ensures it looks at the root of your repository
    const quotesPath = path.join(process.cwd(), 'quotes.json');
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

    const cardDesign = `\n<p align="center">
  <img src="https://readme-daily-quotes.vercel.app/api?author=${encodeURIComponent(authorText)}&quote=${encodeURIComponent(quoteText)}&theme=dark&bg_color=220a28&author_color=ffeb95&accent_color=c56a90" alt="Daily Quote Card">
</p>\n`;

    // Force it to target the main root README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    if (!fs.existsSync(readmePath)) {
      throw new Error('README.md file not found at the repository root.');
    }

    let readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Strict regex targeting your anchor tags
    const regex = /(<!-- QUOTE_START -->)[\s\S]*?(<!-- QUOTE_END -->)/;

    if (regex.test(readmeContent)) {
      readmeContent = readmeContent.replace(regex, `$1${cardDesign}$2`);
      console.log('Successfully updated the daily quote at the bottom.');
    } else {
      readmeContent += `\n\n<!-- QUOTE_START -->${cardDesign}<!-- QUOTE_END -->\n`;
      console.log('Anchors not found. Appended new anchors and quote to the bottom.');
    }

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
  } catch (error) {
    console.error('Error updating quote:', error.message);
    process.exit(0); 
  }
}

updateQuote();
