import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

// Health Check
router.route('/healthz').all(assignmentController.healthz);

// Assignments Routes
router.route('/assignments')
  .get(assignmentController.getAssignments)
  .post(assignmentController.post);

router.route('/assignments/:id')
  .get(assignmentController.getAssignmentUsingId)
  .put(assignmentController.updatedAssignment)
  .delete(assignmentController.remove);

// 404 Route
router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default router;
