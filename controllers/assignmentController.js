import {
  authenticate,
  addAssignment,
  removeAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  healthCheck,
} from "../services/assignmentService.js";
import db from "../config/dbSetup.js";
import logger from "../config/logger.js";
import StatsD from "node-statsd";
const statsd = new StatsD({ host: "localhost", port: 8125 });
import AWS from "aws-sdk";

const sns = new AWS.SNS();
const snsTopicArn = process.env.SNS_TOPIC_ARN;

// Create assignment
export const post = async (request, response) => {
  try {
    const health = await healthCheck(); //heathcheck for create assignment api
    if (health !== true) {
      logger.warn('Health check failed during post');
      return response
        .status(503)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .send("");
    }

    if (request.method !== "POST") {
      // If the method is not GET, return 405 Method Not Allowed

      logger.warn(`Invalid method ${request.method} for post`);
      return response.status(405).send("");
    }

    const authHeader = request.headers.authorization;

    if (!isValidAuthHeader(authHeader)) {

      logger.warn('Invalid authorization header for post');
      return response.status(401).send("");
    }

    const [email, password] = getCredentialsFromAuthHeader(authHeader);
    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
      return response.status(401).send("");
    }

    // Increment custom metric for post API calls
    statsd.increment('api.post.calls');

    const bodyKeys = Object.keys(request.body);

  const requiredKeys = [
    "name",
    "points",
    "num_of_attempts",
    "deadline",
  ];

  const optionalKeys = [
    "assignment_created",
    "assignment_updated",
  ];

  // Check if all required keys are present
  const missingKeys = requiredKeys.filter(key => !bodyKeys.includes(key));

  if (missingKeys.length > 0) {
    logger.warn(`Missing required keys in the payload for post: ${missingKeys.join(', ')}`);
    return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
  }

  // Check if there are any additional keys in the payload
  const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

  if (extraKeys.length > 0) {
    const errorMessage = {
      message: "Invalid keys in the payload.",
      details: extraKeys.map(key => `Unexpected key: ${key}`),
    };
  
    logger.warn(`Invalid keys in the payload for post: ${extraKeys.join(', ')}`);
    return response.status(400).json(errorMessage);
  }

  // Check if 'name' is a string
     if (typeof request.body.name !== 'string') {
      return response.status(400).json({
        message: "Name should be a string",
      });
  }

  // Check if 'points' is an integer
  if (!Number.isInteger(request.body.points)) {
    return response.status(400).json({
      message: "Points must be an integer.",
    });
  }

  // Check if 'num_of_attempts' is an integer
  if (!Number.isInteger(request.body.num_of_attempts)) {
    return response.status(400).json({
      message: "Number_of_attempts must be an integer.",
    });
  }

  // Check if 'deadline' is a valid date
  const deadlineDate = new Date(request.body.deadline);
  if (isNaN(deadlineDate.getTime())) {
    return response.status(400).json({
      message: "Deadline must be an valid date.",
    });
  }

    let newDetails = request.body;
    newDetails.user_id = authenticated;
    newDetails.assignment_created = new Date().toISOString();
    newDetails.assignment_updated = new Date().toISOString();

    
      const savedDetails = await addAssignment(newDetails);

      logger.info(`Assignment created successfully for post: ${savedDetails.id}`);
      return response.status(201).send("");
    
  } catch (error) {
    handlePostError(response, error);
  }
};

// Helper function to check if the authorization header is valid
const isValidAuthHeader = (authHeader) => {
  return authHeader && authHeader.startsWith("Basic ");
};

// Helper function to extract credentials from the authorization header
const getCredentialsFromAuthHeader = (authHeader) => {
  const base64Credentials = authHeader.split(" ")[1];
  return Buffer.from(base64Credentials, "base64").toString("ascii").split(":");
};

// Helper function to handle errors in the post route
const handlePostError = (response, error) => {
  if (error.status === 403) {
    response.status(403).send("");
  } else if (error.status === 503) {
    response.status(503).send("");
  } else {
    response.status(400).send("");
  }
};

