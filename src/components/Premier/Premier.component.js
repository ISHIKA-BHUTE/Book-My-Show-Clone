import React from "react";
import Slider from "react-slick";

import Poster from "../Poster/Poster.component.js";

const Premier = (props) => {
  const settings = {
    infinity: true,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: false,
    InitialSlide: 0
  };
  return (
      <>
      
        <Slider {...settings} >
        {props.PremierImages.map((image)=> (
          <Poster {...image} isDark/>
        ))}
        </Slider>
      </>
  );
};

export default Premier;
