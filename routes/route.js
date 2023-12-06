import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

router.route('/demo/assignments').post(assignmentController.post);
router.route('/demo/assignments/:id').delete(assignmentController.remove);
router.route('/demo/assignments').get(assignmentController.getAssignments);
router.route('/demo/assignments/:id').put(assignmentController.updatedAssignment);
router.route('/healthz').all(assignmentController.healthz);
router.route('/demo/assignments/:id').get(assignmentController.getAssignmentUsingId);
router.route('/demo/assignments/:id/submission').post(assignmentController.submission);
router.use((req, res) => {
    res.status(405).send('');
});

export default router;




