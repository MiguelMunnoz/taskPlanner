const app = require('./src/app');
const PORT = 3000;

const startServer = async () => {
    try {
        app.listen(PORT, ()=>{
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch(error) {
        console.log('[ERROR] Error starting the server.', error);
        process.exit(1);
    }
}

startServer();