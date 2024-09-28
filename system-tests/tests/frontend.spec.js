const { test, expect } = require('@playwright/test');
const host = 'http://localhost:5076';
const backendHost = 'http://localhost:3000';

test.describe('Testando funcionalidades', () => {
    let page;

    test.describe.configure({mode: 'serial'});
    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    })

    test('Deve possuir formulário de login', async () => {
        await page.goto(host+'/login');
        await page.waitForTimeout(1000);

        await page.getByTestId('login-form').isVisible();   // Expect a title "to contain" a substring.
    });
    
    test('Deve ser possivel fazer login', async () => {
        await page.getByTestId('login').fill('user');
        await page.getByTestId('password').fill('123456');

        const responsePromise = page.waitForResponse(backendHost+'/legends');
        await page.getByTestId('submit-btn').click();
        await responsePromise;
    });

    test('Deve existir mapa com lendas e barra de pesquisa', async () => {
        await page.locator('div#map').isVisible();
        await page.locator('div#searchbar').isVisible();
        await page.locator('button#search-btn').isVisible();
        await page.locator('div#legends').isVisible();
    });

    test('Deve existir formulário para postar lenda', async () => {
        await page.goto(host+'/form');
        await page.waitForTimeout(1000);

        await page.locator('div#map').isVisible();
        await page.locator('div#form').isVisible();
        await page.locator('input#title').isVisible();
        await page.locator('textbox#description').isVisible();
        await page.locator('input#type').isVisible();
        await page.locator('button#submit-btn').isVisible();
    });

    test('Deve ser possivel postar uma lenda', async () => {
        await page.locator('div#map').click();
        await page.locator('input#title').fill('Homem das neves');
        await page.locator('textarea#description').fill('Mostro que abita areas gelidas');
        await page.locator('input#type').fill('Monstro');

        const responsePromise = page.waitForResponse(backendHost+'/legends');
        await page.locator('button#submit-btn').click();
        await responsePromise;
    });

    test('Deve existir ao menos uma lenda postada', async () => {
        const response = page.waitForResponse(backendHost+'/legends/mylegends');
        await page.goto(host+'/mylegends');
        await response;

        await page.locator('div.legend-item').nth(0).isVisible();
    });

    test('Deve ser possivel procurar uma lenda', async () => {
        await page.goto(host);
        await page.waitForTimeout(1000);

        const searchbar = await page.locator('div#searchbar');
        await searchbar.getByRole('textbox').fill('Monstro');

        const responsePromise = page.waitForResponse(backendHost+'/legends/search?query=Monstro');
        await searchbar.getByRole('button').click();
        await responsePromise;

        await page.locator('div.legend-item').nth(0).isVisible();
    });

    test('Deve existir modal de edição da lenda', async () => {
        const response = page.waitForResponse(backendHost+'/legends/mylegends');
        await page.goto(host+'/mylegends');
        await response;
        await page.locator('div.legend-item').nth(0).click();
        await page.waitForTimeout(1000);

        await page.locator('div#map').isVisible();
        await page.locator('input#title').isVisible();
        await page.locator('textarea#description').isVisible();
        await page.locator('input#type').isVisible();
        await page.locator('button#submit-btn').isVisible();
        await page.getByRole('button', {name: 'Salvar Alterações'}).isVisible();
        await page.getByRole('button', {name: 'Deletar'}).isVisible();
        await page.getByRole('button', {name: 'Fechar'}).isVisible();
    });

    test('Deve ser possivel editar lenda', async () => {
        await page.locator('div#map').click();
        await page.locator('input#title').fill('edited');
        await page.locator('textarea#description').fill('edited');
        await page.locator('input#type').fill('edited');
        const responsePromise = page.waitForResponse(backendHost+'/legends/mylegends');
        await page.getByRole('button', {name: 'Salvar Alterações'}).click();
        await responsePromise;
    });

    test('Lenda deve ter sido editada', async () => {
        const legend = await page.locator('div.legend-item').nth(0);
        expect(await legend.getByRole('heading').first().innerText()).toEqual('edited');
        expect(await legend.getByRole('heading').last().innerText()).toEqual('edited');
        expect(await legend.getByRole('paragraph').innerText()).toEqual('edited');
    });

    test('Deve deletar lenda', async () => {
        const count = await page.locator('div.legend-item').count();
        await page.locator('div.legend-item').nth(0).click();
        await page.waitForTimeout(1000);

        const responsePromise = page.waitForResponse(backendHost+'/legends/mylegends');
        await page.getByRole('button', {name: 'Deletar'}).click();
        await responsePromise;
        await page.waitForTimeout(1000);
        expect(await page.locator('div.legend-item').count()).toEqual(count - 1);
    })
});