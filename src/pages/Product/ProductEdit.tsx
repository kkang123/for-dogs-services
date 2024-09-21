import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import ProductHeader from "@/components/Header/ProductHeader";
import SEOMetaTag from "@/components/SEOMetaTag";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import photo from "@/assets/icon-photo.svg";

import { Product } from "@/interface/product";

const isValidCategory = (
  category: string
): category is Product["productCategory"] => {
  return [
    "FOOD",
    "CLOTHING",
    "SNACK",
    "TOY",
    "ACCESSORY",
    "SUPPLEMENT",
    "NONE",
  ].includes(category);
};

function ProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState<number | null>(null);
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] =
    useState<Product["productCategory"]>("NONE");
  const [productImage, setProductImage] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { checkAndRefreshToken } = useAuth();

  const [editedProduct, setEditedProduct] = useState<Product>({
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "NONE",
    productImages: [],
  });

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + productImage.length) % productImage.length
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
  };

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const response = await basicAxios.get(`/products/${productId}`);
        if (response.status === 200) {
          const productData = response.data.result as Product;

          setSellerId(productData.productSeller || "");
          setProductName(productData.productName);
          setProductPrice(productData.productPrice);
          setProductQuantity(productData.productQuantity);
          setProductDescription(productData.productDescription);
          setProductCategory(
            isValidCategory(productData.productCategory)
              ? productData.productCategory
              : "NONE"
          );
          setProductImage(productData.productImages);
          setEditedProduct(productData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product data: ", error);
      }
    };
    loadProductData();
  }, [productId]);

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (
      !productName ||
      productPrice === null ||
      productPrice <= 0 ||
      productPrice >= 100000000 ||
      productQuantity === null ||
      productQuantity <= 0 ||
      !productDescription ||
      !productCategory ||
      productImage.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "비어있는 상품 정보를 작성해주세요.",
      });
      return;
    }

    const updatedProduct: Product = {
      ...editedProduct,
      productName,
      productPrice: productPrice || 0,
      productQuantity: productQuantity || 0,
      productDescription,
      productCategory,
      productImages: productImage,
      productSeller: sellerId,
    };

    try {
      await checkAndRefreshToken();
      const response = await basicAxios.patch(
        `/products/${productId}`,
        updatedProduct
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "제품 수정 완료",
          text: "제품이 성공적으로 수정되었습니다.",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/productdetail/${productId}`);
          }
        });
      }
    } catch (error) {
      console.error("Failed to update product: ", error);
      Swal.fire({
        icon: "error",
        title: "제품 수정 실패",
        text: "제품 수정 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    let parsedValue: string | number | null;

    if (name === "productPrice" || name === "productQuantity") {
      parsedValue = value ? Number(value) : null;
    } else {
      parsedValue = value;
    }

    if (name === "productCategory") {
      if (isValidCategory(parsedValue as string)) {
        setProductCategory(parsedValue as Product["productCategory"]);
      } else {
        setProductCategory("NONE");
      }
    } else {
      switch (name) {
        case "productName":
          setProductName(parsedValue as string);
          break;
        case "productDescription":
          setProductDescription(parsedValue as string);
          break;
        case "productPrice":
          setProductPrice(parsedValue as number);
          break;
        case "productQuantity":
          setProductQuantity(parsedValue as number);
          break;
        default:
          break;
      }
    }

    setEditedProduct((prevProduct: Product) => ({
      ...prevProduct,
      [name]: parsedValue,
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const files = event.target.files;

    if (files && files.length <= 3) {
      const selectedFiles = Array.from(files);
      try {
        await handleUpload(selectedFiles);
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "이미지 초과",
        text: "3장만 업로드해주세요.",
      });
    }
  };

  const handleUpload = async (files: File[]) => {
    const downloadURLs: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("imageFiles", file);
      try {
        const response = await basicAxios.post("/products/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const data = response.data;
          if (
            data &&
            data.result &&
            data.result.uploadedImages &&
            data.result.uploadedImages[0] &&
            data.result.uploadedImages[0].imageFileUrl
          ) {
            const imageUrl = data.result.uploadedImages[0].imageFileUrl;
            downloadURLs.push(imageUrl);
          } else {
            console.error("imageFileUrl not found in response data");
          }
        } else {
          console.error(`파일 업로드 실패: ${file.name}`);
        }
      } catch (error) {
        console.error(`업로드 실패: ${file.name}`, error);
      }
    }
    setProductImage(downloadURLs);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showPageBackSpaceButton={true} showEditButton={false} />
        <SEOMetaTag
          title="For Dogs - ProductEdit"
          description="상품 수정 페이지입니다."
        />
      </header>
      <main>
        <form
          className="flex justify-center mt-[70px] "
          style={{ minWidth: "800px" }}
        >
          <section>
            <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
              {productImage && productImage[currentImageIndex] ? (
                <img
                  className="object-fill w-full h-full"
                  src={productImage[currentImageIndex]}
                  alt={`Uploaded image ${currentImageIndex + 1}`}
                />
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrevClick}
                className="absolute left-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pr-1 text-white bg-black border-black"
              >
                &lt;
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNextClick}
                className="absolute right-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pl-1 text-white bg-black border-black"
              >
                &gt;
              </Button>

              <div className="absolute bottom-2 right-2 gap-1.5 ">
                <Label htmlFor="picture">
                  <img src={photo} alt="photo" className="w-6" />
                </Label>
                <Input
                  id="picture"
                  type="file"
                  name="productImage"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div>
              <Input
                className="border-gray-700 mt-8 hover:none border-b-2"
                type="text"
                name="productName"
                placeholder="상품 이름"
                value={productName}
                onChange={onChange}
              />

              <Input
                className="border-gray-700 mt-3 hover:none border-b-2"
                name="productPrice"
                placeholder="상품 가격"
                type="number"
                value={productPrice || ""}
                onChange={onChange}
                min="0"
              />

              <Input
                className="border-gray-700 mt-2 hover:none border-b-2"
                type="number"
                name="productQuantity"
                placeholder="상품 수량"
                value={productQuantity || ""}
                onChange={onChange}
                min="0"
              />

              <div>
                <Textarea
                  className="border-black mt-3"
                  placeholder="상품 설명을 적어주세요."
                  name="productDescription"
                  value={productDescription}
                  onChange={onChange}
                />
              </div>

              <div className="mt-1 relative">
                <select
                  name="productCategory"
                  value={productCategory}
                  onChange={onChange}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="NONE">카테고리를 선택하세요</option>
                  <option value="FOOD">사료</option>
                  <option value="SNACK">간식</option>
                  <option value="CLOTHING">의류</option>
                  <option value="TOY">장난감</option>
                  <option value="ACCESSORY">용품</option>
                  <option value="SUPPLEMENT">영양제</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l6-6H4l6 6zm0 1l6 6H4l6-6z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="mt-3" onClick={handleSaveProduct}>
                  수정 완료
                </Button>
              </div>
            </div>
          </section>
        </form>
      </main>
      <footer className="mt-10"></footer>
    </>
  );
}

export default ProductEdit;
