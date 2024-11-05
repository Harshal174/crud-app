const express=require('express');
const cors=require('cors');
require('dotenv').config();
const app=express();
const PORT=process.env.PORT || 5000;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));;
}

const ItemSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Item=mongoose.model('Item',ItemSchema);




app.use(cors());
app.use(express.json());



app.get('/api/items',async(req,res)=>{
    try{
        const items=await Item.find();
        res.json(items);
    }catch(error){
        res.status(500).json({message:"Error fetching items",error})
    }
})



app.post('/api/items',async(req,res)=>{
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    const newItem=new Item({name:req.body.name});
    try {
        const savedItem=await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item', error });
    }
})


app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
});


app.delete('/api/items/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteItem=await Item.findByIdAndDelete(id);
        res.json(deleteItem);
    }catch(error){
        res.status(500).json({message:"Error deleting item",error})
    }
})


app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on port ${PORT}`);
})
