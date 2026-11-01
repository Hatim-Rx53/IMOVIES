const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function recordDemo() {
  const videoDir = path.join(__dirname, '../docs/videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log('Launching browser to record video...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    console.log('Step 1: Navigate to Home Page');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    await sleep(2000);

    // Smooth scroll down to explore now showing
    await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
    await sleep(1500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    console.log('Step 2: User Sign In');
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await sleep(1000);

    // Click User Demo quick-fill
    await page.click('button:has-text("User Demo")');
    await sleep(1000);
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    await sleep(1500);

    console.log('Step 3: Browse Movie & View Details');
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await sleep(1000);

    // Click first movie card (e.g. Dune)
    const firstMovieCard = page.locator('.MuiCard-root').first();
    await firstMovieCard.click();
    await page.waitForURL('**/movies/*', { timeout: 10000 });
    await sleep(1500);

    // Scroll through details
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await sleep(1500);

    console.log('Step 4: View Showtimes');
    await page.click('button:has-text("View Showtimes & Book")');
    await page.waitForURL('**/shows', { timeout: 10000 });
    await sleep(1500);

    // Click first available showtime
    const firstShowtime = page.locator('text=seats left').first();
    await firstShowtime.click();
    await page.waitForURL('**/seats', { timeout: 10000 });
    await sleep(2000);

    console.log('Step 5: Interactive Seat Selection with Real-Time Lock');
    await sleep(2000);

    // Pick available seats using data-seat-id
    await page.waitForSelector('[data-seat-id]');
    const seat1 = page.locator('[data-seat-id]').first();
    const seat2 = page.locator('[data-seat-id]').nth(1);

    console.log('Clicking seat 1 and seat 2...');
    await seat1.click({ force: true });
    await sleep(1200);
    await seat2.click({ force: true });
    await sleep(2000);

    // Wait for bottom bar and click Proceed to Checkout
    await page.waitForSelector('button:has-text("Proceed to Checkout")', { timeout: 10000 });
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL('**/checkout', { timeout: 10000 });
    await sleep(2500);

    console.log('Step 6: Checkout and Payment Simulation');
    // Switch tabs
    await page.click('button:has-text("UPI")');
    await sleep(1200);
    await page.click('button:has-text("Net Banking")');
    await sleep(1200);
    await page.click('button:has-text("Credit / Debit Card")');
    await sleep(1500);

    // Click Pay & Confirm
    await page.click('button:has-text("Pay")');
    await page.waitForURL('**/booking-success', { timeout: 15000 });
    await sleep(2500);

    console.log('Step 7: Booking Confirmed & QR Code Ticket');
    await page.click('button:has-text("View & Print Full Ticket")');
    await sleep(2500);
    await page.click('button:has-text("Close")');
    await sleep(1000);

    // Go to My Bookings
    await page.click('button:has-text("Go to My Bookings")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await sleep(2500);

    console.log('Step 8: Admin Portal Showcase');
    // Logout
    await page.click('header .MuiAvatar-root');
    await sleep(600);
    await page.click('li:has-text("Sign Out")');
    await page.waitForURL('**/login', { timeout: 10000 });
    await sleep(1000);

    // Login as Admin
    await page.click('button:has-text("Admin Demo")');
    await sleep(1000);
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    await sleep(1500);

    // Open Admin Console
    await page.click('text="Admin Console"');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await sleep(2500);

    // Scroll through KPI cards & operations
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await sleep(2000);

    // View Movie Management
    await page.click('text="Manage Movie"');
    await page.waitForURL('**/admin/movies', { timeout: 10000 });
    await sleep(3000);

    console.log('Demo walkthrough completed successfully!');
  } catch (err) {
    console.error('Error during demo recording:', err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Rename latest video file to imovies-demo.webm
    const files = fs.readdirSync(videoDir);
    const videoFiles = files.filter((f) => f.endsWith('.webm') && f !== 'imovies-demo.webm');
    if (videoFiles.length > 0) {
      const newest = videoFiles.map((f) => ({
        name: f,
        time: fs.statSync(path.join(videoDir, f)).mtimeMs
      })).sort((a, b) => b.time - a.time)[0];

      const oldPath = path.join(videoDir, newest.name);
      const newPath = path.join(videoDir, 'imovies-demo.webm');
      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }
      fs.renameSync(oldPath, newPath);
      console.log(`Demo video saved to: ${newPath}`);
    }
  }
}

recordDemo();
