const { Router } = require("express");
const router = Router();
// const fetch = require('node-fetch');
// const authCheck = require('../middleware/authCheck')
// const db = require('../src/db/models')

const { Card, Link, Rooms, User } = require("../src/db/models/");
const { Op } = require("sequelize");

router
  .route("/")

  .get(async (req, res) => {
    const { letter } = req.query;

    if (letter) {
      const needCard = await Card.findAll({
        where: {
          title: {
            [Op.like]: `${letter}%`,
          },
        },
      });
      res.json(needCard);
    } else {
      const card = await Card.findAll();
      res.locals.user = await User.findOne({ name: req.session.user.name });
      res.render("mainPage", { card, user: req.session.user });
    }
  })
  .post(async (req, res) => {
    const { word } = req.body;
    const search = word.split(" ");
    const currPost = await Card.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search[0]}%`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${search[1]}%`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${search[2]}%`,
            },
          },
          {
            discription: {
              [Op.iLike]: `%${search[0]}%`,
            },
          },
          {
            discription: {
              [Op.iLike]: `%${search[1]}%`,
            },
          },
          {
            discription: {
              [Op.iLike]: `%${search[2]}%`,
            },
          },
        ],
      },
    });
    res.json(currPost);
  })

    router.route("/createpostcard").post(async (req, res) => {
      const data = req.body;
      await Card.create(data);
      res.json(data);
    });

router
  .route("/:id")
  .get(async (req, res) => {
    const currCard = await Card.findOne({ where: { id: req.params.id } });
    const currLink = await Link.findOne({ where: { id: req.params.id } });
    // console.log(currCard, currLink);
    res.json({ currCard, currLink });
  })
  .post(async (req, res) => {
    console.log(req.session.user);
    const userID = req.session.user.id;
    const roomNum = req.session.user.roomid;
    const cardId = req.params.id;
    await Rooms.create({
      id_user: userID,
      id_card: cardId,
      room_number: roomNum,
    });
    res.json();
  });

module.exports = router;
