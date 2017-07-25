var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('social', ['gyms']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/src"));
app.use(bodyParser.json());

app.get('/servicelist/:service',function(req,res){
        var service = req.params.service;
        
        console.log("I recieved a GET request");
        console.log(service);
        db.collection(service).find(function(err, docs){
        console.log(docs);
        res.json(docs);
        });
});

app.post('/servicelist',function(req,res){
        console.log(req.body);
        db.gyms.insert(req.body,function(err,doc){
        res.json(doc);
        });
});

app.delete('/servicelist/:id',function(req,res){
        var id = req.params.id;
        console.log(id);
        db.gyms.remove({_id: mongojs.ObjectId(id)},function(err,doc){
        res.json(doc);
        });
});

app.get('/servicelist/:id',function(req,res){
        var id = req.params.id;
        console.log(id);
        db.gyms.findOne({_id: mongojs.ObjectId(id)},function(err,doc){
        res.json(doc);
        });
});

app.put('/servicelist/:id',function(req,res){
        var id = req.params.id;
        console.log(req.body.name);
        db.gyms.findAndModify({query: {_id:mongojs.ObjectId(id)},
                               update: {$set: {id: req.body.id, name:req.body.name, description: req.body.description}},
                               new: true},function(err,doc){
        res.json(doc);
        });
});

app.listen(3000);
console.log("Server running on 3000");