import express, {Application, Request, Response} from 'express';

const app: Application = express();
const port: number = 3000;


app.get('/',(req:Request, res:Response)=>{
    console.log('api was hit')
    res.send('<h1>Hey there......</h1>');
})

app.get('/login',(req:Request,res:Response)=>{
    res.send('Welcome to login page')
})

app.listen(port,()=>{
    console.log(`Server is up and running on http://localhost:${port}`);
    
})