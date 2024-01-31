const express = require('express');
const XLSX = require('xlsx');
//const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/registration');
const Admin = require('../model/admin');
const registration = require('../model/registration');
const bcrypt = require('bcrypt');
const validuser = require('../model/validUser');
const verifyToken = require('../verifytoken')
const router = express.Router();

router.post('/adminRegistration', async (req, res) => {
    console.log("'''''''''''Admin register''''''''''''")
    const { name, email, password } = req.body;
    const roll = "Admin";
    try {
      // Check if the user already exists with the given email
      const existingUser = await Admin.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Generate a salt to use for password hashing
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user instance
      const newUser = new Admin({
        name,
        email,
        roll,
        password: hashedPassword,
        
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/register', async (req, res) => {
    console.log("'''''''''''register''''''''''''")
    const { name, email, password,district,block,panchayath } = req.body;
    const roll = "User";
    try {
      // Check if the user already exists with the given email
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Generate a salt to use for password hashing
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user instance
      const newUser = new registration({
        name,
        district,
        block,
        panchayath,
        email,
        roll,
        password: hashedPassword,
        isRegisterdUser: false
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/login', async (req, res) => {
    console.log("<........login admin........>");
  
    const email = req.body.email;
    const password = req.body.password;
    const roll = req.body.roll;
  
    try {
      let user;
      if (roll === 'Admin') {
        user = await Admin.findOne({ email }).exec();
      } else if (roll === 'User') {
        user = await validuser.findOne({ email }).exec();
      }
  
      if (!user) {
        return res.status(400).send({
          message: "No User Exists"
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({
          message: "Authentication failed: Invalid credentials"
        });
      }
  
      // Authentication successful
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '7d' });
  
      res.status(200).send({
        message: "Authentication successful",
        user: user,
        token: token
      });
    } catch (err) {
      console.log("<........error........>" + err);
      res.status(500).send({
        message: "Internal Server Error"
      });
    }
  });
  

  // router.post('/login', async (req, res) => {
  //   console.log("<........login admin........>");
  
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   const roll = req.body.roll;
  
  //   const adminPromise = Admin.findOne({ email }).exec();
  //   const registrationPromise = validuser.findOne({ email }).exec();
  
  //   Promise.all([adminPromise, registrationPromise])
  //     .then(([admin, user]) => {
  //       if (!admin && !user) {
  //         res.status(400).send({
  //           message: "No User Exists"
  //         });
  //       } else if (roll === 'Admin' && admin && bcrypt.compareSync(password, admin.password)) {
  //         // Authentication for admin
  //         const token = jwt.sign({ userId: admin._id }, 'your-secret-key', { expiresIn: '7d' });
  
  //         res.status(200).send({
  //           message: "Authentication successful",
  //           user: admin,
  //           token: token
  //         });
  //       } else if (roll === 'User' && user && bcrypt.compareSync(password, user.password)) {
  //         // Authentication for user
  //         const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '7d' });
  
  //         res.status(200).send({
  //           message: "Authentication successful",
  //           user: user,
  //           token: token
  //         });
  //       } else {
  //         res.status(401).send({
  //           message: "Authentication failed"
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.log("<........error........>" + err);
  //       res.status(500).send(err);
  //     });
  // });
  // router.post('/login', async (req, res) => {
  //   console.log("<........login admin........>");
  
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   const roll = req.body.roll;
  
  //   const adminPromise = Admin.findOne({ email }).exec();
  //   const registrationPromise = validuser.findOne({ email }).exec();
  
  //   Promise.all([adminPromise, registrationPromise])
  //     .then(([admin, user]) => {
  //       if (!admin && !user) {
  //         res.status(400).send({
  //           message: "No User Exists"
  //         });
  //       } else if (roll === 'Admin' && admin && bcrypt.compareSync(password, admin.password)) {
  //         // Authentication for admin
  //         const token = jwt.sign({ userId: admin._id }, 'your-secret-key', { expiresIn: '7d' });
  
  //         // Exclude password from the admin object in the response
  //         const { password, ...adminWithoutPassword } = admin._doc;
  
  //         res.status(200).send({
  //           message: "Authentication successful",
  //           user: adminWithoutPassword,
  //           token: token
  //         });
  //       } else if (roll === 'User' && user && bcrypt.compareSync(password, user.password)) {
  //         // Authentication for user
  //         const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '7d' });
  
  //         // Exclude password from the user object in the response
  //         const { password, ...userWithoutPassword } = user._doc;
  
  //         res.status(200).send({
  //           message: "Authentication successful",
  //           user: userWithoutPassword,
  //           token: token
  //         });
  //       } else {
  //         res.status(401).send({
  //           message: "Authentication failed"
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.log("<........error........>" + err);
  //       res.status(500).send(err);
  //     });
  // });
  
  router.get('/registerUser', async (req, res) => {
    try {
      // Fetch name and email fields from the registration schema
      const users = await registration.find().select('name email');
  
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/deleteUsers/:userId',async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by ID and delete it
      const deletedUser = await registration.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/reset-password', async (req, res) => {
    console.log(".............reset password................");
    const { email, newPassword } = req.body;
  
    try {
      // Check if the user exists with the provided email
      const user = await validuser.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/reset-Adminpassword', async (req, res) => {
    console.log(".............reset password................");
    const { email, newPassword } = req.body;
  
    try {
      // Check if the user exists with the provided email
      const user = await Admin.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.put('/validUser/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find the user in the registration schema by ID
      const user = await registration.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new validUser object with all the details from the registration document
      const { _id, name, roll, email, password,district,block,panchayath } = user;
      const newUser = new validuser({
        _id,
        name,
        district,
        block,
        panchayath,
        roll,
        email,
        password,
        isRegisterdUser: true
      });
  
      // Save the new user object in the validUser schema
      await newUser.save();
  
      // Delete the user from the registration schema
      await registration.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User registration updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;