const express = require('express');
const path = require('path');
const router = express.Router();
const exampleController = require('../dist/controllers/test');


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



router.get('/api/data', exampleController.getData);

router.post('/add_user', exampleController.addNewUser);

router.put('/api/update_user/:id', exampleController.updateUserDetails);

router.delete('/delete_user/:id', exampleController.delete_user);

module.exports = router;
