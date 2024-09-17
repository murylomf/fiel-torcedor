const puppeteer = require('puppeteer');
const readline = require('readline');

// Create readline interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Hardcoded user and senha
const user = '34468727870';
const senha = 'Cesar@010203';

let ADVERSARIO, COMPETICAO, SETOR_LIST;
let tentativa = 0;

rl.question('Enter ADVERSARIO: ', (adversarioInput) => {
    ADVERSARIO = adversarioInput;

    rl.question('Enter COMPETICAO: ', (competicaoInput) => {
        COMPETICAO = competicaoInput;

        rl.question('Enter SETOR (comma-separated): ', (setorInput) => {
            SETOR_LIST = setorInput.split(',').map(setor => setor.trim()); // Split and trim the input into an array of SETORs
            rl.close(); // Close readline interface after inputs are done

            console.log({ ADVERSARIO, COMPETICAO, SETOR_LIST, user, senha });

            let dependentes = 0;

            (async () => {
                try {
                    console.log("Iniciando");
                    // axios.post("https://ft-stats.onrender.com/validate", {
                    //     message: `Processo inicado: ${user} - ${SETOR}`,
                    //     chatId: 1366258209
                    // });

                    const browser = await puppeteer.launch({ headless: false });

                    const website_url = `https://www.fieltorcedor.com.br/auth/login/`;

                    // Login on a new page before opening the other tabs
                    const loginPage = await browser.newPage();
                    await Login(loginPage, website_url);

                    // Loop through SETOR_LIST to open new tabs
                    for (let SETOR of SETOR_LIST) {
                        const page = await browser.newPage(); // Create a new tab for each SETOR
                        await FillForm(page, browser, SETOR);
                    }
                } catch (e) {
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

            async function FillForm(page, browser, SETOR) {
                try {
                    await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/categoria/`);

                    const comprarButton = await page.$('.btn.btn-link');
                    await comprarButton.click();
                    await page.waitForNavigation(); // Vai ir para os setores

                    await page.goto(`https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/modo-de-compra/`); // Forçar setor

                    const prosseguirButton = await page.$('.btn.btn-primary');
                    await prosseguirButton.click();
                    await page.waitForNavigation();

                    await preencheCheck(page);

                    let url = page.url();

                    while (url === `https://www.fieltorcedor.com.br/jogos/corinthians-x-${ADVERSARIO}-${COMPETICAO}/setor/${SETOR}/`) {
                        await preencheCheck(page);
                        url = page.url();
                    }

                    axios.post("https://ft-stats.onrender.com/validate", {
                        message: `Processo finalizado: ${user} - ${SETOR} - Dependentes: ${dependentes}`,
                        chatId: 1366258209
                    });

                    FillForm(page, browser, SETOR);
                    //await browser.close();
                } catch (error) {
                    console.log('erro ao preencher: ', error.message);
                    FillForm(page, browser, SETOR);
                }
            }

            async function Login(page, website_url) {
                try {
                    await page.goto(website_url);

                    const userName = await page.$$('input[name*="username"]');
                    await userName[0].type(user);

                    const password = await page.$$('input[name*="password"]');
                    await password[0].type(senha);
                    await page.waitForNavigation({ timeout: 0 });
                } catch (e) {
                    console.log('Erro ao fazer login: ', e.message);
                }
            }
        });
    });
});
