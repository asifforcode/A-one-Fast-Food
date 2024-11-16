import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData: {}});

        const line_items = req.body.items.map((item) =>({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price*100*80
                },
                quantity: item.quantity
            
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: 2*100*80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({success: true,session_url: session.url});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment: true });
            res.json({success: true, message: "Paid"});
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Not Paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// user orders for forntend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({success: true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success: true, data:orders});
    } catch (error) {
        confirm.log(error);
        res.json({success: false, message: "Error"});
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});       
        res.json({success: true, message: "Status Updated"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

export { placeOrder , verifyOrder , userOrders , listOrders , updateStatus };

// ///////////////////////////////////////////////////

// orderController.js

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// // Placing user order from frontend
// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";

//     try {
//         // Save the order details in the database
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address
//         });
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Create an order in Razorpay
//         const orderOptions = {
//             amount: req.body.amount * 100, // Razorpay amount is in paise
//             currency: "INR",
//             receipt: `order_${newOrder._id}`,
//             payment_capture: 1, // Auto capture payment
//         };

//         const order = await razorpay.orders.create(orderOptions);

//         res.json({ success: true, orderId: order.id, amount: req.body.amount, order_id: newOrder._id });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error placing order" });
//     }
// }

// export { placeOrder };