//get all the assignments
export const getAssignments = async (request, response) => {
  try {
    // Health check
    const health = await healthCheck();
    if (health !== true) {
      logger.warn('Health check failed during getAssignments');
      return response
        .status(503)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .send("");
    }

    if (request.method !== "GET") {
      // If the method is not GET, return 405 Method Not Allowed
      logger.warn(`Invalid method ${request.method} for getAssignments`);
      return response.status(405).send("");
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      logger.warn('Invalid authorization header for getAssignments');
      return response.status(401).send("");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
      logger.warn('Authentication failed for getAssignments');
      return response.status(401).send("");
    }

    // Increment custom metric for getAssignments API calls
    statsd.increment('api.getAssignments.calls');

    const assignments = await getAllAssignments();

    if (assignments.length === 0) {
      // Handle the case when no assignments are found for the user
      logger.info('No assignments found for getAssignments');
      return response.status(200).send("");
    } else {
      // Send the assignments as a JSON response
      logger.info(`Assignments retrieved successfully for getAssignments: ${JSON.stringify(assignments)}`);
      return response.status(200).send(assignments);
    }
  } catch (error) {
    if (error.status === 403) {
      return response.status(403).send("");
    } else if (error.status === 503) {
      // Other 503 handling
      logger.error(`Error during getAssignments: ${error.message}`);
      return response.status(503).send("");
    } else {
      logger.error(`Error during getAssignments: ${error.message}`);
      return response.status(400).send("");
    }
  }
};

// get assignment by Id
export const getAssignmentUsingId = async (request, response) => {
  try {
    // Health check
    const health = await healthCheck();
    if (health !== true) {
      logger.warn('Health check failed during getAssignmentById');
      return response
        .status(503)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .send("");
    }

    if (request.method !== "GET") {
      // If the method is not GET, return 405 Method Not Allowed

      logger.warn(`Invalid method ${request.method} for getAssignmentById`);
      return response.status(405).send("");
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      logger.warn('Unauthorized request for getAssignmentById');
      return response.status(401).send("");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
      logger.warn('Authentication failed for getAssignmentById');
      return response.status(401).send("");
    }

    // Increment custom metric for getAssignmentUsingId API calls
    statsd.increment('api.getAssignmentUsingId.calls');

    const assignment = await db.assignment.findOne({
      where: { id: request.params.id },
    });

    if (!assignment) {
      logger.info(`Assignment not found for getAssignmentById: ${request.params.id}`);
      return response.status(204).send("Assignment not found");
    }

    const id = request.params.id;
    const assignments = await getAssignmentById(id);

    if (!assignments) {
      // Handle the case when no assignments are found for the user

      logger.info(`No assignments found for getAssignmentById: ${id}`);
      return response.status(404).send("");
    } else {
      // Send the assignments as a JSON response
      logger.info(`Assignments retrieved successfully for getAssignmentById: ${id}`);
      return response.status(200).send(assignments);
    }
  } catch (error) {
    if (error.status === 403) {
      logger.warn(`Forbidden access for getAssignmentById: ${error.message}`);
      return response.status(403).send("");
    } else if (error.status === 503) {
      // Other 503 handling
      logger.error(`Error during getAssignmentById: ${error.message}`);
      return response.status(503).send("");
    } else {
      logger.error(`Error during getAssignmentById: ${error.message}`);
      return response.status(400).send("");
    }
  }
};

