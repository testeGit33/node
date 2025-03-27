const {createServer} = require('node:http');
const {url} = require ('node:url');

port = 3000;
host='localhost';


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


};

const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    
    const url = new URL(req.url, `http://${host}:${port}`);
    
    if (req.method === "GET" && req.url.startsWith("/price")) { // Rota corrigida
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const valor = parseFloat(queryParams.valor); // Conversão para número
        const moeda = queryParams.moeda;

        // Validação de parâmetros
        if (isNaN(valor) || !moeda) {
            res.statusCode = 400;
            return res.end("Parâmetros inválidos! Use: /price?valor=NUMERO&moeda=brl|usd");
        }

        // Processamento
        const resultado = verificaPrice(valor, moeda.toLowerCase());
        res.end(resultado);
        
    } else {
        res.statusCode = 404;
        res.end("Rota não encontrada!");
    }
});


server.listen(port, ()=>{
    console.log(`Server running on http://${host}:${port}`);

});

