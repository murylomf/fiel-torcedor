const puppeteer = require('puppeteer');

const ADVERSARIO = 'fortaleza';
const COMPETICAO = 'br24';
const SETOR = 'leste-inferior-central';

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

  await FillForm(page, browser);

})();

async function preencheCheck(page) {
  const checkboxes = await page.$$('input[type="checkbox"]');

  for (const checkbox of checkboxes) {
    await checkbox.click();
    console.log("Clicked on checkbox:", await checkbox.evaluate(input => input.getAttribute('id')));
  }

  const reservar = await page.$x(`//button[contains(text(), 'Reservar')]`);
  await page.waitForTimeout(1000);
  await reservar[0].click();
}
async function FillForm(page, browser) {

  await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/categoria/`);

  const comprar = await page.$x(`//p[contains(text(), 'Comprar')]`);
  await comprar[0].click();

  await page.waitForNavigation();

  await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/modo-de-compra/`);

  const prosseguir = await page.$x(`//button[contains(text(), 'Prosseguir')]`);
  await prosseguir[0].click();


  await page.waitForNavigation();

  await preencheCheck(page);

  await page.waitForNavigation();

  let url = page.url()

  while (url == `https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/`) {
    await preencheCheck(page);
    await page.waitForNavigation();
    url = page.url()
  }
  await browser.close();
};

async function Login(page, website_url) {
  await page.goto(website_url);

  const userName = await page.$$('input[name*="username"]');
  await userName[0].type('12084100836');

  const password = await page.$$('input[name*="password"]');
  await password[0].type('Cesar@010203');


  await page.waitForNavigation();
}