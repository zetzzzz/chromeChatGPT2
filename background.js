// List of URLs to delete
const linksToRemove = [
  "https://chatgpt.com",
  "https://gemini.google.com/app",
  "https://copilot.microsoft.com/",
  "https://www.bing.com/images/create/",
  "https://chat.deepseek.com/",
  "https://duckduckgo.com/?q=DuckDuckGo&ia=chat",
  "https://www.perplexity.ai/",
  "https://poe.com",
  "https://you.com/search?q=hi&fromSearchBar=true&tbm=youchat",
  "https://app.suno.ai/create/",
  "https://www.udio.com/create"
];

// Function to delete specific history URLs
function deleteHistory() {
  console.log("Starting history cleanup...");

  linksToRemove.forEach((url) => {
    chrome.history.search({ text: url, maxResults: 1 }, (results) => {
      if (results.length > 0) {
        chrome.history.deleteUrl({ url: url }, () => {
          console.log(`Deleted history for ${url}`);
        });
      } else {
        console.log(`URL not found in history: ${url}`);
      }
    });
  });
}

// Function to check if we should run the cleanup today
function runOnceDaily() {
  chrome.storage.local.get("lastRun", (result) => {
    const lastRun = result.lastRun || 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // If more than a day has passed, run the cleanup
    if (now - lastRun > oneDay) {
      console.log("Running cleanup...");
      deleteHistory();
      chrome.storage.local.set({ lastRun: now }, () => {
        console.log("Updated lastRun timestamp.");
      });
    } else {
      console.log("Cleanup already ran today. Skipping...");
    }
  });
}

// Call the function when the extension is loaded
runOnceDaily();

