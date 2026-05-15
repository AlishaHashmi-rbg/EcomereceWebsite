import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 14, showValue = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.floor(rating) ? '#f59e0b' : i - 0.5 <= rating ? '#f59e0b' : 'none'}
          color={i <= rating ? '#f59e0b' : '#d1d5db'}
        />
      ))}
      {showValue && <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 2 }}>{rating}</span>}
    </div>
  );
};

export default StarRating;
