// select package
let fs = require('fs');
let http = require('http');
let url = require('url');


// select file
let replaceir = function(t, i) {
    let output = t.replace(/{%price%}/g, i.price);
    output = output.replace(/{%name%}/g, i.productName);
    output = output.replace(/{%logo%}/g, i.image);
    output = output.replace(/{%details%}/g, i.description); // typo: desciption -> description
    output = output.replace(/{%quantities%}/g, i.quantity);
    output = output.replace(/{%id%}/g , i.id)
    return output;
};
let replaceinfo = function (t , i , s) {
    let output = t.replace(/{%price%}/g, i[s].price);
    output = output.replace(/{%productName%}/g, i[s].productName);
    output = output.replace(/{%description%}/g, i[s].description);
    output = output.replace(/{%from%}/g, i[s].from)
    output = output.replace(/{%important%}/g, i[s].nutrients)
    output = output.replace(/{%quantities%}/g, i[s].quantity)
    output = output.replace(/{%image%}/g, `${__dirname}/overview/fruits.jpg`)
    
    return output
}

let data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
let product = JSON.parse(data);
let overview = fs.readFileSync(`${__dirname}/main/index.html`, 'utf-8');
let details = fs.readFileSync(`${__dirname}/overview/overview.html`, 'utf-8');
let image = fs.readFileSync(`${__dirname}/overview/fruits.jpg`, 'binary');
let cards = fs.readFileSync(`${__dirname}/main/indextwo.html`, 'utf-8');

// function
let server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
  // start the main page or (the overview in the course  )
    if (pathname  === '/' || pathname  === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // typo: Content-type -> Content-Type

    let something = product.map(el => replaceir(cards, el)).join('');
    let finallyPage = overview.replace(/{%container%}/g, something);
    res.end(finallyPage);
    
    }
   // Details page
    else if (pathname === '/overview/details') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let finallypage = replaceinfo(details, product, query.id)
        res.end(finallypage)
    }
  // the page API
    else if (pathname === '/API') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(product));
    }
  // Not found
    else {
    res.writeHead(404, {
        'Content-Type': 'text/html',
        'my-own-header': 'hello-world'
    });
        res.end('<h1>Not Found</h1>');
}
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running on port 8000');
});