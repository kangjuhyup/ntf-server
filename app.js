var express = require('express')
var cors = require('cors')
var fs = require('fs')
var multer = require('multer')
var bodyParser = require('body-parser')
var path = require('path')
const conn = require('./db')

conn.connect()
var app = express()

var port = app.listen(process.env.PORT||5050)

var whiteList = ['https://localhost:3000']

var corsOpt = {
    origin : function(origin,callback) {
        var isWhiteListed = whiteList.indexOf(origin) !== -1
        callback(null,isWhiteListed)
    },
    credentials:true
}

app.use(express.json())
var form = multer({dest:__dirname+'/uploads/',})
// app.use(form.array())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOpt))

app.get('/hello', function(req,res) {
    res.send("<h1>Hello!</h1>")
})

app.get('/topList', function(req,res) {
    var fileName = 'test_images/testFlower.jpeg'
    fs.readFile(fileName, function ( e, data) {
        res.send(data);
    })
})

app.get('/select', function(req,res) {
    conn.query('SELECT * FROM ntf', function ( err, row, field) {
        if(!err) {
            res.send(row)
            console.log(row)
        }
    })
})

const fileFilter = (req, file, cb) => {
    // 확장자 필터링
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true); // 해당 mimetype만 받겠다는 의미
    } else {
      // 다른 mimetype은 저장되지 않음
      req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
      cb(null, false);
    }
};

app.post('/uploadFile', form.single('img') ,function(req,res) {
    var fileName = req.file.filename
    var size = req.file.size
    var tempPath = req.file.path
    var targetPath = path.join(__dirname, "./uploads/"+fileName+".jpeg")
    fs.rename(tempPath,targetPath, err => {
        console.log('uploadFile Error :' ,err)
    })

    res.send(tempPath)
})

app.post('/uploadNTF', function(req,res) {
    var body = req.body
    console.log('uploadNTF : ' ,body)
    const [ owner, hash, address, url, description, uploadTime, startPrice, endTime ] = body
})

app.get('/list',(req,res) => {

})

app.listen(port,function(){
    console.log('start. ntf-server')
})