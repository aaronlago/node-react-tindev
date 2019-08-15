const Dev = require('../models/Dev')

module.exports = {
  async store(req, res) {

    console.log(req.io, req.connectedUsers)
    const { devId } = req.params
    const { user } = req.headers

    const loggedDev = await Dev.findById(user)
    const targetDev = await Dev.findById(devId)

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev is not exists.' })
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = req.connectedUsers[user]
      const targetSocket = req.connectedUsers[devId]

      //avisando o usuario logado que ele deu um match, em quem? 
      //No targetDev(que por usa vez), contem todas as informações de quem ele deu match
      if (loggedSocket) {
        req.io.to(loggedSocket).emit('match', targetDev)
      }
      // Fazendo o caminho inverso e avisando as 2 pessoas.
      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev)
      }
    }

    loggedDev.likes.push(targetDev._id)

    await loggedDev.save()

    return res.json(loggedDev)
   }
  };