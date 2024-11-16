import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:"",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  // useEffect(()=>{
  //   console.log(data);
  // },[data]);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item.id]>0){
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item.id];
        orderItems.push(itemInfo);
      }
    })
    // console.log(orderItems);
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+2,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if (response.data.success){
     const {session_url} = response.data;
      window.location.replace(session_url);
    }
    else{
      alert("Error");
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    if (!token){
      navigate('/cart');
    }
    else if(getTotalCartAmount()===0)
    {
      navigate('/cart');
    }
  },[token]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder


///////////////////////////////////////////////////////////////////////

// import React, { useContext, useState } from 'react';
// import './PlaceOrder.css';
// import { StoreContext } from '../../context/StoreContext';
// import axios from 'axios';

// const PlaceOrder = () => {
//   const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     const orderItems = food_list.filter(item => cartItems[item.id] > 0).map(item => ({
//       ...item,
//       quantity: cartItems[item.id]
//     }));
    
//     const orderData = {
//       address: data,
//       items: orderItems,
//       amount: getTotalCartAmount() + 2, // Including delivery charge
//     };

//     try {
//       const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
//       if (response.data.success) {
//         const { session_url } = response.data;
//         window.location.replace(session_url); // Redirect to the payment gateway
//       } else {
//         alert("Error placing order.");
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       alert("Order placement failed.");
//     }
//   };

//   const openRazorpayCheckout = async () => {
//     const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

//     const orderDetails = {
//       amount: getTotalCartAmount() * 100, // Convert to the smallest currency unit (e.g., paise)
//       currency: "INR",
//     };

//     try {
//       const { data: { order_id } } = await axios.post(`${url}/api/order/razorpay`, orderDetails);

//       const options = {
//         key: razorpayKeyId,
//         amount: orderDetails.amount,
//         currency: orderDetails.currency,
//         name: "Your Company Name",
//         description: "Order Payment",
//         order_id,
//         handler: (response) => {
//           console.log("Payment successful:", response);
//           alert("Payment successful!");
//         },
//         prefill: {
//           name: `${data.firstName} ${data.lastName}`,
//           email: data.email,
//           contact: data.phone,
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Error opening Razorpay:", error);
//     }
//   };

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
//           <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
//         </div>
//         <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
//         <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
//         <div className="multi-fields">
//           <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
//           <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
//         </div>
//         <div className="multi-fields">
//           <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" />
//           <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
//         </div>
//         <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Total</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>${getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
//             </div>
//           </div>
//           <button type="button" onClick={openRazorpayCheckout}>PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;

