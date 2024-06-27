import React, { useState } from "react";
import { AddProduct } from "../../../components/add-product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIceCream,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export const MyProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAddProductClick = () => {
    setShowAddProduct(true);
  };

  const handleCancelAddProduct = () => {
    setShowAddProduct(false);
  }
  return (
    <>
      {showAddProduct && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
          <AddProduct cancelAddProduct={handleCancelAddProduct}/>
        </div>
      )}
      <div className="flex items-center">
        <div className="w-full flex gap-3 text-5xl font-bold">
          <FontAwesomeIcon icon={faIceCream} />
          <h2>My Products</h2>
        </div>

        <div className="relative w-full flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute right-5 cursor-pointer"
          />
        </div>

        <div className="w-full flex justify-end gap-3">
          <button
            onClick={handleAddProductClick}
            className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-3" />
            Add A Product
          </button>
        </div>
      </div>
    </>
  );
};