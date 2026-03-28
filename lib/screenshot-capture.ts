/**
 * Screenshot Capture Utility
 * 
 * Uses Playwright to capture screenshots of preview pages after generation.
 * Screenshots are saved to public/screenshots/preview-[slug].png
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

export interface ScreenshotOptions {
  pageSlug: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Capture a screenshot of a preview page
 * @param options - Screenshot options
 * @returns Path to the saved screenshot relative to public/
 */
export async function capturePreviewScreenshot(options: ScreenshotOptions): Promise<string | null> {
  const { pageSlug, baseUrl = 'http://localhost:3000', timeout = 30000 } = options;
  
  let browser;
  
  try {
    const previewUrl = `${baseUrl}/preview/${pageSlug}`;
    console.log(`[Screenshot] Capturing screenshot of: ${previewUrl}`);
    
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    });
    
    const page = await context.newPage();
    
    // Disable animations for cleaner screenshots
    await page.addStyleTag({
      content: "* { animation: none !important; transition: none !important; scroll-behavior: auto !important; }"
    });
    
    // Navigate to preview page
    await page.goto(previewUrl, {
      waitUntil: 'networkidle',
      timeout,
    });
    
    // Wait for content to render
    await page.waitForTimeout(3000);
    
    // Scroll to load any lazy content
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
    });
    
    await page.waitForTimeout(1000);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Create screenshots directory
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Generate filename
    const filename = `preview-${pageSlug}.png`;
    const filePath = path.join(screenshotsDir, filename);
    
    // Capture screenshot
    await page.screenshot({ path: filePath, fullPage: true });
    
    console.log(`[Screenshot] Screenshot saved to: /screenshots/${filename}`);
    
    await browser.close();
    
    return `/screenshots/${filename}`;
    
  } catch (error: any) {
    console.error(`[Screenshot] Failed to capture screenshot for ${pageSlug}:`, error.message);
    
    if (browser) {
      await browser.close().catch(() => {});
    }
    
    return null;
  }
}

/**
 * Check if a screenshot exists for a given page slug
 */
export function screenshotExists(pageSlug: string): boolean {
  const screenshotPath = path.join(process.cwd(), 'public', 'screenshots', `preview-${pageSlug}.png`);
  return fs.existsSync(screenshotPath);
}

/**
 * Get the public URL for a screenshot
 */
export function getScreenshotUrl(pageSlug: string): string | null {
  if (!screenshotExists(pageSlug)) {
    return null;
  }
  return `/screenshots/preview-${pageSlug}.png`;
}
