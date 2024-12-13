import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import mainpagedata from "../../../data/mainpagedata.json"; // JSON 데이터 임포트
import "../maincss/MainPage.css";
import { ReactComponent as ShareIcon } from '../../../assets/icons/share.svg';
import { ReactComponent as TogetherIcon } from '../../../assets/icons/together.svg';

const MainPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const handleTogetherClick = () => {
    navigate("/togetherlist"); 
  }
  const handleShareClick = () => {
    navigate("/sharelist");
  }

  // 데이터 가져오기 (현재는 직접 JSON 파일에서 import)
  useEffect(() => {
    setItems(mainpagedata); // JSON 데이터를 상태에 저장
    setLoading(false); // 로딩 종료
  }, []);

  const handleCardClick = (item) => {
    navigate(`/itemdetail/${item.id}`, { state: { item } }); // 카드 클릭 시 상세 페이지로 이동
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const options = {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }
    return date.toLocaleDateString("ko-KR", options);
  };

  if (loading && page === 0) return <p>로딩 중...</p>;

  return (
    <div className="mobile-container">
      <div className="main-page">
        <Header
          showBack={false}
          showLeft={true} // 위치 표시 활성화
          showLogo={false} // 로고 비활성화
          showMenu={true} // 햄버거 버튼 활성화
          showSearch={true} // 검색 버튼 활성화
          showBell={false} // 알림 버튼 비활성화
        />
        <div className="main-content">
          <section className="category">
            <div className="category-buttons">
              <button className="category-button" onClick={handleTogetherClick}>
                <TogetherIcon />
                <p className="category-text">같이가요</p>
              </button>  
              <button className="category-button" onClick={handleShareClick}>
                <ShareIcon />
                <p className="category-text">나눠요</p>
              </button>  
            </div>
          </section>

          <section className="combined-slider">
            <div className="combined-list-container">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    className="combined-card"
                    key={index}
                    onClick={() => handleCardClick(item)}
                    ref={index === items.length - 1 ? lastPostElementRef : null}
                  >
                    <div className="combined-card-image-container">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="combined-card-image"
                        />
                      ) : (
                        <img
                          src="/images/noimage.png"
                          alt={item.title}
                          className="combined-card-image"
                        />
                      )}
                    </div>
                    <div className="combined-card-content">
                      {/* 카드 제목 */}
                      <div className="combined-card-title">{item.title}</div>
                      <div className="combined-card-meta">
                        <div className="location-info">
                          <p>{item.location || "정보 없음"}</p>
                        </div>
                        {item.date ? formatDate(item.date) : "날짜 없음"}
                      </div>

                      {/* 거래 상태 */}
                      <div className="combined-card-status-price">
                        <div className="left-group">
                          <div className={`category-badge ${item.category}`}>
                            {item.category === "share" ? "나눠요" : "같이가요"}
                          </div>
                          <div className="combined-card-price">
                            {item.price
                              ? `${new Intl.NumberFormat("ko-KR").format(item.price)}원`
                              : "가격정보없음"}
                            /{item.quantity}개
                          </div>
                        </div>

                        <div className="combined-card-chat">
                          <span className="meta-item">💬 {item.chats || 0}</span>
                          <span className="meta-item">❤️ {item.favoriteCount || 0}</span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-posts">등록된 게시물이 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MainPage;