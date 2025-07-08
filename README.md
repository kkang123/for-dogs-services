# 🐶 For Dogs

![main imag](https://github.com/user-attachments/assets/51cbe298-b812-4e83-bb5b-db9208c689f3)

배포 URL : https://www.fordogs.store/

```
테스트 계정

- 구매자 계정
ID : buyer001
PW : test001!!@@

- 판매자 계정
ID : seller001
PW : test001!!@@
```

## 📅 프로젝트 기간

♻️ 24.04.16 이후 기존 프로젝트에서 파이어베이스 기능을 제거 후 백엔드와 협업하여 서버 api 연결 등 리팩토링 진행

## 🔨 사용 기술

<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=FFFFFF"/><img src="https://img.shields.io/badge/TypeScript-orange?style=flat&logo=TypeScript&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/TailWind CSS-06B6D4?style=flat&logo=TailWind css&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/React-Query-ffffff?style=flat&logo=React-Query&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/React-Router-000000?style=flat&logo=React-Router&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/vite-9400D3?style=flat&logo=vite&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/API-0000FF?style=flat&logo=백엔드 API&logoColor=FFFFFF"/>
<img src="https://img.shields.io/badge/vercel-000000?style=flat&logo=vercel&logoColor=ffffff"/>

### 아키텍처

![architecture](https://github.com/user-attachments/assets/5fdf772d-af35-4405-9a29-e320f1e73ef2)

<details>
  <summary>기술적 의사 결정</summary>
<ul>
    <li>React</li>
    사용자 경험을 중시하는 동적 웹 애플리케이션 개발을 위해 선택. 컴포넌트 기반 접근으로 재사용 가능하고 유지보수가 쉬운 UI를 구성하고 개발 효율성을 높이고 가상 DOM을 이용해 실제 DOM의 수정을 최소화하여 애플리케이션의 성능을 향상시키고, 사용자 경험을 개선하기 위해 선택했습니다.</br></br>
    <li>TypeScript</li> 프로젝트의 확장성과 유지보수성을 고려하여, 정적 타입 지정을 통한 오류 감소와 개발 생산성 향상을 위해 사용했습니다. </br></br>
    <li>Vite</li>
    Webpack은 cra이기 때문에 처리해야할 코드의 양이 많아질수록 느린 속도를 체감할 수 있어서 빠른 개발 서버 시작과 HMR(핫 모듈 교체) 기능을 제공하여 개발 속도와 경험을 향상시키기 위해 Vite를 선택했습니다. </br></br>
    <li>Recoil</li>
    기존에는 React Context API를 사용하여 상태 관리를 진행했으나, Recoil로 변경함으로써 애플리케이션의 상태 관리가 보다 간편해졌습니다. Recoil은 전역 상태 관리에 최적화되어 있어 다양한 컴포넌트 간의 상태 공유가 용이하고, 상태 변경 시 불필요한 리렌더링을 줄여 성능을 개선하는 데 기여했습니다. 또한, 비동기 상태 관리 및 아톰 기반의 설계 덕분에 코드의 가독성과 유지보수성이 향상되었습니다. </br></br>
    <li>React Query</li>
    비동기 데이터와 서버 상태를 관리를 위해 사용했으며 이를 통해 서버 상태 관리를 효율적으로 수행하고, 데이터 캐싱, 동기화 및 업데이트 작업을 간소화하기 위해 도입했습니다. </br></br>
    <li>Tailwind CSS</li>
   디자인의 일관성을 유지하여 재활용성을 높였고, 커스텀 디자인 작업 시간을 단축하기 위해 적용했습니다. </br></br>
    <li>Shadcn/ui</li>
    개발과정 중 직접적인 커스터마이제이션, 의존성 최소화, 빠른 통합 및 사용의 이점을 제공하여, 프로젝트의 유연성을 향상시키고 개발 속도를 높이는 장점이 있어 선택 </br></br>
    <li>S3</li>
   Amazon S3를 사용하여 이미지 저장 및 관리를 수행했습니다. Firebase에 비해 S3는 버킷 구조를 통해 이미지를 URL로 변환하여 불러오는 것이 용이하다는 장점이 있고 경험적인 이유가 크기 때문에 선택했습니다. 그리고 S3의 사용을 함으로써 비용 효율적이며, 대량의 이미지 데이터를 효과적으로 처리하고, 안정적으로 저장할 수 있는 환경을 구축했습니다.
   </br></br>
    <li>Vercel</li>
    간단하고 빠른 배포와 CDN을 통한 최적화된 성능, 자동 HTTPS 적용, 최신 웹 기술에 대한 강력한 지원, 개발자 친화적인 피드백과 분석 도구를 제공 받을 수 있어 사용했습니다. </br></br>
</ul>
</details>

## ✨ 구현 기능 및 시연

- 로그인 / 로그아웃 <br>
  ![로그인 로그아웃](https://github.com/user-attachments/assets/bc8c5313-1bd3-450b-a395-58828413d7a0) <br>
  추가적으로 OAuth2 기능을 추가하여 구글, 카카오 로그인이 가능합니다.

- 회원가입 <br>
  ![회원가입](https://github.com/user-attachments/assets/b051a3e9-4b88-4d23-bd65-9d1373aa7eb1)

- 아이디 찾기/비밀번호 찾기 <br>
  ![아이디:비밀번호찾기](https://github.com/user-attachments/assets/ed1416ff-a58c-4ff7-a265-94fb9d709c7d)

- 홈 / 판매 상품 상세보기 <br>
  ![홈:판매상품상세보기](https://github.com/user-attachments/assets/88d30ec9-4590-42c8-941c-d70852f983f5)

- 카테고리별 상품 목록 / 정렬 및 검색 <br>
  ![카테고리](https://github.com/user-attachments/assets/57b4f972-ab2e-4222-b9f9-f6beb3f29bcf)

- (구매자) 장바구니 추가 수정 및 삭제 <br>
  ![장바구니 추가,수정,삭제](https://github.com/user-attachments/assets/f3f646a6-8988-4cf6-8357-36edec0d270b)

- (구매자) 상품 결제 및 조회, 주문 취소 <br>
  ![상품 결제, 조회, 삭제](https://github.com/user-attachments/assets/87fd9994-0441-42ef-b60e-96440b7ca6fe)

- (판매자)상품 등록 및 수정, 삭제 <br>

  - 상품 등록 <br>
    ![상품 등록](https://github.com/user-attachments/assets/3b34be7a-e37d-4f79-8e13-ef49b3dab42f)

  - 상품 수정 및 삭제 <br>
    ![상품 수정 및 삭제](https://github.com/user-attachments/assets/3cc2e340-c37c-4676-a079-bd22905b94df)

- (구매자 & 판매자) 프로필

  - 구매자 프로필 : 구매 내역 및 영수증 조회 <br>
    ![(구매자)프로필](https://github.com/user-attachments/assets/c4705737-2ef0-4d3d-8ddb-4085971f470f)

  - 판매자 프로필 : 판매 내역 및 상태 변경, 판매 상품 관리 <br>
    ![(판매자)프로필](https://github.com/user-attachments/assets/974b7753-6ece-4666-b9f4-762f0a67ead8)

  - 회원 탈퇴 <br>
    ![회원탈퇴](https://github.com/user-attachments/assets/8cf537e1-e852-41d2-a263-748edcc58cf6)

## 🔥 트러블 슈팅

<details>
  <summary>다수의 불필요한 API 호출</summary>
  <ul>useRef를 활용하여 이미 데이터를 가져온 경우 API 요청을 방지하는 로직을 구현했습니다. 이로 인해, 사용자가 페이지를 새로 고치거나 다른 작업을 수행해도 동일한 사용자 프로필 정보를 중복 요청하지 않아 성능과 사용자 경험을 개선하였고 API 부하를 줄였습니다.</ul>
  </details>
  
<details>
  <summary>OAuth2 authCode - 공백 발생</summary>
  <ul>백엔드에서 authCode를 인코딩해서 전달해줘야했는데 이 부분이 생략되어서 OAuth2 인증 과정에서 authCode를 URL로 받을 때, + 기호가 공백으로 변환되는 문제가 발생했습니다.   
  
  <br>
  
  이 부분은 프론트쪽에서 해결한 뒤에 백엔드에게 해결 방법을 설명하는 과정에서 서로 깨달았습니다.
<br>

다음과 같이 해결했습니다. 쿼리 문자열을 가져와 사용할때 디코딩되어 공백으로 변한 값을 다시 공백에서 +로 바꾸어주어서 인코딩을 해준 것처럼 표현했습니다.

</ul>
  </details>

  <details>
  <summary>JWT 토큰 저장 과정에서 발생한 CORS 이슈</summary>
  <ul>
  서버에서 리프레시 토큰을 Set-Cookie로 전달했지만, SameSite 기본값이 Lax로 되어 있어 로컬 환경과 서버 간 쿠키 전달이 차단됐습니다.

  이를 해결하기 위해 SameSite를 None으로 설정하고 Secure: true를 적용해야 했으며, 이를 위해 HTTPS 환경이 필요해 도메인을 구매하고 SSL 인증서를 발급받아 HTTPS 서버를 구성했습니다. 

  이후 로컬에서 발생한 partitioned 쿠키 관련 에러도 대응한 후 배포 완료 후에는 samesite를 strict로 변경해주어 해결했습니다.
  </ul>
  </details>

## 📦 폴더 구조

```
🐶For-Dogs-Services
├─ 📦 public
├─ 📦 src
│  ├─ 📂 api
│  ├─ 📂 assets
│  ├─ 📂 components
│  │  ├─ 📂 Header
│  │  ├─ 📂 modals
│  │  ├─ 📂 skeletons
│  │  └─ 📂 ui
│  ├─ 📂 hooks
│  ├─ 📂 interface
│  ├─ 📂 lib
│  ├─ 📂 pages
│  │  ├─ 📂 Cart
│  │  ├─ 📂 Category
│  │  ├─ 📂 home
│  │  ├─ 📂 Login
│  │  ├─ 📂 Product
│  │  ├─ 📂 Profile
│  │  └─ 📂 SignUp
│  ├─ 📂 recoil
│  ├─ 📂 routes
│  └─ 📄 App.tsx
├─ 📄 README.md
├─ 📄 .env
├─ 📄 tailwind.config.ts
├─ 📄 vercel.json
└─ 📄 vite.config.ts
```

♻️ 리팩토링 계획

### 기존의 생각하지 못했던 기술이나 기능들이 떠올라서 백엔드와 협업하여 꾸준히 실습 목적으로 이루어질 예정입니다.

- 10월 24일 ~ : 채팅 기능 추가 예정
