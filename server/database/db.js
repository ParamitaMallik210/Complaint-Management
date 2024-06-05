import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = `mongodb+srv://mahakshah252432:UQwQXcRw4Vax6zcy@cluster0.bs6v9mk.mongodb.net/`;
    
    try {
        await mongoose.connect(URL, { useNewUrlParser: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;