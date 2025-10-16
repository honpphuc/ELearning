import React, { useState } from "react";

const Payment = ({ course }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Gọi API tạo link thanh toán VNPay
  const handleVNPayPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: course?.price || 100000,
          orderDescription: `Thanh toán khóa học ${course?.title || ""}`,
          courseId: course?.id,
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        // Chuyển hướng sang VNPay
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Không nhận được link thanh toán");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Có lỗi xảy ra khi tạo link thanh toán. Vui lòng thử lại.");
      setIsProcessing(false);
    }
  };

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-header">
            <h1>Thanh toán khóa học</h1>
            <p className="muted">Hoàn tất thanh toán để bắt đầu học ngay</p>
          </div>

          {course ? (
            <div className="payment-card">
              <div className="course-summary">
                <div className="course-summary-icon">
                  <i className={course.icon || "fas fa-book"}></i>
                </div>
                <div className="course-summary-details">
                  <h2>{course.title}</h2>
                  <div className="course-summary-meta">
                    <span>
                      <i className="fas fa-clock"></i> {course.duration}
                    </span>
                    <span>
                      <i className="fas fa-users"></i> {course.students} học
                      viên
                    </span>
                    <span>
                      <i className="fas fa-star"></i> {course.rating}/5
                    </span>
                  </div>
                  {course.description && (
                    <p className="course-summary-desc">{course.description}</p>
                  )}
                </div>
              </div>

              <div className="payment-divider"></div>

              <div className="payment-details">
                <div className="payment-row">
                  <span>Giá khóa học:</span>
                  <strong>{course.price?.toLocaleString("vi-VN")}đ</strong>
                </div>
                <div className="payment-row">
                  <span>Phí xử lý:</span>
                  <strong>0đ</strong>
                </div>
                <div className="payment-divider"></div>
                <div className="payment-row payment-total">
                  <span>Tổng cộng:</span>
                  <strong className="total-price">
                    {course.price?.toLocaleString("vi-VN")}đ
                  </strong>
                </div>
              </div>

              <div className="payment-method">
                <h3>
                  <i className="fas fa-credit-card"></i> Phương thức thanh toán
                </h3>
                <div className="vnpay-info">
                  <div className="vnpay-logo">
                    <img
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                      alt="VNPay"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div
                      style={{
                        display: "none",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#0066cc",
                      }}
                    >
                      VNPay
                    </div>
                  </div>
                  <p className="vnpay-desc">
                    Thanh toán an toàn qua cổng thanh toán VNPay. Hỗ trợ thanh
                    toán qua thẻ ATM, thẻ Visa/MasterCard, ví điện tử và các
                    ngân hàng trực tuyến.
                  </p>
                </div>

                <button
                  onClick={handleVNPayPayment}
                  disabled={isProcessing}
                  className="btn btn-payment"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i> Thanh toán qua VNPay
                    </>
                  )}
                </button>

                <div className="payment-security">
                  <i className="fas fa-shield-alt"></i>
                  <span>Giao dịch được mã hóa và bảo mật tuyệt đối</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-error">
              <i className="fas fa-exclamation-circle"></i>
              <p>
                Không tìm thấy thông tin khóa học. Vui lòng quay lại và chọn lại
                khóa học.
              </p>
              <a href="/courses" className="btn btn-primary">
                Quay lại khóa học
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Payment;
