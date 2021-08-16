const { Router } = require('express');
const router = Router();
const { User, Rooms } = require('../src/db/models')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const { powerCheck } = require('../middleware/powerCheck')


router
.route('/')
.get(powerCheck, async (req, res) => { // добавить powerCheck
  let users
  try {
    users = await User.findAll({where:{
      [Op.and]: [{role: {[Op.ne]:"admin"}}, {role: {[Op.ne]:"manager"}}]}
    }, {order:[['id', 'DESC']]});
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось получить записи из базы данных.',
      error: {}
    });
  }
  res.render('moderPage', { users, user:req.session.user })
})

// удаление юзера
router
.route('/:id')
.delete(async (req, res) => {
  try {
    await User.destroy({where:{id:req.params.id}});
    res.send({status: 200});
  } catch (error) {
    res.send({status: error})
  }
})

// редактирование юзера
router
.route('/edit/:id')
.put(async (req, res) => {
  try {
    const {name, email, password, role, room} = req.body;
    const pass = await bcrypt.hash(password, 10)
    const updatedUser = await User.update({ name, email, role, password: pass, roomId: room},{where:{id:req.params.id}, returning: true, plain: true});
    await Rooms.create({id_user: updatedUser[1].dataValues.id, room_number: room },{returning:true, plain:true}) 
    return res.json({status: 200});
  } catch (error) {
    return res.json({status: error});
  }
})
.get(async (req, res) => {
  let user = await User.findOne({where:{id:req.params.id}});
  res.render('moderEditPage', { user });
});
module.exports = router
