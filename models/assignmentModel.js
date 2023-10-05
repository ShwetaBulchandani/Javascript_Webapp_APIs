import { DataTypes } from "sequelize";

const assignmentModel = (sequelize) => {
    const validationRules = {
        minPoints: 1,
        maxPoints: 10,
        minAttempts: 1,
        maxAttempts: 100,
    };

    const Assignment = sequelize.define(
        'assignment',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
            },
            name: {
                type: DataTypes.STRING,
            },
            points: {
                type: DataTypes.INTEGER,
                validate: {
                    min: validationRules.minPoints,
                    max: validationRules.maxPoints,
                },
            },
            num_of_attempts: {
                type: DataTypes.INTEGER,
                validate: {
                    min: validationRules.minAttempts,
                    max: validationRules.maxAttempts,
                },
            },
            deadline: {
                type: DataTypes.DATE,
            },
            assignment_created: {
                type: DataTypes.DATE,
            },
            assignment_updated: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
            underscored: true, // Use snake_case for column names
            // initialAutoIncrement: 1,
        }
    );

    return Assignment;
};

export default assignmentModel;
