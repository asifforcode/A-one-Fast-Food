// import React from 'react'
// import './Header.css'
// import { assets } from '../../assets/assets'

// const Header = () => {
//   return (
//     <div className='header'>
//     <img src={assets.header_img2} alt="" />
//       <div className="header-contents">
//         {/* <h2>Order your favourite food here</h2>
//         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, exercitationem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium, ipsa.</p> */}
//         <button>View Menu</button>
//       </div>
//     </div>
//   )
// }

// export default Header

// ////////////////////////////////////////////////

import React, { useEffect, useRef } from 'react';
import './Header.css';
import { assets } from '../../assets/assets';

const images = [assets.header_img1, assets.header_img2, assets.header_img3, assets.header_img4, assets.header_img5, assets.header_img6]; // Add all image paths here

const Header = () => {
  const scrollRef = useRef(null);
  let currentIndex = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      scrollRef.current.scrollTo({
        left: currentIndex * scrollRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
    <div className='header' ref={scrollRef}>
      {images.map((img, index) => (
        <img src={img} alt={`Header image ${index}`} key={index} />
      ))}
      <div className="header-contents">
        <button>View Menu</button>
      </div>
    </div>
    
    {/* ///////////////////////////////////////////////// */}
    {/* <div className="header-curve">
    {images.map((img, index) => (
        <img src={img} alt={`Header image ${index}`} key={index} />
      ))}
    </div>
      <marquee behavior="" direction="">hello</marquee>
      <marquee className='marq' behavior="" direction="">hello</marquee> */}
    {/* ///////////////////////////////////////////////// */}
    
    </div>
  );
};

export default Header;

