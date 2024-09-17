import { DataTypes } from "sequelize";

function defineModels(sequelize){
    const User = sequelize.define(
        'User',
        {
            login: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }   
        }
    );
    
    const Legend = sequelize.define(
        'Legend',
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: DataTypes.GEOMETRY,
                allowNull: false
            }
        }
    );
    User.hasMany(Legend, {
        foreignKey: {
            name: 'postedBy',
            allowNull: false
        }
    });
}

async function syncModels(sequelize){
    await sequelize.sync();
}

export {syncModels, defineModels};