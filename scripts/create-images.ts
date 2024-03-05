import puppeteer from 'puppeteer';
import { promises as fsPromises } from 'fs';

async function ensureDirectoryExists(path: string): Promise<void> {
    try {
      await fsPromises.mkdir(path, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory at ${path}:`, error);
      throw error; // Re-throw the error if needed
    }
  }

async function takeStreetViewScreenshot(lat: number, lng: number, clipRect: { x: number, y: number, width: number, height: number }): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1, // You can adjust this for higher resolution screenshots
  });

  for (const dir of [0, 90, 180, 270]) {
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=${dir}&pitch=0&fov=90`;
    console.log(streetViewUrl);
    await page.goto(streetViewUrl, { waitUntil: 'networkidle0' });

    // Optional: Adjust based on the specific UI elements you want to wait for or remove
    // Wait for the UI to be ready or hide elements as necessary
    // e.g., await page.evaluate(() => document.querySelector('#elementId').style.display = 'none');

    // Take a clipped screenshot of the specific area
    const outputPath = `./screenshots/${lat}_${lng}/${dir}.png`; // Ensure the folder exists
    const directoryPath = outputPath.substring(0, outputPath.lastIndexOf('/'));

    await ensureDirectoryExists(directoryPath).then(async () => {
        await page.screenshot({ path: outputPath, clip: clipRect });
    }).catch((e) => {
        console.error(`Failed to Take screenshot: ${e}`);
    })
  }

  await browser.close();
}

// Example usage:
const clipRect = { x: 460, y: 0, width: 1000, height: 1000 }; // Adjust the clip dimensions as needed
takeStreetViewScreenshot(37.869260, -122.254811, clipRect).then(() => console.log('Screenshot taken'));