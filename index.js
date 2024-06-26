const express = require('express');
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


const Chat = require('./models/chat');
app.use(express.static(path.join(__dirname, 'public')))

// to parse the data from upcomming body
app.use(express.urlencoded({extended:true}));
//using methodOverride coz ejs has only GET and POST actio
app.use(methodOverride("_method"));

app.set('views', path.join(__dirname,'views'));
app.set('views engine', 'ejs');

main().then(()=>{
    console.log('connection with mongoose is established');
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');

}

//route for getting and printing all the chats
app.get('/chats', async(req,res)=>{
    let chats =  await Chat.find()
    
       // console.log(chats)
        res.render("index.ejs", {chats} );
     
})

//route for renering the chat form
app.get('/chats/new', (req,res)=>{
    res.render("new.ejs")
})

//route for creating/ posting new chat
app.post('/chats', (req, res)=>{
    let {from,to,message} = req.body; 

    let newChat = new Chat({
        from:from,
        to:to,
        message:message,
        created_at: new Date()
    })
    newChat.save().then((res)=>{console.log('chat saved')}).catch(err=>{'error occured', err})
    res.redirect("/chats")
})

//get and then update route
app.get("/chats/:id/edit", async(req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs", {chat})
})

//edit route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { message: newMsg } = req.body;
    try {
        let updatedChat = await Chat.findByIdAndUpdate(id, { message: newMsg }, { runValidators: true, new: true });
        console.log(updatedChat);
        res.redirect("/chats");
    } catch (err) {
        console.log('Error updating chat:', err);
        res.status(500).send('Error updating chat');
    }
});


//Delete Route
app.delete("/chats/:id", async (req,res)=>{
    let {id} =  req.params;
    let deletedChat = await Chat.findByIdAndDelete(id)
    console.log(deletedChat);
    res.redirect("/chats");
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is Listening on PORT ${PORT}`);

})