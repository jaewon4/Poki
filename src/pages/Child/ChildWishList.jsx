import React, { useState, useEffect } from "react";
import ProductCard from "../../components/UI/ProductCard";
import LinkRegister from "../../components/Modal/LinkRegisterModal";
import { getWishlistByUserId } from "../../api/wishlist.ts";

export default function ChildWishList() {
  const [showModal, setShowModal] = useState(false);
  const [wishList, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch wishlist data when the component mounts
    fetchWishlistData();
  }, [wishList]);

  const fetchWishlistData = async () => {
    try {

      // Fetch all wishlist data for the user ID
      const userid = 36; // Replace with the actual user ID
      const wishlistData = await getWishlistByUserId({ userid: userid });
      // console.log("Fetched wishlist data:", wishlistData);
      setWishlist(wishlistData.data.item);
    } catch (error) {
      console.log("Failed to fetch wishlist data:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div>
        <h1>Wish List</h1>
        {wishList.map((item) => {
          if (item){
            return <ProductCard key={item.id} item={item} />;
          }
        })}
      </div>
      <div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>링크 등록</button>
        {showModal && <LinkRegister onClose={closeModal} />}
      </div>
    </div>
  );
}
