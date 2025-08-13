// routes/app-routes.js
const express = require('express');
const router = express.Router();
const handlers = require('../handlers/handler'); 


router.get('/', handlers.mainHandler); // server side Router
router.get('/data', handlers.allDataHandler); // All data Router
router.get('/todo-cards', handlers.todoCardsHandler); // All todo cards Router
router.delete('/todo-cards/:id', handlers.todoCardDeleteHandler); // Delete todo card by ID
router.delete('/todo-cards/:id/items/:itemId', handlers.itemDeleteHandler); // Delete item by ID
router.post('/todo-cards', handlers.addCardHandler); // Add new todo card
router.patch('/todo-cards/:id', handlers.updateCardHandler); // Update card title by ID
router.patch('/todo-cards/:id/items/:itemId', handlers.updateItemTitleHandler); // Update item title by ID
router.patch('/todo-cards/:id/item', handlers.updateItemsListHandler); // Update items list in a card by ID
router.put('/todo-cards/:id', handlers.updateCardDataHandler); 

// Export the router
module.exports = router;
