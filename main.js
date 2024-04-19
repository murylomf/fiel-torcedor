const puppeteer = require('puppeteer');

const DATA = "22/04"
const ADVERSARIO = 'ferroviaria';
const COMPETICAO = 'brfm24';
const SETOR = 'sul';

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

async function preencheCheck(page) {
  const checkboxes = await page.$$('input[type="checkbox"]');

  for (const checkbox of checkboxes) {
    await checkbox.click();
    console.log("Clicked on checkbox:", await checkbox.evaluate(input => input.getAttribute('id')));
  }

  const reservar = await page.$x(`//button[contains(text(), 'Reservar')]`);
  await page.waitForTimeout(100);
  await reservar[0].click();

  await page.waitForNavigation();
}
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

  const comprar = await page.$x(`//p[contains(text(), 'Comprar')]`);
  await comprar[0].click();

  await page.waitForNavigation();

  await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/modo-de-compra/`);

  const prosseguir = await page.$x(`//button[contains(text(), 'Prosseguir')]`);
  await prosseguir[0].click();


  await page.waitForNavigation();

  await preencheCheck(page);

  const url = page.url()

  console.log(url)

  if (url == `https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/`) {
    await page.waitForTimeout(1000);
    await preencheCheck(page);
  } else {
    await browser.close()
  }
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