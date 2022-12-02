    import React, { useState } from 'react';
    import PropTypes from 'prop-types';
    import Slick from 'react-slick';
    import { backUrl } from '../../config/config';

    import { Overlay, Global, Header, CloseBtn, ImgWrapper, Indicator, SlickWrapper } from './styles';

    const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    return (
        <Overlay>
        <Global />
        <Header>
            <h1>상세 이미지</h1>
            <CloseBtn onClick={onClose}>X</CloseBtn>
        </Header>
        <SlickWrapper>
            <div>
            <Slick
                        initialSlide={0} // 0번째
                        beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)} // 슬라이드
                        infinite // 무한반복
                        arrows={false} // 화살표 사라짐
                        slidesToShow={1}
                        slidesToScroll={1} // 한번에 하나씩
                        >
                {images.map((v) => (
                <ImgWrapper key={v.src}>
                    <img src={`${backUrl}/${v.src}`} alt={v.src} />
                </ImgWrapper>
                ))}
            </Slick>
            <Indicator>
                    {/* 몇번째 이미지인지 확인 */}
                <div>
                    {currentSlide + 1}
                    {' '}
                    /
                    {images.length}
                </div>
            </Indicator>
            </div>
        </SlickWrapper>
        </Overlay>
    );
}; 

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;