import Router from './route.js';

// Attach routes to the Express app
const attachRoutes = (app, basePath = '/v1') => {
    app.use('/', Router);
};

export default attachRoutes;
