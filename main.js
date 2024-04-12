const puppeteer = require('puppeteer');

const DATA = "14/04"
const ADVERSARIO = 'atletico-mg';
const COMPETICAO = 'br24';

(async () => {
    // Create a browser instance
    console.log("Create a browser instance")
    const browser = await puppeteer.launch({ headless: false })

    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    const website_url = `https://www.fieltorcedor.com.br/auth/login/`;

    // Open URL in current page
    await Login(page, website_url);

    await FillForm(page, website_url);

    await GoToIndexEndPrint(website_url, page);

    // Close the browser instance
    //await browser.close();
})();

async function FillForm(page) {
   // Find the label with text "09/04"
   const label = await page.$x(`//label[contains(text(), '${DATA}')]`);

   // If the label is found, click on it
   if (label.length > 0) {
     await label[0].click();
     console.log("Clicked on label ", DATA);
   } else {
     console.log("not found", DATA);
   }

   await page.waitForTimeout(1000);

   await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/categoria/`);

   const btn = await page.$x(`//p[contains(text(), 'Comprar')]`);
   await btn[0].click();

   await page.waitForNavigation();

   const gTags = await page.$$('g');
   gTags.forEach(async gTag => {
    console.log(gTag.classList)
    if (!gTag.classList.contains('disabled')) {
      const link = gTag.parentElement;
      if (link.tagName === 'a') {
        link.click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second for navigation to complete
      }
    }
   });

    // await page.waitForTimeout(2000);

    // const ddlProjeto = await page.$$('select[id*="_ddlProjeto"]');
    // await ddlProjeto[0].type('391');

    // const ddlEntregavel = await page.$$('select[id*="_ddlEntregavel"]');
    // await ddlEntregavel[0].type('15099');

    // const ddlAtividade = await page.$$('select[id*="_ddlAtividade"]');
    // await ddlAtividade[0].type('2');

    // const horasFormatadas = `${String(Math.floor(horas / 60)).padStart(2, '0')}:${String(Math.round(horas % 60)).padStart(2, '0')}`;

    // await page.evaluate(({ horasFormatadas }) => {
    //     const example = document.querySelector('input[id*="_txtHoras"]');
    //     example.value = horasFormatadas;
    // }, { horasFormatadas });

    // await page.click('input[id$="_btnAdicionar"]');

    // await page.waitForTimeout(1000);

    // await page.click('input[id$="_btnSalvar"]');

    // await page.keyboard.down('Space');
    // await page.keyboard.up('Space');

    // await page.waitForTimeout(5000);
}

async function GoToIndexEndPrint(website_url, page) {


    await page.screenshot({
        path: 'screenshot.jpg',
    });
}

async function Login(page, website_url) {
    await page.goto(website_url);

    const userName = await page.$$('input[name*="username"]');
    await userName[0].type('12084100836');

    const password = await page.$$('input[name*="password"]');
    await password[0].type('Cesar@010203');


    await page.waitForNavigation();
}