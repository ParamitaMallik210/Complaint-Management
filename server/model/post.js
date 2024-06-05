import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
     
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false   
    },
    createdDate: {
        type: Date
    },
    contactNumber: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
    }
});


const post = mongoose.model('post', PostSchema);

export default post;