// update assignment
export const updatedAssignment = async (request, response) => {
  try {
    // Health check
    const health = await healthCheck();
    if (health !== true) {
      logger.warn('Health check failed during assignment update');
      return response
        .status(503)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .send("");
    }

    if (request.method !== "PUT") {
      // If the method is not GET, return 405 Method Not Allowed
      logger.warn(`Invalid method ${request.method} for assignment update`);
      return response.status(405).send("");
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      logger.warn('Unauthorized request for assignment update');
      return response.status(401).send("");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
      logger.warn('Authentication failed during assignment update');
      return response.status(401).send("");
    }

    // Increment custom metric for updatedAssignment API calls
    statsd.increment('api.updatedAssignment.calls');

    const assignment = await db.assignment.findOne({
      where: { id: request.params.id },
    });

    if (!assignment) {
      logger.warn(`Assignment not found for update: ${request.params.id}`);
      return response.status(404).send("");
    }

    if (assignment.user_id != authenticated) {
      logger.warn(`Unauthorized user for assignment update: ${authenticated}`);
      return response.status(403).send("");
    }
    const bodyKeys = Object.keys(request.body);

  const requiredKeys = [
    "name",
    "points",
    "num_of_attempts",
    "deadline",
  ];

  const optionalKeys = [
    "assignment_created",
    "assignment_updated",
  ];

  // Check if all required keys are present
  const missingKeys = requiredKeys.filter(key => !bodyKeys.includes(key));

  if (missingKeys.length > 0) {
    logger.warn(`Missing required keys for assignment update: ${missingKeys.join(', ')}`);
    return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
  }

  // Check if there are any additional keys in the payload
  const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key) && !optionalKeys.includes(key));

  if (extraKeys.length > 0) {
    logger.warn(`Invalid keys in the payload for assignment update: ${extraKeys.join(', ')}`);
    return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
  }

   // Check if 'name' is a string
   if (typeof request.body.name !== 'string') {
    return response.status(400).json({
      message: "Name should be a string",
    });
  }

      // Check if 'points' is an integer
      if (!Number.isInteger(request.body.points)) {
        return response.status(400).json({
          message: "Points should be an integer",
        });
      }
  
      // Check if 'num_of_attempts' is an integer
      if (!Number.isInteger(request.body.num_of_attempts)) {
        return response.status(400).json({
          message: "Num_of_attempts should be an integer",
        });
      }
  
      // Check if 'deadline' is a valid date
      const deadlineDate = new Date(request.body.deadline);
      if (isNaN(deadlineDate.getTime())) {
        return response.status(400).json({
          message: "Deadline should be a valid date",
        });
      }

    const id = request.params.id;
    let newDetails = request.body;
    newDetails.assignment_updated = new Date().toISOString();

    
      const updatedDetails = await updateAssignment(newDetails, id);

      // Check if the assignment was updated successfully
      if (updatedDetails) {
        logger.info(`Assignment updated successfully: ${id}`);
        return response.status(204).send("");
      } else {
        logger.warn(`Assignment not found for update: ${id}`);
        return response.status(404).send("");
      
    }
  } catch (error) {
    if (error.status === 503) {
      // Other 503 handling
      logger.error(`Error during assignment update: ${error.message}`);
      return response.status(503).send("");
    } else {
      logger.error(`Error during assignment update: ${error.message}`);
      return response.status(400).send("");
    }
  }
};

