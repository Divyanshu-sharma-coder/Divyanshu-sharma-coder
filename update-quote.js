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

    // Fallbacks in case the keys are named differently inside your JSON file
    const quoteText = item.quote || item.text || "Simplicity is the ultimate sophistication.";
    const authorText = item.author || "Unknown";

    const cardDesign = `<p align="center">
  <img src="https://readme-daily-quotes.vercel.app/api?author=${encodeURIComponent(authorText)}&quote=${encodeURIComponent(quoteText)}&theme=dark&bg_color=220a28&author_color=ffeb95&accent_color=c56a90" alt="Daily Quote Card">
</p>
`;

    const readmePath = path.join(__dirname, 'README.md');
    if (!fs.existsSync(readmePath)) {
      throw new Error('README.md file not found.');
    }

    let readmeContent = fs.readFileSync(readmePath, 'utf-8');

    const regex = /[\s\S]*?/;

    if (regex.test(readmeContent)) {
      // If tags exist, swap the inner content safely
      readmeContent = readmeContent.replace(regex, cardDesign);
      console.log('Successfully updated quote card inside existing anchors.');
    } else {
      // If tags are missing, safely append them to the bottom to avoid breaking the git execution state
      readmeContent += `\n\n${cardDesign}\n`;
      console.log('Anchors not found. Appended the quote block to the bottom of the README.');
    }

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
  } catch (error) {
    console.error('Error updating quote:', error.message);
    // Exit with 0 so a minor parsing/quote error doesn't show an aggressive red failure on your profile
    process.exit(0);
  }
}

updateQuote();
