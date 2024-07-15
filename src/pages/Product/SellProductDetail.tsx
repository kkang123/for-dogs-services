import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { basicAxios } from "@/api/axios";

import { Product } from "@/interface/product";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, isLoggedInState } from "@/recoil/userState";
import { cartState } from "@/recoil/cartState";

import SEOMetaTag from "@/components/SEOMetaTag";

import ProductHeader from "@/components/Header/ProductHeader";
import CartModal from "@/components/modals/cartModal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Swal from "sweetalert2";

function SellProductDetail() {
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<Product | null>(null);

  const [count, setCount] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const isLoggedIn = useRecoilValue(isLoggedInState);

  const user = useRecoilValue(userState);
  const setCart = useSetRecoilState(cartState);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await basicAxios.get(`/products/${productId}`);
          console.log("API 응답:", response.data); // 전체 응답 로그

          // 'result' 객체를 사용하여 상태를 설정합니다.
          const productData: Product = response.data.result;
          console.log("상품 데이터:", productData);

          if (
            productData &&
            productData.productId &&
            productData.productCategory
          ) {
            setProduct(productData);
          } else {
            console.error("불완전한 상품 데이터 수신:", productData);
          }
        } catch (error) {
          console.error("상품 데이터 가져오기 오류:", error);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.productCategory && product.productId) {
        try {
          console.log("연관 상품 가져오기:", {
            category: product.productCategory,
            exclude: product.productId,
          });

          const response = await basicAxios.get(
            `/products?category=${product.productCategory}`
          );

          console.log("API 응답:", response);

          if (
            response.data &&
            response.data.result &&
            Array.isArray(response.data.result.content)
          ) {
            const allProducts = response.data.result.content;
            const relatedProductsData = allProducts
              .filter((p: Product) => p.productId !== product.productId)
              .slice(0, 3);
            setRelatedProducts(relatedProductsData);
          } else {
            console.error(
              "result.content가 배열이어야 하지만, 다음과 같은 값이 반환되었습니다:",
              response.data.result
            );
          }
        } catch (error) {
          console.error("연관 상품 가져오기 오류:", error);
        }
      } else {
        console.error("상품 데이터가 누락되었거나 불완전합니다:", product);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  //   const addToCart = async () => {
  //     if (isLoggedIn && product) {
  //       if (count <= 0) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "수량 오류",
  //           text: "한 개 이상의 상품을 선택해주세요.",
  //         });
  //         return;
  //       }

  //       // 장바구니 상태 업데이트 로직을 여기에 통합
  //       setCart((oldCartItems) => {
  //         const existItemIndex = oldCartItems.findIndex(
  //           (item) => item.product.productId === product.productId
  //         );
  //         if (existItemIndex > -1) {
  //           // 상품이 이미 카트에 있는 경우, 수량 갱신
  //           const updatedCart = [...oldCartItems];
  //           updatedCart[existItemIndex].quantity += count; // 사용자가 선택한 수량만큼 추가
  //           return updatedCart;
  //         } else {
  //           // 새로운 상품 추가
  //           return [...oldCartItems, { product: product, quantity: count }];
  //         }
  //       });

  //       const cartItem = { product, quantity: count };

  //       try {
  //         await basicAxios.post(`/orders`, {
  //           items: [cartItem],
  //         });

  //         if (
  //           product.productQuantity !== null &&
  //           product.productQuantity >= count
  //         ) {
  //           await basicAxios.patch(`/products/${productId}`, {
  //             productQuantity: product.productQuantity - count,
  //           });

  //           setProduct({
  //             ...product,
  //             productQuantity: product.productQuantity - count,
  //           });

  //           Swal.fire({
  //             icon: "success",
  //             title: "상품 추가",
  //             text: "장바구니에 상품이 추가되었습니다.",
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: "재고 부족",
  //             text: "남아있는 상품 수량이 부족합니다.",
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error updating cart or product quantity:", error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "오류",
  //           text: "장바구니를 업데이트하는 도중 오류가 발생했습니다.",
  //         });
  //       }
  //     }
  //   };

  const addToCart = async () => {
    if (isLoggedIn && product) {
      if (count <= 0) {
        Swal.fire({
          icon: "error",
          title: "수량 오류",
          text: "한 개 이상의 상품을 선택해주세요.",
        });
        return;
      }

      // 장바구니 상태 업데이트 로직을 여기에 통합
      setCart((oldCartItems) => {
        const existItemIndex = oldCartItems.findIndex(
          (item) => item.product.productId === product.productId
        );
        if (existItemIndex > -1) {
          // 상품이 이미 카트에 있는 경우, 수량 갱신
          const updatedCart = [...oldCartItems];
          updatedCart[existItemIndex].quantity += count; // 사용자가 선택한 수량만큼 추가
          return updatedCart;
        } else {
          // 새로운 상품 추가
          return [...oldCartItems, { product: product, quantity: count }];
        }
      });

      const cartItem = { product, quantity: count };

      try {
        await basicAxios.post(`/orders`, {
          orderItemRequests: [cartItem], // 수정된 부분
        });

        if (
          product.productQuantity !== null &&
          product.productQuantity >= count
        ) {
          await basicAxios.patch(`/products/${productId}`, {
            productQuantity: product.productQuantity - count,
          });

          setProduct({
            ...product,
            productQuantity: product.productQuantity - count,
          });

          Swal.fire({
            icon: "success",
            title: "상품 추가",
            text: "장바구니에 상품이 추가되었습니다.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "재고 부족",
            text: "남아있는 상품 수량이 부족합니다.",
          });
        }
      } catch (error) {
        console.error("Error updating cart or product quantity:", error);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "장바구니를 업데이트하는 도중 오류가 발생했습니다.",
        });
      }
    }
  };

  if (!product) {
    return <div>상품을 불러오는 중...</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showPageBackSpaceButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - SellProductDetail"
          description="판매 중인 상품 상세보기 페이지입니다."
        />
      </header>
      <main style={{ minWidth: "1300px" }} className="center">
        <div className="flex  w-full gap-12 pt-[70px] pb-[80px] justify-center">
          <div className="w-[580px] h-[580px]">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full "
            >
              <CarouselContent>
                {product.productImages && product.productImages.length > 0 ? (
                  product.productImages.map((image, index) => (
                    <CarouselItem key={index} className=" ">
                      <div className="">
                        <img
                          src={image}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-[580px] h-[580px]"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex flex-col gap-9 text-right w-[600px]">
            <p className="font-bold text-4xl mt-8">{product.productName}</p>
            <p className="text-3xl mt-3">{product.productPrice}원</p>
            <p className="text-3xl mt-8">
              남은 갯수 : {product.productQuantity}개
            </p>
            <div className="flex text-5xl justify-evenly">
              <button
                className=""
                onClick={() => count > 0 && setCount(count - 1)}
              >
                -
              </button>
              <div className="  w-5">{count}</div>
              <button
                className=" "
                onClick={() => count < 30 && setCount(count + 1)}
              >
                +
              </button>
            </div>
            <div className="border-b-2"></div>
            <div className="flex items-end justify-between mx-2 text-2xl ">
              <div>총 상품 구매</div>
              <div className="flex items-end ">
                구매 수량{" "}
                <span className="mx-1 text-LightBlue-500">{count}</span> |
                <span className="ml-1 text-LightBlue-500 text-4xl">
                  {product && product.productPrice
                    ? product.productPrice * count
                    : null}
                </span>
                원
              </div>
            </div>

            <div className="flex flex-col">
              <button className="text-2xl text-gray-500 flex justify-end mr-2">
                <Link to={`/category/${product.productCategory}`}>
                  #{product.productCategory}
                </Link>
              </button>

              <div className="flex justify-around ml-4 mt-1">
                <Button
                  onClick={addToCart}
                  size={"customsize"}
                  className="w-[250px] hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  장바구니 추가
                </Button>
                <Button
                  size={"customsize"}
                  className="w-[250px] hover:bg-LightBlue-500 text-white bg-LightBlue-200 text-2xl"
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-12 text-4xl ">상품 설명</div>
          <p
            className="mx-10 mt-3 border-4 border-LightBlue-500 rounded  overflow-y-auto overflow-x-hidden word-wrap: break-word"
            style={{ height: "8em" }}
          >
            {product.productDescription}
          </p>
        </div>
        {user.userRole === "BUYER" && (
          <div>
            <Button
              onClick={toggleModal}
              className="fixed flex justify-center items-center bottom-8 left-8 z-50 rounded-full bg-zinc-800"
            >
              장바구니 보기
            </Button>
            <CartModal isOpen={isModalOpen} toggleModal={toggleModal} />
          </div>
        )}
      </main>
      <footer className="pt-[100px]">
        <div className="">
          <h2 className="text-2xl font-bold mb-4">이 카테고리의 다른 상품들</h2>
          {relatedProducts.map((relatedProduct: Product) => (
            <div key={relatedProduct.productId} className="mb-4">
              <Link
                to={`/sellproduct/${relatedProduct.productId}`}
                className="flex items-center p-3"
              >
                {relatedProduct.productImages &&
                relatedProduct.productImages.length > 0 ? (
                  <img
                    src={relatedProduct.productImages[0]}
                    alt={relatedProduct.productName}
                    className="w-16 h-16 object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 mr-4"></div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {relatedProduct.productName}
                  </h3>
                  <p className="text-lg font-medium">
                    {relatedProduct.productPrice}원
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}

export default SellProductDetail;
