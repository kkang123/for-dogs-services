import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { basicAxios } from "@/api/axios";

import { Product } from "@/interface/product";

import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/userState";

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  const user = useRecoilValue(userState);

  const goToProductPage = () => {
    if (user.userId) navigate(`/productlist/${user.userId}`);
  };

  const categoryMap: { [key: string]: string } = {
    FOOD: "음식",
    CLOTHING: "의류",
    SNACK: "간식",
    TOY: "장난감",
    ACCESSORY: "용품",
    SUPPLEMENT: "영양제",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await basicAxios.get(`/products/${productId}/details`);
        if (response.data.ok) {
          const result = response.data.result;
          console.log(result);
          const fetchedProduct: Product = {
            productId: result.productId,
            productSeller: result.productSeller,
            productName: result.productName,
            productPrice: result.productPrice,
            productQuantity: result.productQuantity,
            productDescription: result.productDescription,
            productCategory: result.productCategory,
            productImages: result.productImages,
          };
          setProduct(fetchedProduct);
        } else {
          const errorMessage = response.data.error || "Unknown error occurred";
          console.error("Failed to fetch product details:", errorMessage);
          Swal.fire({
            icon: "error",
            title: "상품 불러오기 실패",
            text: "상품 정보를 불러오는데 실패했습니다.",
          }).then(() => {
            navigate("/");
          });
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        Swal.fire({
          icon: "error",
          title: "상품 불러오기 실패",
          text: "상품 정보를 불러오는데 실패했습니다.",
        }).then(() => {
          navigate("/");
        });
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleDelete = async () => {
    try {
      const response = await basicAxios.delete(
        `/products/${productId}/deactivate`
      );
      if (response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "상품 삭제 완료",
          text: "상품이 성공적으로 삭제되었습니다.",
        }).then(() => {
          goToProductPage();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "상품 삭제 실패",
          text: "상품 삭제 중 문제가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      Swal.fire({
        icon: "error",
        title: "상품 삭제 실패",
        text: "상품 삭제 중 문제가 발생했습니다.",
      });
    }
  };

  // 수정 함수(추후 api 추가 시 적용)
  const handleEdit = () => {
    navigate(`/productedit/${productId}`);
  };

  if (!product) {
    return (
      <div className="flex justify-center mt-10">
        상품을 불러오는 중입니다...
      </div>
    );
  }

  const Category =
    categoryMap[product.productCategory] || product.productCategory;

  return (
    <>
      <header className="h-20">
        <ProductHeader
          showBackspaseButton={true}
          showEditButton={true}
          showDeleteButton={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <SEOMetaTag
          title="For Dogs - ProductDetail"
          description="판매 상품 상세보기 페이지입니다."
        />
      </header>
      <main style={{ minWidth: "1300px" }}>
        <div className="flex w-full gap-12 pt-[70px] pb-[80px] justify-center">
          <div className="w-[580px] h-[580px]">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {product.productImages.map((image, index) => (
                  <CarouselItem key={index} className=" ">
                    <div className="">
                      <img
                        src={image}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-[580px] h-[580px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex flex-col gap-20 text-right w-[600px] ">
            <p className="font-bold text-4xl mt-8">{product.productName}</p>
            <p className="text-3xl mt-3">{product.productPrice}원</p>
            <p className="text-3xl mt-8">
              남은 갯수 : {product.productQuantity}개
            </p>
            <div className="border-b-2"></div>

            <button className="text-2xl text-gray-500 flex justify-end mr-2">
              <Link to={`/category/${Category}`}>#{Category}</Link>
            </button>
          </div>
        </div>

        <div>
          <div className="mx-12 text-4xl">상품 설명</div>
          <p
            className="mx-10 mt-3 border-4 border-LightBlue-500 rounded overflow-y-auto overflow-x-hidden word-wrap: break-word"
            style={{ height: "8em" }}
          >
            {product.productDescription}
          </p>
        </div>
      </main>
      <footer className="pt-[100px]"></footer>
    </>
  );
}

export default ProductDetail;
