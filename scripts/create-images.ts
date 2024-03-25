import puppeteer from 'puppeteer';
import fs, { promises as fsPromises } from 'fs';
import csvParser from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://nmpawygvrvljzwkubune.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function ensureDirectoryExists(path: string): Promise<void> {
    try {
      await fsPromises.mkdir(path, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory at ${path}:`, error);
      throw error; // Re-throw the error if needed
    }
  }

async function takeStreetViewScreenshot(lat: number, lng: number, url: string, dir: number, clipRect: { x: number, y: number, width: number, height: number }): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1, // You can adjust this for higher resolution screenshots
  });

  await page.goto(url, { waitUntil: 'networkidle0' });

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

  await browser.close();
}

async function processCSV(filepath: string) {
  const rows = await new Promise<any[]>((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filepath).pipe(csvParser()).on('data', (data) => {
      results.push(data);
    })
    .on('end', () => resolve(results))
    .on('error', reject);
  });

  for (const row of rows) {
    console.log(`--------\nLocation: ${row.name}`)
    const url = row.url;
    for (const hValue of [0, 90, 180, 270]) {
      const modifiedUrl = url.replace(/(,)(\d+)(h)/, `$1${hValue}$3`);
      console.log(`URL ${hValue}h: ${modifiedUrl}`);
      const clipRect = { x: 460, y: 0, width: 1000, height: 1000 };
      await takeStreetViewScreenshot(row.latitude, row.longitude, modifiedUrl, hValue, clipRect);
    }
  }
}

async function uploadScreenshots(filepath: string) {
  const rows = await new Promise<any[]>((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filepath).pipe(csvParser()).on('data', (data) => {
      results.push(data);
    })
    .on('end', () => resolve(results))
    .on('error', reject);
  });

  const startRow = rows.findIndex((r) => r.name === "Fisherman's Bastion");
  for (const row of rows.slice(startRow)) {
    console.log(`--------\nLocation: ${row.name} (${row.latitude}, ${row.longitude})`)
    const url = row.url;
    const { data: insertData, error } = await supabase.from('locations').upsert([{
      latitude: row.latitude,
      longitude: row.longitude,
      country: row.country,
      address: row.address,
      times_played: 0,
      name: row.name
    }]);
    if (error) {
      throw error;
    }
    for (const hValue of [0, 90, 180, 270]) {
      if (row.country === "Hungary") {
        const modifiedUrl = row.url.replace(/(,)(\d+)(h)/, `$1${hValue}$3`);
        console.log(`Taking image... URL ${hValue}h: ${modifiedUrl}`);
        const clipRect = { x: 460, y: 0, width: 1000, height: 1000 };
        await takeStreetViewScreenshot(row.latitude, row.longitude, modifiedUrl, hValue, clipRect);
      }
      const path = `./screenshots/${row.latitude}_${row.longitude}/${hValue}.png`;
      const bucket = 'screenshots';
      const storagePath = `${row.latitude}_${row.longitude}/${hValue}.png`;
      const fileContent = fs.readFileSync(path);
      console.log(`Uploading .... ${storagePath}`);
      const { data, error } = await supabase.storage.from(bucket).upload(storagePath, fileContent, {
        contentType: 'auto',
        upsert: true,
      });
      if (error) {
        throw error;
      } 
    }
  }
}

// Example usage:
//const clipRect = { x: 460, y: 0, width: 1000, height: 1000 }; // Adjust the clip dimensions as needed
//takeStreetViewScreenshot(37.869260, -122.254811, clipRect).then(() => console.log('Screenshot taken'));
//processCSV('./scripts/geocaster-locations.csv');
uploadScreenshots('./scripts/geocaster-locations.csv');
