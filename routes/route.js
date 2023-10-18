import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

router.route('/v1/assignments').post(assignmentController.post);
router.route('/v1/assignments/:id').delete(assignmentController.remove);
router.route('/v1/assignments').get(assignmentController.getAssignments);
router.route('/v1/assignments/:id').put(assignmentController.updatedAssignment);
router.route('/healthz').all(assignmentController.healthz);
router.route('/v1/assignments/:id').get(assignmentController.getAssignmentUsingId);
router.use((req, res) => {
    res.status(404).send('');
});

export default router;