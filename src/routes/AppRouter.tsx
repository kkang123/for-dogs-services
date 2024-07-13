import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectRoute } from "./ProtectRoute";

import Home from "../pages/home/home";
import BuyerSignUp from "@/pages/SignUp/BuyerSignUp";
import SellerSignUp from "@/pages/SignUp/SellerSignUp";
import Login from "@/pages/Login/Login";
// import FindID from "@/pages/Login/FindID";
// import FindPassword from "@/pages/Login/FindPassword";
import MyProfile from "@/pages/SignUp/MyProfile";

// 상품 판매
import SellProductDetail from "@/pages/Product/SellProductDetail";

// 판매자전용
import ProductUpload from "@/pages/Product/ProductUpload";
import ProductList from "@/pages/Product/ProductList";
import ProductDetail from "@/pages/Product/ProductDetail";
import ProductEdit from "@/pages/Product/ProductEdit";
import ProductManagement from "@/pages/Product/ProductManagement";

// 카테고리
import Category from "@/pages/Category/Category";

// 장바구니
import Cart from "@/pages/Cart/Cart";

// 결제
import Pay from "@/api/Payment";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/pay"
          element={<ProtectRoute element={<Pay />} isPrivate={true} />}
        />

        <Route path="/" element={<ProtectRoute element={<Home />} />} />

        {/* 로그인, 회원 가입 */}
        <Route
          path="/buyersignup"
          element={<ProtectRoute element={<BuyerSignUp />} isPublic={true} />}
        />
        <Route
          path="/sellersignup"
          element={<ProtectRoute element={<SellerSignUp />} isPublic={true} />}
        />
        <Route
          path="/login"
          element={<ProtectRoute element={<Login />} isPublic={true} />}
        />
        {/* <Route
          path="/findId"
          element={<ProtectRoute element={<FindID />} isPublic={true} />}
        />
        <Route
          path="/findpw"
          element={<ProtectRoute element={<FindPassword />} isPublic={true} />}
        /> */}

        {/* 카테고리 */}
        <Route
          path="/category/:productCategory"
          element={<ProtectRoute element={<Category />} />}
        />

        {/* 장바구니 */}
        <Route
          path="/cart/:uid"
          element={<ProtectRoute element={<Cart />} isPrivate={true} />}
        />

        {/* 구매자 */}
        <Route
          path="/myprofile/:userId"
          element={
            <ProtectRoute
              element={<MyProfile />}
              isPrivate={true}
              isProtected={false}
            />
          }
        />

        {/* 상품 판매 */}
        <Route
          path="/sellproduct/:productId"
          element={<ProtectRoute element={<SellProductDetail />} />}
        />

        {/* 판매자 페이지 */}
        <Route
          path="/productlist/:uid"
          element={
            <ProtectRoute
              element={<ProductList />}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
        <Route
          path="/productmanagement/:uid"
          element={
            <ProtectRoute
              element={<ProductManagement />}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
        <Route
          path="/productdetail/:productId"
          element={
            <ProtectRoute
              element={<ProductDetail />}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
        <Route
          path="/productedit/:productId"
          element={
            <ProtectRoute
              element={<ProductEdit />}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
        <Route
          path="/productupload"
          element={
            <ProtectRoute
              element={<ProductUpload />}
              isPrivate={true}
              isProtected={true}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
