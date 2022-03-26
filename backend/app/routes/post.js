import { Router } from "express";
import { body } from "express-validator";
import sequelize from "../database.js";
import { generateSlug } from "../helpers.js";
import { validate } from "../middlewares.js";
import { onlyAuthorized } from "../protection_middlewares.js";
import { isSlug } from "../validators.js";

const { users: User, posts: Post } = sequelize.models;
const router = Router();

router.get("/user/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const posts = await user.getPosts();
    res.json({ posts });
});

router.get("/user/:username/:slug", async (req, res) => {
    const { username, slug } = req.params;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const post = await user.getPost({ where: { slug } });
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }
    res.json({ post });
});

router.post(
    "/",
    onlyAuthorized,
    body("title")
        .isString()
        .isLength({ min: 4 }),
    body("body")
        .isString(),
    validate,
    async (req, res) => {
        const { user } = req;
        const { title, body } = req.body;
        // TODO: verify if the body is valid
        let slug = generateSlug(title);
        let post = await user.getPost({ where: { slug } });
        while (post) {
            slug = generateSlug(title);
            slug += `-${Math.floor(Math.random() * 9000 + 1000)}`;
            post = await user.getPost({ where: { slug } });
        }
        post = new Post({ title, slug, body });
        await post.save();
        await user.addPost(post);
        res.json({ post });
    }
);

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) {
        return res.status(404).json({
            message: "post not found"
        });
    }
    res.json({ post });
})

router.put(
    "/:id",
    onlyAuthorized,
    async (req, res) => {
        // Todo: implement the update post function
        const { id } = req.params;
        const { title, slug, body } = req.body;
        const { user } = req;
        const post = await user.getPost({ where: { id } });
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }
        const errors = [];
        if (title) {
            if (typeof title != "string" || title.length < 4) {
                errors.push({ field: "title", message: "title format is wrong" });
            } else {
                post.title = title;
            }
        }
        if (slug && slug != post.slug) {
            if (typeof slug != "string" || !isSlug(slug)) {
                errors.push({ field: "title", message: "slug format is wrong" });
            } else {
                const post2 = await user.getPost({ slug });
                if (post2)
                    errors.push({ field: "slug", message: "slug not unique" });
                else
                    post.slug = slug;
            }
        }
        if (errors.length !== 0)
            return res.status(400).json({ errors });
        if (body) {
            // TODO: validate body
            post.body = body;
        }
        await post.save();
        res.json({ message: "Post updated successfully!" });
    }
);

router.delete(
    "/:id",
    onlyAuthorized,
    async (req, res) => {
        const { user } = req;
        const { id } = req.params;
        const post = await user.getPost({ where: { id } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await Post.destroy({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    }
);

export default router;
