import { DataTypes } from "sequelize";

const submissionModel = (sequelize) => {
    const Submission = sequelize.define(
        'submission',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            assignment_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            submission_url: {
                type: DataTypes.STRING,
                validate: {
                    isUrl: true,
                },
                allowNull: false,
            },
            submission_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            submission_updated: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            underscored: true,
        }
    );

    return Submission;
};

export default submissionModel;
