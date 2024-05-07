import React from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChatState } from '../../context/ChatProvider';

export default function FilesSlider() {
    const { attachments } = ChatState();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="slider-container w-full mx-auto mt-1 mb-4 h-auto" style={{ height: "300px" }}>

            {attachments.length > 1 ? (
                <Slider {...settings}>

                    {attachments.map((item, index) => (
                        <div key={index}>
                            <iframe
                                src={`https://drive.google.com/file/d/${item}/preview`}
                                className='w-full  rounded-lg'
                                height={"300px"}
                            ></iframe>
                        </div>
                    ))

                    }
                </Slider>
            ) : (
                <div>
                    <iframe
                        src={`https://drive.google.com/file/d/${attachments[0]}/preview`}
                        className='w-full  rounded-lg bg-transparent shadow-md shadow-gray-800'
                        height={"300px"}
                    ></iframe>
                </div>
            )}

        </div>
    )
}
