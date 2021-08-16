const {Router} = require('express');
const bcrypt = require('bcrypt');
const {User, Rooms} = require('../src/db/models');
const router = Router();
const { powerCheck } = require('../middleware/powerCheck')

router.route('/')
.get(powerCheck, (req, res) => {
    if(req.query.err){
        res.locals.err = "Не все поля заполнены"
    }
    res.render('registerPage', {user: req.session.user})
})
.post(async(req, res) => {
    const {name, email, password, role, room} = req.body;
    console.log(req.body);
    if (name && email && password && room) {
        const pass = await bcrypt.hash(password, 10)
        const newUser = await User.create({name, email, password:pass, role, roomId: req.body.room},{returning:true, plain:true}) 
        await Rooms.create({id_user: newUser.id, room_number: room },{returning:true, plain:true}) 
        if(req.session.user.role.admin) {
          return res.redirect('/admin')
        }else{ return res.redirect('/moder')}
    } else {
       return res.redirect('/signup/?err=field') 
    }
})

module.exports = router
