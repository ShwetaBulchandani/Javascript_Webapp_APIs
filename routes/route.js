import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

router.route('/v2/assignments').post(assignmentController.post);
router.route('/v2/assignments/:id').delete(assignmentController.remove);
router.route('/v2/assignments').get(assignmentController.getAssignments);
router.route('/v2/assignments/:id').put(assignmentController.updatedAssignment);
router.route('/healthz').all(assignmentController.healthz);
router.route('/v2/assignments/:id').get(assignmentController.getAssignmentUsingId);
router.route('/v2/assignments/:id/submission').post(assignmentController.submission);
router.use((req, res) => {
    res.status(405).send('');
});

export default router;