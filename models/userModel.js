import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const userModel = (sequelize) => {
    const validationRules = {
        passwordMinLength: 6,
    };

    const hashPassword = async (user) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 12);
        }
    };

    const User = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            emailid: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [validationRules.passwordMinLength, undefined],
                },
            },
            account_created: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            account_updated: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            // initialAutoIncrement: 1,
        }
    );

    User.beforeCreate((user) => {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, 12);
        }
        // Ignore any value provided for account_created
        user.account_created = new Date().toISOString();
        // Ignore any value provided for account_updated
        user.account_updated = new Date().toISOString();
      });
    
      User.beforeUpdate((user) => {
        // Ignore any value provided for account_updated during update
        user.account_updated = new Date().toISOString();
      });

    return User;
};

export default userModel;
