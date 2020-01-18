import React from "react";

const ChooseCategory = ({ categories, drawerName, isDrawer, chooseWord }) => {
  if (isDrawer) {
    return (
      <div className="prompt">
        <h3>You've been chosen to draw! Please pick a category: </h3>
        {categories.map((category) => (
          <div className="category-container" key={category}>
            <button className="category" onClick={() => chooseWord(category)}>
              {category}
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="prompt">
        <h3>Please hold while {drawerName} selects a category...</h3>
      </div>
    );
  }
};
export default ChooseCategory;
