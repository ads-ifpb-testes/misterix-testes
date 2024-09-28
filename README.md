# Executar testes:

## 1- Executando testes Unitários e de integração:

1. Execute o comando git clone https://github.com/ads-ifpb-testes/misterix-testes.git
2. Entre na pasta backend do projeto `$ cd ./misterix-testes/backend`
3. Instale as dependências `$ npm i`
4. Rode os testes `$ npm run test`

Diretório dos testes unitários e de integração: ./backend/src/**tests**

## 2- Executando testes de sistema:

1. Volte para a pasta do projeto `$ cd ..`
2. Inicie os containers `$ docker compose up`
3. Abra a pasta dos testes `$ cd ./system-tests`
4. Instale as dependências `$ npm i`
5. Execute algum destes comandos para rodar os testes:
   1. `$ npx playwright test ` testes headless com navegador em plano de fundo
   2. `$ npx playwright test --headed` testes com navegador aberto
   3. `$ npx playwright test --ui` testes com UI parecida com a do Cypress
6. Veja os resultados dos testes `$ npx playwright show-report`

Diretório dos testes de sistema: ./system-tests/tests
