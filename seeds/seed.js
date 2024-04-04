const { User, Post, Follow } = require('../models')

const sequelize = require('../config/connection')


const userData = [
    {
        username: `David`,
        password: `password`,
        email: `santiago1.dsrr@gmail.com`
    },
    {
        username: `Mahdi`,
        password: `password`,
        email: `mmiq69@gmail.com`
    },
    {
        username: `salut`,
        password: `password`,
        email: `salut@gmail.com`
    },
]

const bcrypt = require("bcryptjs");

for (let userObj of userData) {
    userObj.password = bcrypt.hashSync(userObj.password, 6)
};

const postData = [
    {
        title: "Stop war",
        content: "ceasfire now",
        userId: 1
    },
    {
        title: "interest rate",
        content: "interest rates seems to be not changing ",
        userId: 3
    },
    {
        title: "AI",
        content: "AI frenzy will cool down?",
        userId: 2
    },
    {
        title: "election",
        content: "another election with two morons",
        userId: 1
    },
    {
        title: "unemployment",
        content: "job market is hot and immigration has not much effect on it",
        userId: 3
    },
    {
        title: "EVs",
        content: "chinese evs are cheap and reliable",
        userId: 2
    },
]

const followData = [
    {
        followingUserId: 3,
        followedUserId: 1
    },
    {
        followingUserId: 3,
        followedUserId: 2
    },
    {
        followingUserId: 1,
        followedUserId: 3
    },
    {
        followingUserId: 1,
        followedUserId: 2
    },
    {
        followingUserId: 2,
        followedUserId: 1
    },
]

const seedIng = async () => {
    await sequelize.sync({ force: false });
    const dbUsers = await User.bulkCreate(userData);
    const dbPosts = await Post.bulkCreate(postData);
    const dbFollows = await Follow.bulkCreate(followData);
    console.log(`Seeding completed :)`);
    process.exit(0)
}

seedIng()