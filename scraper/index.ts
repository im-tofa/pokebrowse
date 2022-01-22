import * as puppeteer from "puppeteer";

const scrapeSets = async (species: string) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();

    await page.goto(`https://www.smogon.com/dex/ss/pokemon/${species}/`);

    await page.screenshot({ path: "1.png" });

    try {
      await page.waitForSelector(".ExportButton", {
        visible: true,
        timeout: 500,
      });
    } catch (err) {
      console.error(err);
    }

    const agree = await page.$('button[mode="primary"]');
    if (agree) await agree.click();

    const buttons = await page.$$(".ExportButton");

    console.log("hi 1");

    for (const button of buttons) {
      await button.click();
    }

    console.log("hi 2");
    await page.screenshot({ path: "2.png" });

    const data = await page.evaluate(() => {
      const results = document.querySelectorAll(".BlockMovesetInfo");
      console.log("results: ", results);
      const sets = {};
      results.forEach((result) => {
        console.log(result.previousSibling.textContent);
        console.log(result.firstChild.textContent);
        sets[result.previousSibling.textContent] = result.lastChild.textContent;
      });
      return sets;
    });

    console.log("hi 3");
    console.log(data);

    await page.screenshot({ path: "3.png" });
    await browser.close();
    return data;
  } catch (err) {
    console.log(err);
    await browser.close();
    return {};
  }
};

import * as dex from "../server/src/pkmnstats";
import * as fs from "fs";

const main = async () => {
  const sets = {};
  let i = 0;
  for (const species of Object.keys(dex)) {
    console.log(species);
    if (dex[species].num <= 0) continue;
    sets[species] = await scrapeSets(species);
    if (i % 10 === 0)
      fs.writeFileSync("sets.json", JSON.stringify(sets, null, 2));
    i++;
  }
  fs.writeFileSync("sets.json", JSON.stringify(sets, null, 2));
};

main();
