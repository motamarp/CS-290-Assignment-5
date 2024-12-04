/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Paolo Mota Marques
 * Email: motamarp@oregonstate.edu
 */

var path = require('path');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;

// Set up Handlebars as the view engine
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// Serve static files from the 'static' directory
app.use(express.static('static'));

// Load post data from the JSON file
var posts = require('./postData.json');

// Route for the root path to render all posts
app.get('/', function (req, res) {
    res.render('posts', { posts: posts });
});

// Route for a single post page
app.get('/posts/:id', function (req, res) {
    var postId = parseInt(req.params.id, 10);
    if (postId >= 0 && postId < posts.length) {
        res.render('singlePost', { post: posts[postId] });
    } else {
        res.status(404).render('404');
    }
});

// Route for the 404 page
app.use(function (req, res) {
    res.status(404).render('404');
});

// Start the server
app.listen(port, function () {
    console.log("== Server is listening on port", port);
});
