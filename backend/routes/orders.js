
const express = require('express');
const router = express.Router();  
const cookieParser = require("cookie-parser");


router.use(cookieParser());
router.post('/', async (req, res) => {
    try {
      const { orders, total_amount, userId } = req.body;
          const user = await req
            .db("users")
            .where("userid", userId)
            .first();
      const username = user.username
      const created_at = new Date();
      
      await Promise.all(orders.map(async (order) => {
        await req.db('orders').insert({
          ...order,
          total_amount: total_amount,
          userid: userId,
          created_at: created_at
        });
      }));
      
      res.status(201).json({ message: 'Orders created successfully' });
      // res.cookie("userId", userId, { secure: false });
      // res.cookie("username", username, { secure: false });
      // console.log(userId, username);
      // res.redirect("http://127.0.0.1:5500/html/checkout.html");
    } catch (error) {
      console.error('Error creating orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.get("/admin", async (req, res) => {
  try {
    const orders = await req.db("orders").select("*");

    for (const order of orders) {
      const user = await req.db("users").where("userid", order.userid).first();
      // Assign user details to the order object
      order.username = user.username;
      order.address = user.address;
      order.phone_number = user.phone_number;
    }

    res.json({ orders: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;