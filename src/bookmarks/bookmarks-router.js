const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { bookName, page } = req.body;

    //check if the POST has a book name
    if (!bookName) {
      logger.erro(`Book name is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    //check if the POST has a page number
    if (!page) {
      logger.error(`Page number is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      bookName,
      page
    }

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);

    if (!bookmark) {
      logger.erro(`Bookmark with id ${id} not found.`);
      return res
        .status(400)
        .send('Bookmark not found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.find(bm => bm.id == id);

    if (bookmarkIndex == -1) {
      logger.erro(`List with id ${id} not found.`);
      return res
        .status(400)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`List with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter