const mongoose = require('mongoose');
const Chat = require('./models/chat');
main().then(()=>{
    console.log('connection with mongoose is established');
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');

}

let chats = [
    {
        to: ' Ahmed ali',
        from: 'abc',
        message: 'hello, did u done with work',
        created_at: new Date()

    },
    {
        to: 'john',
        from: 'alice',
        message: 'send me my money abck',
        created_at: new Date()
    },
    {
        to: 'bob',
        from: 'alice',
        message: 'where are you ',
        created_at: new Date()
    }
]
Chat.insertMany(chats).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log('error while inserting data', err);
})



