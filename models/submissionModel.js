import { DataTypes } from "sequelize";

const submissionModel = (sequelize) => {
  const Submission = sequelize.define(
    "submission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assignment_id: {
        type: DataTypes.UUID,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      attempts: {
        type: DataTypes.INTEGER,
      },
      submission_date: {
        type: DataTypes.DATE,
      },
      submission_updated: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  );

  return Submission;
};

export default submissionModel;
