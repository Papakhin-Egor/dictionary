const { Router } = require('express');
const router = Router();
const { User, Rooms} = require('../src/db/models')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const { adminCheck } = require('../middleware/powerCheck')


router
.route('/')
.get( async (req, res) => { //powerCheck
  let users
  try {
    users = await User.findAll(
    //   {where: {
    //   id: {[Op.ne]:1} // id админа из базы
    // }}, 
    {order:[['id', 'DESC']]});
  } catch (error) {
    console.log(error)
    return res.render('error', {
      message: 'Не удалось получить записи из базы данных.',
      error: {}
    });
  }
  res.render('adminPage', { users, user: req.session.user})
})
.post(async (req, res) => {
  const { word } = req.body;
  const search = word.split(" ");
  const currPost = await User.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${search[0]}%`,
          },
        },
        {
          name: {
            [Op.iLike]: `%${search[1]}%`,
          },
        },
      ],
    },
  });
  res.redirect(currPost);
})

// удаление юзера
router
.route('/:id')
.delete(async (req, res) => {
  try {
    const k = await User.destroy({where:{id:req.params.id}});
    res.send({status: 200});
  } catch (error) {
    console.log(error);
    res.send({status: error})
  }
})

// редактирование юзера
router
.route('/edit/:id')
.put(async (req, res) => {
  try {
    const {name, email, password, role, room} = req.body;
    console.log(req.body);
    const pass = await bcrypt.hash(password, 10)
    const updatedUser = await User.update({ name, email, role, password: pass, roomId: room},
      {where:{id:req.params.id}, returning: true, plain: true});
    const newRoom = await Rooms.create({id_user: updatedUser[1].dataValues.id, room_number: room },{returning:true, plain:true}) 
    console.log(newRoom);
  } catch (error) {
    return res.json({editStatus: error});
  }
  return res.json({editStatus: 200});
})
.get(async (req, res) => {
  let card = await User.findOne({where:{id:req.params.id}});
  res.render('editPage', { card, user: req.session.user });
});
module.exports = router


