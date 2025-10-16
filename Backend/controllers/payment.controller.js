import crypto from "crypto";

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const k of keys) sorted[k] = obj[k];
  return sorted;
}

export async function createPaymentUrl(req, res) {
  try {
    const {
      amount = 0,
      orderDescription = "Thanh toán đơn hàng",
      courseId,
      bankCode,
      locale = "vn",
    } = req.body || {};

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE || "";
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET || "";
    const vnp_Url =
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl =
      process.env.VNPAY_RETURN_URL || "http://localhost:3000/payment-result";

    // Fallback mock URL if not configured
    if (!vnp_TmnCode || !vnp_HashSecret) {
      const mockUrl =
        process.env.MOCK_PAYMENT_URL ||
        "https://sandbox.vnpayment.vn/tryitnow/";
      return res.json({
        paymentUrl: mockUrl,
        note: "Using MOCK payment URL because VNPay credentials are not configured.",
      });
    }

    const date = new Date();
    const pad = (n) => (n < 10 ? "0" + n : String(n));
    const createDate =
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds());

    const vnp_TxnRef = `${Date.now()}`; // unique order id
    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.ip ||
      "127.0.0.1";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl,
      vnp_IpAddr: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
    if (courseId) {
      vnp_Params[
        "vnp_OrderInfo"
      ] = `${orderDescription} | CourseID=${courseId}`;
    }

    // Sort params and sign
    vnp_Params = sortObject(vnp_Params);
    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const secureHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${secureHash}`;

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("VNPay createPaymentUrl error:", error);
    return res
      .status(500)
      .json({ message: "Cannot create payment URL", error: error.message });
  }
}
