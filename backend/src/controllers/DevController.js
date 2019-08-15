const axios = require('axios');

const Dev = require('../models/Dev');

module.exports = {
  // listagem de reg
  async index(req, res) {
    const { user } = req. headers;

    // instancia do usuario no banco de dados
    const loggedDev = await Dev.findById(user);

    // Buscar no bd
    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } }, // trazer os ids que não seja o id que req
        { _id: { $nin: loggedDev.likes } }, // pegar todos os likes do usuario
        { _id: { $nin: loggedDev.dislikes } },
      ]
    })

    return res.json(users);
  },

  async store(req, res) {
    const {username } = req.body;
    const userExists = await Dev.findOne({ user: username });
    
    if (userExists) {
      return res.json(userExists);
    }

    const response = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data;
    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    })
    
    return res.json(dev); 
  }
};