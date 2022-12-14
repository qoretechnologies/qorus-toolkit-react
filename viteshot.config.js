const playwrightShooter = require('viteshot/shooters/playwright');
const playwright = require('playwright');

module.exports = {
  framework: {
    type: 'react',
  },
  shooter: playwrightShooter(playwright.chromium),
  filePathPattern: '**/*.screenshot.@(js|jsx|tsx|vue|svelte)',
};
