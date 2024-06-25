import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { basicAxios } from "@/api/axios";
import { userState } from "@/recoil/userState";
import { Product } from "@/interface/product";
import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import photo from "@/assets/icon-photo.svg";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

function ProductUpload() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const { checkAndRefreshToken } = useAuth();

  const goToProductPage = () => {
    if (user.userId) navigate(`/productlist/${user.userId}`);
  };

  const [product, setProduct] = useState<Product>({
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "NONE",
    productImages: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.productImages.length) %
        product.productImages.length
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.productImages.length
    );
  };

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    await checkAndRefreshToken();

    const {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      productCategory,
      productImages,
    } = product;

    if (
      !productName ||
      productPrice <= 0 ||
      productPrice >= 100000000 ||
      productQuantity <= 0 ||
      !productDescription ||
      !productCategory ||
      productCategory === "NONE" ||
      productImages.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "비어있는 상품 정보를 작성해주세요.",
      });
      return;
    }

    try {
      const response = await basicAxios.post("/products/register", product);
      console.log("서버 응답 데이터:", response.data);

      if (response.status === 201) {
        if (response.data.ok) {
          Swal.fire({
            icon: "success",
            title: "제품 업로드 완료",
            text: "제품이 성공적으로 업로드되었습니다.",
          }).then((result) => {
            if (result.isConfirmed) {
              goToProductPage();
            }
          });
        } else {
          console.error("서버 응답에 문제가 있습니다:", response.data);
          throw new Error("서버 응답에 문제가 있습니다.");
        }
      } else {
        console.error("응답 상태 코드:", response.status);
        throw new Error("제품 업로드 중 문제가 발생했습니다.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
      console.error("제품 추가 중 에러: ", error);
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "productPrice" || name === "productQuantity") {
      const numericValue = Math.max(Number(value), 0);
      value = numericValue.toString();
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "productPrice" || name === "productQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length <= 3) {
      const selectedFiles = Array.from(files);

      await deleteUploadedImages();

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
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("imageFiles", file);
      try {
        const response = await basicAxios.post(
          "/products/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          console.log("Server response data:", data);
          if (
            data &&
            data.result &&
            data.result.uploadedImages &&
            data.result.uploadedImages[0] &&
            data.result.uploadedImages[0].imageFileUrl
          ) {
            const imageUrl = data.result.uploadedImages[0].imageFileUrl;
            console.log(`Uploaded file URL: ${imageUrl}`);
            downloadURLs.push(imageUrl);
            console.log("downloadURLs", downloadURLs);
          } else {
            console.error("imageFileUrl not found in response data");
          }
        } else {
          console.error(`파일 업로드 실패: ${file.name}`);
        }
      } catch (error) {
        console.error(`업로드 실패: ${file.name}`, error);
      }
    });

    await Promise.all(uploadPromises);
    setProduct((prevProduct) => ({
      ...prevProduct,
      productImages: downloadURLs,
    }));
  };

  const deleteUploadedImages = async () => {
    try {
      await checkAndRefreshToken();

      const deletePromises = product.productImages.map(async (imageUrl) => {
        const response = await basicAxios.delete("/products/images", {
          params: { imageUrls: imageUrl },
        });
        return response;
      });

      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (response.status === 204) {
          console.log(`이미지 삭제 성공: ${response.config.params.imageUrls}`);
        } else {
          console.error(
            `이미지 삭제 실패: ${response.config.params.imageUrls}`
          );
        }
      });
    } catch (error) {
      console.error("업로드된 이미지를 삭제하는 중 오류 발생: ", error);
    }
  };

  return (
    <>
      <header>
        <ProductHeader
          showBackspaseButton={true}
          showEditButton={false}
          onBackspaceClick={deleteUploadedImages}
        />
        <SEOMetaTag
          title="For Dogs - ProductUpload"
          description="상품 업로드 페이지입니다."
        />
      </header>

      <main>
        <form
          className="flex justify-center mt-[70px] "
          style={{ minWidth: "800px" }}
        >
          <section>
            <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
              {product.productImages[currentImageIndex] ? (
                <img
                  className="object-fill w-full h-full"
                  src={product.productImages[currentImageIndex]}
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

              <div className="absolute bottom-2 right-2   gap-1.5 ">
                <Label htmlFor="picture" className="cursor-pointer">
                  <img src={photo} alt="photo-btn" />
                </Label>
                <Input
                  className="cursor-pointer"
                  id="picture"
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  accept=".jpg, .jpeg, .png, .webp"
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
                value={product.productName}
                onChange={onChange}
              />

              <Input
                className="border-gray-700 mt-3 hover:none border-b-2"
                name="productPrice"
                placeholder="상품 가격"
                type="number"
                value={product.productPrice || ""}
                onChange={onChange}
                min="0"
              />

              <Input
                className="border-gray-700 mt-2 hover:none border-b-2"
                type="number"
                name="productQuantity"
                placeholder="상품 수량"
                value={product.productQuantity || ""}
                onChange={onChange}
                min="0"
              />

              <div>
                <Textarea
                  className="border-black mt-3"
                  placeholder="상품 설명을 적어주세요."
                  name="productDescription"
                  value={product.productDescription}
                  onChange={onChange}
                />
              </div>

              <div className="mt-1 relative">
                <select
                  name="productCategory"
                  value={product.productCategory}
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
                  완료
                </Button>
              </div>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}

export default ProductUpload;
