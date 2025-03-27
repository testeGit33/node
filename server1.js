const { createServer } = require('node:http');
const { URL } = require('node:url');

const port = 3000;
const host = 'localhost';
let valor;

// Função simplificada com fetch
async function getBitcoinPriceBrl(moeda) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl`);
    const data = await response.json();
    return data.bitcoin.brl;
  } catch (error) {
    throw new Error('Falha ao buscar preço do Bitcoin');
  }
}
async function getBitcoinPriceUsd(moeda) {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`);
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      throw new Error('Falha ao buscar preço do Bitcoin');
    }
  }

function verificaPrice(valor, moeda){

    if(moeda=="brl"){
        if(valor<300000){
            return "Preço baixo";
        }else if(valor >=300000 && valor < 450000){
            return "Preço médio";
        }else if(valor>=450000){
            return "Preço alto";
        }
    }else if (moeda =="usd"){
        if(valor<60000){
            return "Preço baixo";
        }else if(valor >=60000 && valor < 80000){
            return "Preço médio";
        }else if(valor>=80000){
            return "Preço alto";
        }
    
    }else{
        return "Moeda não encontrada"
    }
    }

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  
  if (url.pathname === '/price' && req.method === 'GET') {
    try {
        const moeda = url.searchParams.get('moeda');
        if(moeda=="brl"){
             valor = await getBitcoinPriceBrl();

        }else if(moeda=="usd"){
             valor = await getBitcoinPriceUsd();
        }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        preco: valor,
        moeda : moeda,
        classificacao: verificaPrice(valor, moeda)
      }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.statusCode = 404;
    res.end('Rota não encontrada');
  }
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});