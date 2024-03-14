const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv')
const UserModel = require('./models/User')


const app = express();
const corsOptions = {
  origin: ['https://imageuploader-client.vercel.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
dotenv.config();
app.use(express.json())
app.use(express.static('public'))

const PORT = process.env.PORT || 3001

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/Images')
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
app.get('/', (req,res)=>{
    res.json('hello')
})

app.post('/upload',upload.single('file'),(req,res)=>{
        UserModel.create({image: req.file.filename})
        .then(result => res.json(result))
        .catch(err => console.log(err))
})

app.get('/getImage', (req,res)=>{
    UserModel.find()
    .then(users =>res.json(users))
    .catch(err => res.json(err))
})



mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
