const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../dist/controllers/test');
const expenseGroupController = require('../dist/controllers/ExpenseGroupController')
const expenseController = require('../dist/controllers/ExpenseController')

// Define the root route to serve the React app
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../split_wisely_react/build', 'index.html'));
});

router.get('/new_group', (req, res) => {
  res.sendFile(path.join(__dirname, '../../split_wisely_react/build', 'add_group.html'));
});

// router.post('/api/data', async (req, res, next) => {

//   console.log('Received POST request:', req.body); // Log request body
//   next();
// }, exampleController.postData);


// router.get('/api/data', (req, res) => {
//     res.json({ message: __dirname+'This is some data from the server' });
// });



//USER METHODS
router.get('/api/data', userController.getData);

router.post('/add_user', userController.addNewUser);

router.put('/api/update_user/:id', userController.updateUserDetails);

router.delete('/delete_user/:id', userController.delete_user);


//EXPENSE GROUP METHODS
router.post('/api/add_expense_group', expenseGroupController.addNewExpenseGroup);
router.put('/api/update_expense_group/:id', expenseGroupController.editExpenseGroup);
router.delete('/api/delete_expense_group/:id', expenseGroupController.removeExpenseGroup);

//EXPENSE METHODS
router.post('/api/add_expense', expenseController.addNewExpense);
router.put('/api/update_expense/:id', expenseController.editExpense);
router.delete('/api/delete_expense/:id', expenseController.removeExpense);

module.exports = router;
