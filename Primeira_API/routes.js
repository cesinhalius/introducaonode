
import { sequelize, criaProduto, listaProduto, atualizaProduto, ListaProdutoPorId, deletaProduto } from './models.js';

export default async function rotas(req, res, dado){
    res.setHeader('Content-type', 'application/json', 'utf-8');

    // Listar todos os produtos
    if(req.method === 'GET' && req.url === '/produtos'){
        try{
            const resposta = await listaProduto(); 

            res.statusCode = 200;

            res.end(JSON.stringify(resposta));

            return;
        }catch(erro){
            console.log('Falha ao listar produtos');
            res.statusCode=500;

            const resposta ={
                erro:{
                    mensagem: `Falha ao listar produtos`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    // Buscar produto pelo identificador unico
    if(req.method === 'GET' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        const id = req.url.split('/')[2];

        try{
            const resposta = await ListaProdutoPorId(id);

            res.statusCode = 200;

            res.end(JSON.stringify(resposta));
    
            return;

        }catch(erro){
            console.log('Falha ao buscar o produto', erro);

            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar o produto ${id}` 
                }
            };

            res.end(JSON.stringify(resposta))
            return;
        }

    };
    //Criação de produto

    if(req.method === 'POST' && req.url === '/produtos'){
        const body = [];
        
        req.on('data', (parte) => {
            body.push(parte);
        }); 

        req.on('end', async() =>{

            const produto = JSON.parse(body);
            
            res.statusCode = 400;

            if(!produto?.nome ){
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém um deles é obrigatório para criação do produto` 
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }
            if( !produto?.preco){
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'preco' não foi encontrado, porém é obrigatório para criação do produto` 
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            try{
                const resposta = await criaProduto(produto);

                res.statusCode = 201;
                
                res.end(JSON.stringify(resposta));

                return;

            } catch(erro){
                console.log('Falha ao criar o produto', erro);

                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao criar o produto ${produto.nome}` 
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }
             
        });
        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição.', erro);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem:'Falha ao processar a requisição'
                }
            };
            res.end(JSON.stringify(resposta));

            return;
        })
        return;
    }

    //Atualização do produto

    if(req.method === 'PATCH' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        const body = [];
        
        req.on('data', (parte) => {
            body.push(parte);
        });

        req.on('end', async() =>{

            const produto = JSON.parse(body);
            
            res.statusCode = 400;

            if(!produto?.nome && !produto?.preco){
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' ou 'preco' não foi encontrado, porém um deles é obrigatório para atualização do produto` 
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            const id = req.url.split('/')[2];

            try{
                const resposta = await atualizaProduto(id, produto);

                res.statusCode = 200;
                
                res.end(JSON.stringify(resposta));

                return;
            }catch(erro){
                console.log('Falha ao atualizar o produto', erro);
    
                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao atualizar o produto ${produto.nome}` 
                    }
                };

                res.end(JSON.stringify(resposta))
                 
                return;
            }
        })
        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição.', erro);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem:'Falha ao processar a requisição'
                }
            };
            res.end(JSON.stringify(resposta));

            return;
        })
        return;
    
    }

    // Remoção de produto
    if(req.method === 'DELETE' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        const id = req.url.split('/')[2];

        try{
            const resposta = await deletaProduto(id);
            
            res.statusCode = 204;
            if(!id.value){
                   
                res.statusCode = 404; 
            }
             res.end();
    
            return;
        }catch(erro){
            console.log('Falha ao remover o produto', erro);

            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao remover o produto ${id}` 
                }
            };

            res.end(JSON.stringify(resposta))
            return;
        }

    };

    res.statusCode = 404;
        
        const resp = {
            erro:{
                mensagem: 'Rota não encontrada',
                url: req.url
            }
        };
                
    res.end(JSON.stringify(resp));
    return;
}