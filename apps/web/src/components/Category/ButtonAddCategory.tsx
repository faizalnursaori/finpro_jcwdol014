import React from 'react';

interface ButtonAddCategoryProps {
  onClick: () => void;
}

export const ButtonAddCategory: React.FC<ButtonAddCategoryProps> = ({
  onClick,
}) => (
  <button className="btn btn-outline btn-primary" onClick={onClick}>
    +New Category
  </button>
);
