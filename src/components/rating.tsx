import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
    rating: number;
    handleScroll: () => void;
}

const Rating: React.FC<RatingProps> = ({ rating, handleScroll }) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={i} style={{ color: "#FFA41C" }} />);
    }

    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key={fullStars} style={{ color: "#FFA41C" }} />);
    }

    while (stars.length < 5) {
        stars.push(<FaRegStar key={stars.length} style={{ color: "#FFA41C" }} />);
    }

    return <div className="rating">{rating} {stars}</div>;
};

export default Rating;
