var bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require('mongoose'),
    express=require('express'),
    app= express();
mongoose.connect("mongodb://localhost/restfull_blog_app"); 
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
//MONGOOSE /MODEL CONFIG
var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date,default: Date.now}
});
var Blog=mongoose.model("blog",blogSchema);
//restfull routes
app.get('/',function(req,res){
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log('error')
        }else{
            res.render("index",{blogs:blogs});
        }    
    })
  
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new")
});
//CREATE ROUTE
app.post("/blogs",function(req,res){    
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new")
        }
        else{
            res.redirect("/blogs")
        }
    });
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show",{blog:foundblog})
        }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog:foundblog})
        }
    })
 
})
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});
// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
});
app.listen(3000,function(){
    console.log('server is started and running')
});   