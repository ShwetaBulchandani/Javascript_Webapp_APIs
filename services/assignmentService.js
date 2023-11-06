import bcrypt from "bcrypt";
import db from "../config/dbSetup.js";
import logger from "../config/dbSetup.js";

//add a new assignment
export const addAssignment = async (newAssignmentDetails) => {
    try {
        await db.sequelize.sync({ alter: true });
        const newAssignment = await db.assignment.create(newAssignmentDetails);
        logger.info(`New assignment added: ${newAssignment.id}`);
        return newAssignment;
    } catch (error) {
        console.error("Error creating assignment:");
        logger.error(`Error creating assignment: ${error.message}`);
        throw error; // You might want to handle errors more gracefully
    }
}

// delete an assignment
export const removeAssignment = async (id) => {
    try {
        const deletedRowsCount = await db.assignment.destroy({
            where: { id },
        });

        if (deletedRowsCount > 0) {
            logger.info(`Assignment deleted successfully. ID: ${id}`);
        } else {
            logger.warn(`No assignment deleted. ID: ${id} not found.`);
        }

        return deletedRowsCount;
    } catch (error) {
        logger.error(`Error deleting assignment. ID: ${id}. Error: ${error.message}`);
        throw error; 
    }
};


//get all athe assignments
export const getAllAssignments = async () => {
    try {
        const allAssignments = await db.assignment.findAll();
        return allAssignments;
    } catch (error) {
        logger.error(`Error retrieving all assignments: ${error.message}`);
        return null;
    }
}

//get all athe assignments by id
export const getAssignmentById = async (user_id, id) => {
    try {
        const assignmentsById = await db.assignment.findOne({
            where: { id: id },
        });

        if (assignmentById) {
            logger.info(`Assignment retrieved by ID ${id}: ${JSON.stringify(assignmentById)}`);
        } else {
            logger.info(`No assignment found for ID ${id}`);
        }

        return assignmentsById;
    } catch (error) {
        logger.error(`Error retrieving assignment by ID: ${error.message}`);
        throw null;
    }
}

// update the assignments
export const updateAssignment = async (updatedDetails, id) => {
    const { name, points, num_of_attempts, deadline, assignment_updated } = updatedDetails;

    try {
        const [updatedRowsCount] = await db.assignment.update(
            { name, points, num_of_attempts, deadline, assignment_updated },
            { where: { id: id } }
        );

        if (updatedRowsCount > 0) {
            logger.info(`Assignment updated successfully. ID: ${id}`);
        } else {
            logger.warn(`No assignment updated. ID: ${id} not found.`);
        }

        return updatedRowsCount;
    } catch (error) {
        logger.error(`Error updating assignment. ID: ${id}. Error: ${error.message}`);
        throw error; // It's generally a good practice to throw the actual error, not null
    }
};


// authenticate the user
export const authenticate = async (email, password) => {
    try {
        const user = await db.user.findOne({ where: { emailid: email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            logger.info(`Authentication failed for email: ${email}`);
            return null;
        } else {
            logger.info(`User authenticated successfully. User ID: ${user.id}`);
            return user.id;
        }
    } catch (error) {
        logger.error(`Error during authentication for email: ${email}. Error: ${error.message}`);
        throw error; 
    }
};


//health check
export const healthCheck = async () => {
    try {
        await db.sequelize.authenticate();
        logger.info('Health check passed');
        return true;
    } catch (error) {
        logger.error(`Health check failed: ${error.message}`);
        return false;
    }
}