import Router from './route.js';

// Attach routes to the Express app
const attachRoutes = (app, basePath = '/v1') => {
    app.use('/', Router); // Mount the router at the root level
    app.use(basePath, Router); // Mount the router with /v1 prefix
};

export default attachRoutes;
