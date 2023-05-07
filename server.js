const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) =>{
     res.sendFile(path.join(__dirname, './public/index.html'));});
app.get('/notes', (req, res) =>{
     res.sendFile(path.join(__dirname, './public/notes.html'));});
app.get('/api', (req, res) =>{
     res.status(200).json(`Please use /notes route`);});
app.get('/api/notes', (req, res) =>{
     fs.readFile('./db/db.json', 'utf-8', (err, data) => {
         if(err){
             console.error('500: Could not read database');
             console.error(err);
             res.sendStatus(500)
         }
         else{
             console.info('200: Succesful GET');
             res.status(200).json(JSON.parse(data));
         }
     })
});
app.get('/api/notes/:id', (req, res) =>{
     console.error(`501: ${req.method} not implmented for /api/notes/:id`);
     res.sendStatus(501)
});
app.post('/api/notes', (req, res) =>{
     console.info(`${req.method} request recieved`);
     const {title, text} = req.body;
     const newNote = {
         title: title,
         text: text,
         id: crypto.randomUUID()
     } 
     if(title && text){
          fs.readFile('./db/db.json', 'utf-8', (err, data) => {
               if(err){
                   console.error('500: Could not read database');
                   console.error(err);
                   res.sendStatus(500)
               } else {
                    const parsed = JSON.parse(data);
                    parsed.push(newNote);
                    const updated = JSON.stringify(parsed, null ,"\t");
                    fs.writeFile('./db/db.json', JSON.stringify(parsed), (err) => {
                         if(err){
                              console.error('500: Could not write to database');
                              console.error(err);
                              res.sendStatus(500);} else 
                              console.info('200: Succesful POST');
               })
               }
          });

const response = {
     status: 'success',
     body: newNote,
};
console.info('200: Succesful POST');
console.log(response);
res.status(200).json(response);  
     } else {
          console.error('500: Invalid POST request');
          console.log(response);
          res.sendStatus(500).json('Error in POST');
     }
})

app.put('/api/notes/:id', (req, res) => {
     console.error(`501: ${req.method} not implmented for /api/notes/:id`);
     res.sendStatus(501)
});
app.delete('/api/notes/:id', (req, res) => { console.info(`${req.method} request recieved for id ${req.params.id}`)
   
fs.readFile('./db/db.json', 'utf-8', (err, data) => {
   
    if(err){
        console.error('500: Could not read database');
        console.error(err);
        res.sendStatus(500);
    
    }else{
        
        let altered = [];
        
        let thisNote;
        
        JSON.parse(data).forEach(note => {
            
            if(note['id'] === req.params.id){
                console.info(`Note id "${note['id']}" found`);
                thisNote = note;
            
            }else altered.push(note);
        });
        
        if(thisNote){
            
            fs.writeFile('./db/db.json', JSON.stringify(altered, null, "\t"), 'utf-8', (err) => {
                
                if(err){
                    console.error('500: Error writing to db')
                    console.error(err);
                    res.sendStatus(500);
                }
               
                else{
                    console.info(`202: Note id "${thisNote['id']}" deleted`);
                    res.sendStatus(202);
                }
            })
        }
        
        else{
            console.error('406: ID not found')
            res.sendStatus(406);
        }
    }
})
})
     

app.listen(PORT, () => {
     console.info(`Listening on PORT ${PORT}`);});