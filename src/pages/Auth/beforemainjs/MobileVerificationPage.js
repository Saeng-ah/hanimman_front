import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MobileVerificationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const identityVerificationId = searchParams.get('identityVerificationId');
  const navigate = useNavigate();

  useEffect(() => {
    const receiveData = async () => {
      try {
        const response = await fetch("http://localhost:8080/identity-verifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identityVerificationId: identityVerificationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch verification result");
        }

        const resultData = await response.json();
        const token = localStorage.getItem("authToken");

        // 본인 인증 결과를 바탕으로 회원가입/로그인 처리
        const verifyAndSignupOrLogin = await fetch("http://localhost:8080/users/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(resultData),
          credentials: "include",
        });

        if (verifyAndSignupOrLogin.ok) {
          const responseToken = verifyAndSignupOrLogin.headers.get("Authorization");
          const responseRefreshToken =
            verifyAndSignupOrLogin.headers.get("Refresh-Token");  
          if (responseToken) {
            const tokenWithoutBearer = responseToken.replace("Bearer ", "");
            localStorage.setItem("authToken", tokenWithoutBearer);
            navigate("/main");
            console.error("회원가입 또는 로그인 성공!");
          } else {
            console.error("Authorization 토큰을 찾을 수 없습니다.");
          }
          if (responseRefreshToken){
            localStorage.setItem("refreshToken", responseToken);
          }else{
            console.error("Refresh토큰을 찾을 수 없습니다.");
          }
        } else {
          const errorData = await verifyAndSignupOrLogin.json();
          console.error(`회원가입 또는 로그인 처리 실패: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        console.error("본인 인증 중 오류가 발생했습니다.");
      }
    };

    receiveData();
  }, [identityVerificationId, navigate]);  // 의존성 배열에 identityVerificationId 추가

  return (
    <div>
      {/* 페이지 내용 */}
    </div>
  );
};

export default MobileVerificationPage;
