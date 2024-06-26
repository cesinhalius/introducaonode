import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, listaPedido } from './models.js';



const db = new sqlite3.Database('./tic.db', (erro) =>{
    if(erro){
        console.log('Erro ao Inicializar o banco de dados');
        
        return;
    }
    console.log('Banco de dados inicializado com sucesso.')
})

fs.writeFile('./mensagem.txt', 'Olá, TIC em Trilha do arquivo', 'utf-8', (erro) => {
    if(erro){
        console.log('Falha ao escrever o arquivo.', erro)
    }

    console.log('Arquivo criado com sucesso')
});


fs.readFile('./mensagem.txt', 'utf-8', (erro, conteudo) =>{
    if(erro){
        console.log('Falha na leitura do arquivo', (erro))
        return;
    }

    console.log(`Conteudo: ${conteudo}` )

    iniciaServidor(conteudo);
})

async function iniciaServidor(conteudo){
    await sequelize.sync();

    //await criarPedido({ valorTotal: 13.00, produtos: [{ id: 1, quantidade: 2}, { id:6, quantidade: 5}] });
    await listaPedido();

    const servidor = http.createServer((req, res) => {
        rotas(req, res, { conteudo } )
    });
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta,host, () => {
        console.log(`Servidor esta executando em http://${host}:${porta}`);
    })    
}



/*function exemploTradicional(){
    console.log('Tradicional')
};

const exemploExpressao = function(){
    console.log('Expressao')
};

const exemploArrow = () => {
    console.log('Arrow')
};*/
