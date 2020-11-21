const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('./Category');

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Relationships
Category.hasMany(Article);
Article.belongsTo(Category); 

//Article.sync({ force: true });

module.exports = Article;