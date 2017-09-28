'use strict';

const server = require('./server');
const db = require('./database');

// Resources.



// Start the api server using C9 environment.
const { PORT, IP } = process.env;
server.listen(PORT, IP, function() {
    console.log(` ★ Running at: ${IP}:${PORT}`);
})