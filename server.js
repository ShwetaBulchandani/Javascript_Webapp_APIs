import app from './app.js';  //imported app from app.js
import config from './config/dbConfig.js';

const port = 8080;  //initialized a port to be used

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);   //main app.js file listens to the server.
});