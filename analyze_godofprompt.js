const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting God of Prompt analysis...');
  
  // Create analysis directory
  if (!fs.existsSync('godofprompt_analysis')) {
    fs.mkdirSync('godofprompt_analysis');
    fs.mkdirSync('godofprompt_analysis/screenshots');
  }
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  console.log('Browser launched. Navigating to godofprompt.ai...');
  
  try {
    // Navigate to the homepage
    await page.goto('https://www.godofprompt.ai', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a moment for any dynamic content to load
    await page.waitForTimeout(3000);
    
    console.log('Page loaded successfully');
    
    // Take homepage screenshot
    await page.screenshot({ 
      path: 'godofprompt_analysis/screenshots/01_homepage.png',
      fullPage: true 
    });
    
    console.log('Homepage screenshot taken');
    
    // Extract basic page info
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        description: document.querySelector('meta[name="description"]')?.content || 'No description found'
      };
    });
    
    console.log('Page info extracted:', pageInfo);
    
    // Extract navigation menu
    const navigation = await page.evaluate(() => {
      const navElements = Array.from(document.querySelectorAll('nav a, .nav a, [role="navigation"] a, header a'));
      return navElements.map(el => ({
        text: el.textContent.trim(),
        href: el.href || el.getAttribute('href'),
        isButton: el.tagName.toLowerCase() === 'button',
        className: el.className
      })).filter(item => item.text && item.text.length > 0);
    });
    
    console.log('Navigation extracted:', navigation);
    
    // Extract main content and value proposition
    const mainContent = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        level: h.tagName.toLowerCase(),
        text: h.textContent.trim()
      }));
      
      const ctaButtons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]')).map(btn => ({
        text: btn.textContent.trim(),
        className: btn.className,
        href: btn.href || btn.getAttribute('href')
      })).filter(btn => btn.text);
      
      return {
        headings: headings.slice(0, 10), // First 10 headings
        ctaButtons: ctaButtons.slice(0, 5) // First 5 CTA buttons
      };
    });
    
    console.log('Main content extracted:', mainContent);
    
    // Save initial findings
    const initialAnalysis = {
      timestamp: new Date().toISOString(),
      pageInfo,
      navigation,
      mainContent
    };
    
    fs.writeFileSync('godofprompt_analysis/01_homepage_analysis.json', JSON.stringify(initialAnalysis, null, 2));
    
    console.log('Phase 1 complete. Starting navigation exploration...');
    
    // Phase 2: Explore Navigation
    const explorationResults = [];
    
    // Try to find and click on main navigation items
    const mainNavLinks = navigation.filter(nav => 
      nav.href && 
      !nav.href.includes('mailto:') && 
      !nav.href.includes('tel:') &&
      !nav.href.includes('#') &&
      nav.text.toLowerCase().match(/pricing|prompt|categor|about|feature/i)
    );
    
    console.log('Found main nav links to explore:', mainNavLinks.map(n => n.text));
    
    for (let i = 0; i < Math.min(mainNavLinks.length, 5); i++) {
      const navItem = mainNavLinks[i];
      console.log(`Exploring: ${navItem.text} - ${navItem.href}`);
      
      try {
        await page.goto(navItem.href, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForTimeout(2000);
        
        const pageContent = await page.evaluate(() => ({
          title: document.title,
          url: window.location.href,
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).slice(0, 8).map(h => ({
            level: h.tagName.toLowerCase(),
            text: h.textContent.trim()
          })),
          paragraphs: Array.from(document.querySelectorAll('p')).slice(0, 5).map(p => p.textContent.trim()).filter(t => t.length > 20)
        }));
        
        await page.screenshot({ 
          path: `godofprompt_analysis/screenshots/02_${navItem.text.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`,
          fullPage: true 
        });
        
        explorationResults.push({
          navItem: navItem.text,
          url: navItem.href,
          content: pageContent
        });
        
        console.log(`✓ Explored: ${navItem.text}`);
        
      } catch (error) {
        console.log(`✗ Error exploring ${navItem.text}:`, error.message);
        explorationResults.push({
          navItem: navItem.text,
          url: navItem.href,
          error: error.message
        });
      }
    }
    
    // Save exploration results
    fs.writeFileSync('godofprompt_analysis/02_navigation_exploration.json', JSON.stringify(explorationResults, null, 2));
    
    console.log('Navigation exploration complete. Proceeding to pricing analysis...');
    
    // Phase 3: Deep dive on pricing
    try {
      const pricingUrls = [
        'https://www.godofprompt.ai/pricing',
        'https://www.godofprompt.ai/plan',
        'https://www.godofprompt.ai/subscribe'
      ];
      
      let pricingFound = false;
      let pricingAnalysis = null;
      
      for (const pricingUrl of pricingUrls) {
        try {
          console.log(`Trying pricing URL: ${pricingUrl}`);
          await page.goto(pricingUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await page.waitForTimeout(2000);
          
          const pricingContent = await page.evaluate(() => {
            // Look for pricing indicators
            const prices = Array.from(document.querySelectorAll('*')).filter(el => 
              el.textContent.match(/\$\d+|\d+\s*USD|\d+\s*\/\s*month|\d+\s*per\s*month|free|premium|pro|basic/i)
            ).map(el => ({
              text: el.textContent.trim(),
              tag: el.tagName.toLowerCase(),
              className: el.className
            })).slice(0, 20);
            
            const planBoxes = Array.from(document.querySelectorAll('[class*="plan"], [class*="pricing"], [class*="tier"]')).map(box => ({
              content: box.textContent.trim().substring(0, 500),
              className: box.className
            }));
            
            return {
              title: document.title,
              url: window.location.href,
              prices,
              planBoxes: planBoxes.slice(0, 10),
              hasPaymentForms: document.querySelectorAll('form, [class*="payment"], [class*="checkout"]').length > 0
            };
          });
          
          if (pricingContent.prices.length > 0 || pricingContent.planBoxes.length > 0) {
            await page.screenshot({ 
              path: 'godofprompt_analysis/screenshots/03_pricing.png',
              fullPage: true 
            });
            
            pricingAnalysis = pricingContent;
            pricingFound = true;
            console.log('✓ Pricing page found and analyzed');
            break;
          }
          
        } catch (error) {
          console.log(`No pricing found at ${pricingUrl}`);
        }
      }
      
      if (!pricingFound) {
        console.log('No dedicated pricing page found, checking homepage for pricing...');
        await page.goto('https://www.godofprompt.ai', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        pricingAnalysis = await page.evaluate(() => {
          const prices = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent.match(/\$\d+|\d+\s*USD|\d+\s*\/\s*month|free|premium|pro|basic/i)
          ).map(el => el.textContent.trim()).slice(0, 10);
          
          return {
            source: 'homepage',
            prices,
            note: 'Pricing extracted from homepage'
          };
        });
      }
      
      fs.writeFileSync('godofprompt_analysis/03_pricing_analysis.json', JSON.stringify(pricingAnalysis, null, 2));
      
    } catch (error) {
      console.log('Error in pricing analysis:', error.message);
    }
    
    console.log('Analysis complete! Check the godofprompt_analysis folder for results.');
    console.log('Screenshots saved in godofprompt_analysis/screenshots/');
    
    // Keep browser open for manual inspection
    console.log('Browser will remain open for manual inspection. Close it when done.');
    
  } catch (error) {
    console.error('Error during analysis:', error);
    await browser.close();
  }
  
})().catch(console.error);