const puppeteer = require('puppeteer');


//Alterar o ADVERSARIO conforme o jogo, 
//atenção aos que tem nome composto, por exemplo, o atletico mineiro, precisa ser atletico-mg
const ADVERSARIO = 'fortaleza';
const COMPETICAO = 'br24';
const SETOR = 'sul';
var tentativa = 0;

(async () => {
    try {
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
    }

    catch (e) {
        console.error("Erro no processamento", e.message);
    }

})();

async function preencheCheck(page) {
    const checkboxes = await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        return Array.from(checkboxes).map(input => input.getAttribute('id'));
    });

    for (const checkboxId of checkboxes) {
        await page.evaluate((id) => {
            const checkbox = document.getElementById(id);
            checkbox.click();
        }, checkboxId);
    }

    await page.waitForTimeout(1000);

    const reservarButton = await page.$('#submit_fieltorcedor_booking_by_dependente_form');
    await reservarButton.click();
    tentativa++;
    console.log("Tentativa:", tentativa);

    await page.waitForNavigation();
}

async function FillForm(page, browser) {
    try {
        await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/categoria/`);

        const comprarButton = await page.$('.btn.btn-link');
        await comprarButton.click();
        await page.waitForNavigation(); // vai ir para os setores

        await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/modo-de-compra/`); // forçar setor

        //await page.waitForNavigation(); preciso lembrar poruqe eu comentei aqui

        const prosseguirButton = await page.$('.btn.btn-primary');
        await prosseguirButton.click();
        await page.waitForNavigation();

        await preencheCheck(page);

        let url = page.url();

        while (url === `https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/`) {
            await preencheCheck(page);
            url = page.url();
        }

        await browser.close();
    }
    catch (error) {
        console.log('erro ao preencher: ', error.message);
        FillForm(page, browser);
    }
}


async function Login(page, website_url) {
    try {
        await page.goto(website_url);

        const userName = await page.$$('input[name*="username"]');
        await userName[0].type('34468727870');

        const password = await page.$$('input[name*="password"]');
        await password[0].type('Cesar@010203');
        await page.waitForNavigation();
    }
    catch (e) {
        console.log('Erro ao fazer login: ', e.message);
    }
}

function returnError(msg) {
    throw new Error(msg);
}
