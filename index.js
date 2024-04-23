import express from "express";
//const express = require("express");
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

const homeStartingContent = "Welcome to the heart of Futurologix, our digital sanctuary of captivating stories, informative articles, and insightful perspectives. The 'Home' section is your gateway to a world of technology trends, travel adventures, and a myriad of other exciting topics. Explore, read, and get inspired by the diverse voices and engaging content that make up Futurologix's digital home. Whether you're looking for the latest tech news, helpful guides, or just a good read, you'll find it all right here in our 'Home' section";
const aboutContent = "At Futurologix, we are passionate about exploring the ever-evolving landscape of technology and sharing our discoveries with you. Our mission is to keep you informed about the latest tech trends, offer expert insights, and provide a platform for engaging discussions. Whether you're a tech enthusiast, a curious learner, or just someone who enjoys staying on the cutting edge of innovation, you'll find a home here. Join us on this journey of technological discovery and let's explore the future together."
const contactContent = "We value your feedback, questions, and ideas. Your thoughts matter to us, and we're eager to hear from you. Whether you have a tech-related query, want to collaborate, or simply wish to drop a friendly hello, our virtual doors are always open. Feel free to reach out via the provided contact information, and our team will be delighted to assist you. At Futurologix, we believe in the power of connectivity, and we're excited to connect with you!"



app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bhanuprasanth3:BRMQPClCcSKUpanc@cluster0.9ustcal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const postSchema = new mongoose.Schema( {
                                         title: String,
                                         content: String
                                       });

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({})
  .then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      })  
    })
  .catch((error) => {
     console.error(error);
  });
  });


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId })
    .then((post) => {
      if (!post) {
        res.status(404).send("Post not found");
        return;
      }
      else{
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
    })
    .catch((err) => {
      console.error("Error fetching post:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/delete/:postId" , function(req, res) {
  const requestedPostId = req.params.postId;

  Post.deleteOne({ _id: requestedPostId })
  .then((result) => {
    if (result.deletedCount === 0) {
      res.status(404).send("Post not found");
    } else {
      res.redirect("/");
    }
  })
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, () => {
  console.log(`starting server on ${port}`);
});
