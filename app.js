//jshint esversion:6

// Require all nessasary tools
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/BlogWebsiteV2',{useNewUrlParser: true, useUnifiedTopology: true});

// Define constants
const homeStartingContent = "Some home text - nothing special";
const aboutContent = "This page have information about me";
const contactContent = "Contact Info";
const app = express();

// Create DB schema
const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

// Create mongoose model
const Post = mongoose.model("Post", postSchema);

// Set EJS
app.set('view engine', 'ejs');

// Include Express and BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// Main get/posts

app.get('/', (req,res) => {

  // Extract Posts from DB
  Post.find({},function(err, foundItems){
  
    res.render('home', {homeContent: homeStartingContent, postsList: foundItems});

  });

});

app.get('/contact', (req,res) => {
  res.render('contact', {contactContent: contactContent});
});

app.get('/about', (req,res) => {
  res.render('about', {aboutContent: aboutContent});
});

app.get('/compose', (req,res) => {
  res.render('compose');
});

// Add new Data to Server
app.post('/compose', (req,res) => {
  console.log("Post request");

  // Prevent posts flooding - Check if there are less than 10 posts already
  Post.countDocuments({}, (err, count) => {
    console.log(count);

    if (count <= 10 ) {
      
      console.log("less than 10");
      
      // Save composed post to DB
      const post = new Post({
        title: req.body.textTitle,
        content: req.body.textPost
      });
    
      // Redirect to home only if save success
      post.save(function(err){
        if(!err){
          res.redirect("/");
        }
      });

    } else {
      console.log("More than 10 itmes already - Please delete something");
      res.redirect("/");
    }
  });


});

// Show Specific post to Client
app.get('/posts/:postId', (req, res) => {
  
  const requestedId = (req.params.postId);
  console.log("Link points to ID : " + requestedId);
  
  // Find Post from DB
  Post.findOne({_id: requestedId}, function(err, foundItems){
    if(!err){
      res.render('post', {postTitle: foundItems.title ,postContent: foundItems.content});
    } else {
      console.log(err);
    }
  });
  
});

// Start server on localhost:3000 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
