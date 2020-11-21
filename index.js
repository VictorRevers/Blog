const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');
const app = express();

//controllers
const categoriesController = require('./controllers/CategoriesController');
const articlesController = require('./controllers/ArticlesController');
const usersController =  require('./controllers/UsersController');

//models
const Article = require('./models/Article');
const Category = require('./models/Category');
const User = require('./models/User');

//view engine
app.set('view engine', 'ejs');

//session
app.use(session({
    secret: "abcdefghijklmnopqrstuvwxyz", 
    cookie: { maxAge: 30000000 }
}));

//static files
app.use(express.static('public'));

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db connection
connection.authenticate().then(()=>{
    console.log('DB conectada!');
}).catch((error)=>{
    console.log(error);
});

//using controllers
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);


app.get('/', (req, res)=>{
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles =>{
    
        Category.findAll().then(categories=>{
            res.render('index', {articles: articles, categories: categories});
        });
  
    });
});

app.get('/:slug', (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('article', {article: article, categories: categories});
            });
      
        }else{
            res.redirect('/');
        }
    }).catch( err=>{
        res.redirect('/');
    });
});

app.get("/category/:slug", (req, res)=>{
    var slug= req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}] //join
    }).then(category=>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index', {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect('/');
        }
    }).catch( err =>{
        res.redirect('/');
    });
})

app.listen(3000, ()=>{
    console.log("Servidor rodando!");
})