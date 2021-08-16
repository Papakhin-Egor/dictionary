const router = require("express").Router();
const { Card, Rooms, Link } = require("../src/db/models/");
const { Op } = require("sequelize");

router
  .route("/")
  .get(async (req, res) => {
    const roomId = req.session.user.roomid;
    const rooms = await Card.findAll({
      include: [
        {
          model: Rooms,
          where: {
            room_number: roomId,
          },
        },
      ],
    });
    res.render("roomPage", { rooms, user: req.session.user });
  })
  .post(async (req, res) => {
    const { word } = req.body;
    const search = word.split(" ");
    console.log("-->", search[0]);
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
  });
router
  .route("/:id")
  .get(async (req, res) => {
    const cardId = req.params.id;
    const cards = await Card.findOne({ where: { id: cardId } });
    const currLink = await Link.findAll({ where: { id_card: req.params.id } });
    const findComments = await Rooms.findAll({
      where: { room_number: req.session.user.roomid },
    });
    // console.log({ ...cards, ...findComments, ...currLink });
    res.json({ cards, findComments, currLink });
  })
  .post(async (req, res) => {
    const comment = req.body.inputText;
    const userId = req.session.user.id;
    const cardId = req.params.id;
    const roomNumber = req.session.user.roomid;

    const addComment = await Rooms.create({
      id_user: userId,
      id_card: cardId,
      room_number: roomNumber,
      comment: comment,
    });

    res.json(addComment);
  });

module.exports = router;
