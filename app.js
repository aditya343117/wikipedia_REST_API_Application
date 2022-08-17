const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema ={
    title: String,
    content: String
}

const Article =mongoose.model("Article", articleSchema);

////////////////////Request Targetting All Articles//////////////////////////////////////////

app.get("/articles", function(req, res){
    Article.find(function(err, foundArticles){
       // res.send(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
});

app.post("/articles", function(req, res){
    console.log();
    console.log();

      const newArticle = new Article({
            title: req.body.title,
            content : req.body.content
      })

      newArticle.save(); 
});

//TODO

app.delete("/articles", function(res, req){
     Article.deleteMany(function(err){
      if(!err){
        res.send("successfully deleted all the articles"); 
      }else{
        res.send(err);
      }
     });
});

/////////////////////////////request targeting a specific articles///////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title:req.params.articleTitle},function(err, foundArticles){
         if(foundArticles){
            res.send(foundArticles);
         }else{
            res.send("No Articles Found for request");
         }
    });
})

.put(function(req, res){
     Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title:req.body.title,
        content:req.body.content},
        {overwrite: true},

        function(err){
            if(!err){
                res.send("successfully updated");
            }
        }
     );
})

.patch(function(req, res){
      Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
         function(err){
            if(!err){
                res.send("successfully update the article");
            }else{
                res.send(err);
            }
         } 
      )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully update the article");
            }else{
                res.send(err);
            }
         } 
          
    )
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
}); 