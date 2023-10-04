import Router from './route.js';

// Attach routes to the Express app
const attachRoutes = (app, basePath = '/v1') => {
    app.use(basePath, Router);
};

export default attachRoutes;
