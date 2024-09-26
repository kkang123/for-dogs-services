// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom";

// import { RecoilRoot } from "recoil";
// import { MemoryRouter } from "react-router-dom";
// import MainHeader from "./MainHeader";
// import { userState, isLoggedInState } from "@/recoil/userState";
// import { cartState } from "@/recoil/cartState";

// // Mock 필요한 커스텀 훅
// jest.mock("@/hooks/useAuth", () => ({
//   __esModule: true,
//   default: () => ({
//     isLoggedIn: true, // 테스트 중 로그인이 되어 있는 상태로 가정
//   }),
// }));

// jest.mock("@/hooks/useLogout", () => ({
//   __esModule: true,
//   useLogout: () => ({
//     logout: jest.fn(), // 로그아웃 함수가 호출되었는지 확인하기 위해 mock 함수 사용
//   }),
// }));

// describe("MainHeader Component", () => {
//   const mockNavigate = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//     // react-router-dom의 useNavigate 훅을 모킹하여 navigate 호출 여부를 확인할 수 있게 함
//     jest.mock("react-router-dom", () => ({
//       ...jest.requireActual("react-router-dom"),
//       useNavigate: () => mockNavigate,
//     }));
//   });

//   test("renders main logo and buttons", () => {
//     render(
//       <RecoilRoot>
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     // 메인 로고 확인
//     const logo = screen.getByAltText("main-logo");
//     expect(logo).toBeInTheDocument();

//     // 장바구니 버튼이 존재하는지 확인
//     const cartButton = screen.getByAltText("Basket");
//     expect(cartButton).toBeInTheDocument();
//   });

//   test("renders login button when not logged in", () => {
//     // Recoil 상태를 조작하여 로그인되지 않은 상태로 테스트
//     render(
//       <RecoilRoot
//         initializeState={({ set }) => {
//           set(userState, { userId: null, userRole: null });
//           set(isLoggedInState, false);
//           set(cartState, []);
//         }}
//       >
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     const loginButton = screen.getByText("로그인");
//     expect(loginButton).toBeInTheDocument();
//   });

//   test("renders logout button when logged in", () => {
//     // Recoil 상태를 조작하여 로그인된 상태로 테스트
//     render(
//       <RecoilRoot
//         initializeState={({ set }) => {
//           set(userState, { userId: "123", userRole: "BUYER" });
//           set(isLoggedInState, true);
//           set(cartState, []);
//         }}
//       >
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     const logoutButton = screen.getByText("로그아웃");
//     expect(logoutButton).toBeInTheDocument();
//   });

//   test("navigates to login page on login button click", () => {
//     render(
//       <RecoilRoot
//         initializeState={({ set }) => {
//           set(userState, { userId: null, userRole: null });
//           set(isLoggedInState, false);
//         }}
//       >
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     const loginButton = screen.getByText("로그인");
//     fireEvent.click(loginButton);

//     expect(mockNavigate).toHaveBeenCalledWith("/login");
//   });

//   test("calls logout and navigates to home on logout button click", () => {
//     const mockLogout = jest.fn();

//     jest.mock("@/hooks/useLogout", () => ({
//       useLogout: () => ({
//         logout: mockLogout,
//       }),
//     }));

//     render(
//       <RecoilRoot
//         initializeState={({ set }) => {
//           set(userState, { userId: "123", userRole: "BUYER" });
//           set(isLoggedInState, true);
//         }}
//       >
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     const logoutButton = screen.getByText("로그아웃");
//     fireEvent.click(logoutButton);

//     expect(mockLogout).toHaveBeenCalled();
//     expect(mockNavigate).toHaveBeenCalledWith("/");
//   });

//   test("displays correct number of unique products in the cart", () => {
//     render(
//       <RecoilRoot
//         initializeState={({ set }) => {
//           set(userState, { userId: "123", userRole: "BUYER" });
//           set(isLoggedInState, true);
//           set(cartState, [
//             {
//               product: {
//                 cartId: "1",
//                 cartProductId: "1",
//                 cartProductName: "Product 1",
//                 cartProductPrice: 100,
//                 cartProductQuantity: 2,
//                 cartProductImages: ["image1.jpg"],
//                 available: true,
//               },
//               quantity: 1,
//             },
//             {
//               product: {
//                 cartId: "2",
//                 cartProductId: "2",
//                 cartProductName: "Product 2",
//                 cartProductPrice: 200,
//                 cartProductQuantity: 1,
//                 cartProductImages: ["image2.jpg"],
//                 available: true,
//               },
//               quantity: 2,
//             },
//             {
//               product: {
//                 cartId: "2",
//                 cartProductId: "2",
//                 cartProductName: "Product 2",
//                 cartProductPrice: 200,
//                 cartProductQuantity: 1,
//                 cartProductImages: ["image2.jpg"],
//                 available: true,
//               },
//               quantity: 2,
//             },
//           ]);
//         }}
//       >
//         <MemoryRouter>
//           <MainHeader />
//         </MemoryRouter>
//       </RecoilRoot>
//     );

//     const cartProductCount = screen.getByText("2");
//     expect(cartProductCount).toBeInTheDocument();
//   });
// });
