import 'reflect-metadata';
import './database';
import express from 'express';

const app = express()

app.get('/' ,(req,res)=>{
    res.send({mesage:"Olá NLW"})
})

app.listen(3000, () => {console.log("server is running !")})