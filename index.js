const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { finished } = require('stream');
const methodOverride = require('method-override');
let my_data = require("./kittis.json");//reading + converting to object

app.use(express.urlencoded({extended:true}));
app.use(express.json());
//let data = fs.readFileSync('./kittis.json');  //we are only reading the file
// let kittiData = JSON.parse(data);//converting to object

//we have the whole object of json in my_data, so we can directly access any key of my_data
//console.log(my_data.chuchu.title);

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));


app.get('/cats', (req, res) =>{
    //res.send('Hello there');
    res.render('index', {kittiData:my_data});
})

app.get('/cats/new', (req, res) => {
    res.render('new');
})

app.post('/cats', (req, res) => {
    const {catname, title, author, breedInfo, imgmain, description, best1name, best1img, best2name, best2img, best3name, best3img} = req.body;
    const obj = {
        name : catname,
        title : title,
        author : author,
        breedInfo : breedInfo,
        img : imgmain,
        description : description,
        bestFriend : [{name:best1name, img:best1img}, {name:best2name, img:best2img}, {name:best3name, img:best3img}]
    }
    const name = catname;
    my_data[name] = obj;
    var dataS = JSON.stringify(my_data, null, 2); 
    fs.writeFile('kittis.json', dataS, finished);
    function finished(err){
        console.log('all set');
    }
    res.redirect('/cats');
})

app.get('/cats/:catName', (req, res) => {
    const {catName} = req.params;
    //browser sense request when there is no base url for the image, therefore we will handle the cat which is not defined
    if(my_data[catName]==undefined){
        res.status(200);
        res.end();
        return;
    }
    res.render('show', {kitti:my_data[catName]});
})

app.get('/cats/:catName/edit', (req, res) => {
    const {catName} = req.params;
    res.render('edit', {kitti:my_data[catName]});
})

app.patch('/cats/:catName', (req, res) => {
    const {catName} = req.params;
    const {title, author, breedInfo, imgmain, description, best1name, best1img, best2name, best2img, best3name, best3img} = req.body;
    const obj = {
        name : catName.toUpperCase(),
        title : title,
        author : author,
        breedInfo : breedInfo,
        img : imgmain,
        description : description,
        bestFriend : [{name:best1name, img:best1img}, {name:best2name, img:best2img}, {name:best3name, img:best3img}]
    }
    const name = catName;
    my_data[name] = obj;
    var dataS = JSON.stringify(my_data, null, 2); 
    fs.writeFile('kittis.json', dataS, finished);
    function finished(err){
        console.log('all set');
    }
    res.redirect('/cats');
})

app.delete('/cats/:catName', (req, res) => {
    const {catName} = req.params;
    // const name = catName;
    //destructuring the old data except the data that is going to be deleted 
    // const { name, ...new_my_data } = my_data;
    // my_data = new_my_data;
    //console.log(my_data[catName]);
    delete my_data[catName];
    var dataS = JSON.stringify(my_data, null, 2); 
    fs.writeFile('kittis.json', dataS, finished);
    function finished(err){
        console.log('all set');
    };
    res.redirect('/cats');
})

app.listen(3000, ()=>{
    console.log('Listening on the port 3000');
})
