import Post from '../model/post.js';
import dotenv from 'dotenv';

dotenv.config();

const isAdmin = (username, password) => {
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export const createPost = async (request, response) => {
    try {
        const post = new Post(request.body);
        await post.save();

        response.status(200).json('Post saved successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const updatePost = async (request, response) => {
    console.log("in update post",request.body);
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }
          if(request.body.username==="admin"){
            await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
               console.log(request.body,"updated"),
            response.status(200).json('Post updated successfully');
          }
         
          await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
            response.status(200).json('Post updated successfully');

    } catch (error) {
        response.status(500).json(error);
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        if(request.body.username === "admin"){
            await post.delete();

        response.status(200).json('Post deleted successfully');
        }
         await post.delete();

        response.status(200).json('Post deleted successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getAllPosts = async (request, response) => {
    const username = request.query.username;
    const category = request.query.category;
    let posts;

    try {
        if (username) {
            posts = await Post.find({ username });
        } else if (category) {
            posts = await Post.find({ categories: category });
        } else {
            posts = await Post.find({});
        }

        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
}

// Admin functions
export const adminUpdatePost = async (request, response) => {
    const { username, password } = request.body;

    if (!isAdmin(username, password)) {
        return response.status(403).json({ msg: 'Unauthorized' });
    }

    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });

        response.status(200).json('Post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const adminDeletePost = async (request, response) => {
    const { username, password } = request.body;

    if (!isAdmin(username, password)) {
        return response.status(403).json({ msg: 'Unauthorized' });
    }

    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        await post.delete();

        response.status(200).json('Post deleted successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const adminGetPost = async (request, response) => {
    const { username, password } = request.body;

    if (!isAdmin(username, password)) {
        return response.status(403).json({ msg: 'Unauthorized' });
    }

    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const adminGetAllPosts = async (request, response) => {
    const { username, password } = request.body;

    if (!isAdmin(username, password)) {
        return response.status(403).json({ msg: 'Unauthorized' });
    }

    const usernameQuery = request.query.username;
    const category = request.query.category;
    let posts;

    try {
        if (usernameQuery) {
            posts = await Post.find({ username: usernameQuery });
        } else if (category) {
            posts = await Post.find({ categories: category });
        } else {
            posts = await Post.find({});
        }

        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
}