// remove the assignment
export const remove = async (request, response) => {
  try {
    // Health check
    const health = await healthCheck();
    if (health !== true) {
      logger.warn('Health check failed during assignment removal');
      return response
        .status(503)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .send("");
    }

    if (request.method !== "DELETE") {
      // If the method is not GET, return 405 Method Not Allowed
      logger.warn(`Invalid method ${request.method} for assignment removal`);
      return response.status(405).send("");
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      logger.warn('Unauthorized request for assignment removal');
      return response.status(401).send("");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    const authenticated = await authenticate(email, password);

    if (authenticated === null) {
      logger.warn('Authentication failed during assignment removal');
      return response.status(401).send("");
    }

    // Increment custom metric for remove API calls
    statsd.increment('api.remove.calls');

    const assignment = await db.assignment.findOne({
      where: { id: request.params.id },
    });

    if (!assignment) {
      logger.warn(`Assignment not found for removal: ${request.params.id}`);
      return response.status(404).send("");
    }

    if (assignment.user_id != authenticated) {
      logger.warn(`Unauthorized user for assignment removal: ${authenticated}`);
      return response.status(403).send("");
    }

    if (request.body && Object.keys(request.body).length > 0) {
      logger.warn('Invalid request body for assignment removal');
      return response.status(400).send("");
    }

    const id = request.params.id;
    const removedDetails = await removeAssignment(id);

    // Check if the assignment was removed successfully
    if (removedDetails > 0) {
      logger.info(`Assignment removed successfully: ${id}`);
      return response.status(204).send("");
    } else {
      logger.warn(`Assignment not found for removal: ${id}`);
      return response.status(404).send("");
    }
  } catch (error) {
    if (error.status === 503) {
      // Other 503 handling
      logger.error(`Error during assignment removal: ${error.message}`);
      return response.status(503).send("");
    } else {
      logger.error(`Error during assignment removal: ${error.message}`);
      return response.status(400).send("");
    }
  }
};

//healthz check for assignment
export const healthz = async (request, response) => {
  try {
    // Increment custom metric for healthz API calls
    statsd.increment('api.healthz.calls');

    if (request.method !== "GET") {
      logger.warn(`Invalid method ${request.method} for healthz check`);
      return response.status(405).send("");
    } else if (request.headers["content-length"] > 0) {
      logger.warn('Invalid content-length for healthz check');
      return response.status(400).send("");
    } else if (request.query && Object.keys(request.query).length > 0) {
      logger.warn('Invalid query parameters for healthz check');
      return response.status(400).send("");
    } else {
      try {
        const health = await healthCheck();
        if (health === true) {
          logger.info('Health check passed');
          return response
            .status(200)
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .json({
              message: "Database is healthy",
            });
        } else {
          logger.warn('Health check failed');
          return response
            .status(503)
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .json({
              message: "Database is not healthy",
            });
        }
      } catch (error) {
        logger.error(`Error during health check: ${error.message}`);
        return response
          .status(503)
          .header("Cache-Control", "no-cache, no-store, must-revalidate")
          .json({
            message: "Database is not healthy",
          });
      }
    }
  } finally {
    // This block will run regardless of the outcome, incrementing the total count
    statsd.increment('api.healthz.total');
  }
};

export const submission = async (request, response) => {
  statsd.increment("endpoint.post.submission");
  const health = await controller.healthCheck();
  if (health !== true) {
      appLogger.warn("Submission API unavailable: health check failed.");
      return response.status(503).header('Cache-Control', 'no-cache, no-store, must-revalidate').send('');
  }

  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
      appLogger.warn("Submission API user authentication failed.");
      return response.status(401).send('');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  const authenticated = await controller.authenticate(email, password);

  if (authenticated === null) {
      appLogger.warn("Submission API user authentication failed.");
      return response.status(401).send('');
  }

  const assignment = await db.assignment.findOne({ where: { id: request.params.id } });

  if (!assignment) return response.status(404).send('');

  const bodyKeys = Object.keys(request.body);

  const requiredKeys = [
      "submission_url",
  ];

  // Check if all required keys are present
  const missingKeys = requiredKeys.filter(key => !bodyKeys.includes(key));

  if (missingKeys.length > 0) {
      appLogger.warn("Submission API Invalid body, parameters missing.");
      return response.status(400).send("Missing required keys: " + missingKeys.join(", "));
  }

  // Check if there are any additional keys in the payload
  const extraKeys = bodyKeys.filter(key => !requiredKeys.includes(key));

  if (extraKeys.length > 0) {
      appLogger.warn("Submission API Invalid body, parameters error.");
      return response.status(400).send("Invalid keys in the payload: " + extraKeys.join(", "));
  }

  const currentDate = new Date();

  if (currentDate > assignment.deadline) {
      appLogger.warn("Submission API submission done after deadline");
      return response.status(400).send('');
  }

  const user_id = await db.user.findOne({ where: { id: authenticated } });

  try {
      const id = request.params.id;
      let newDetails = request.body;
      newDetails.user_id = authenticated;
      newDetails.submission_date = new Date().toISOString();
      newDetails.assignment_updated = new Date().toISOString();
      newDetails.assignment_id = id;

      const submissions = await controller.getSubmissionById(authenticated, id);

      if (submissions.length >= assignment.num_of_attempts) {
          appLogger.warn("Submission API num of attempts exceeded");
          return response.status(403).send('');
      } else {
          const submissionDetails = await controller.addSubmission(newDetails);
          appLogger.info("Submission successfull.");
          AWS.config.update({ region: 'us-east-1' });
          const sns = new AWS.SNS();
          const userInfo = {
              email: user_id.emailid,
          };
          const url = newDetails.submission_url;
          const message = {
              userInfo,
              url,
          };
          sns.publish({
              TopicArn: config.database.TopicArn,
              Message: JSON.stringify(message),
          }, (err, data) => {
              if (err) {
                  appLogger.error("Error publishing to SNS:", err);
                  return response.status(500).send("Error submitting.", err);
              } else {
                  appLogger.info("Submission successful:", data);
                  return response.status(200).send("Submission successful.");
              }
          });
      }
  } catch (error) {
      appLogger.error("Submission API bad request.", error);
      return response.status(400).send('');
  }
};