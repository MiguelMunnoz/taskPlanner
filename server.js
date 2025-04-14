const app = require('./src/app');
const PORT = 3000;

const startServer = async () => {
    try {
        app.listen(port, ()=>{
            console.log(`Server running at https://localhost:${PORT}`);
        })
    } catch(error) {
        console.log('[ERROR] Error starting the server.', error);
        process.exit(1);
    }
}

startServer();