import crypto from "crypto";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

/**
 * 🎯 TẠO LINK THANH TOÁN PAYOS
 * POST /api/payment/payos/create
 */
export async function createPayOSPayment(req, res) {
	try {
		const { amount, courseId } = req.body;

		// ✅ Lấy userId từ JWT token (req.user được set bởi middleware)
		const userId = req.user?.id || req.user?._id;

		// ✅ Validate input
		if (!courseId || !userId) {
			return res.status(400).json({
				success: false,
				message: "courseId và userId là bắt buộc",
			});
		}

		// ✅ Lấy thông tin PayOS từ env
		const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
		const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
		const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

		if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
			return res.status(500).json({
				success: false,
				message: "PayOS chưa được cấu hình. Vui lòng kiểm tra .env",
			});
		}

		// ✅ Kiểm tra course tồn tại
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Không tìm thấy khóa học",
			});
		}

		// ✅ Kiểm tra user tồn tại
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Không tìm thấy người dùng",
			});
		}

		// ✅ Tạo transaction ID duy nhất
			const transactionId = `TXN${Date.now()}${Math.random()
				.toString(36)
				.substr(2, 9)
				.toUpperCase()}`;

			const paymentAmount = amount || course.price;
			const orderCode = Date.now(); // Unique order code

			// ✅ Tạo description (QUAN TRỌNG: Phải chứa TXN để webhook xử lý)
			// PayOS giới hạn description tối đa 25 ký tự
			const description = transactionId; // Chỉ dùng transactionId (dài ~22 ký tự)

			// ✅ Lưu payment vào database TRƯỚC
			const payment = new Payment({
				userId,
				courseId,
				amount: paymentAmount,
				paymentMethod: "payos",
				status: "pending",
				transactionId,
				paymentDetails: {
					orderCode: orderCode.toString(),
					paymentLinkId: "", // Sẽ cập nhật sau khi tạo link
				},
				expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Hết hạn sau 30 phút
				note: `${transactionId} - ${course.title}`,
			});

			await payment.save();

			// ✅ Tạo payment link với PayOS API
			const payosData = {
				orderCode: orderCode,
				amount: paymentAmount,
				description: description,
				returnUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment-success?paymentId=${payment._id}`,
				cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment-cancel?paymentId=${payment._id}`,
			};

			// ✅ Tạo checksum (signature) cho request
			const dataStr = `amount=${payosData.amount}&cancelUrl=${payosData.cancelUrl}&description=${payosData.description}&orderCode=${payosData.orderCode}&returnUrl=${payosData.returnUrl}`;
			const signature = crypto
				.createHmac("sha256", PAYOS_CHECKSUM_KEY)
				.update(dataStr)
				.digest("hex");

			// ✅ Gọi PayOS API
			try {
				const response = await fetch(
					"https://api-merchant.payos.vn/v2/payment-requests",
					{
						method: "POST",
						headers: {
							"x-client-id": PAYOS_CLIENT_ID,
							"x-api-key": PAYOS_API_KEY,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							...payosData,
							signature: signature,
						}),
					}
				);
				const result = await response.json();
				if (result && result.paymentUrl) {
					payment.paymentDetails.paymentLinkId = result.paymentLinkId || "";
					await payment.save();
					return res.json({
						success: true,
						paymentUrl: result.paymentUrl,
						paymentId: payment._id,
					});
				} else {
					return res.status(500).json({
						success: false,
						message: "Không tạo được link thanh toán PayOS",
						result,
					});
				}
			} catch (err) {
				return res.status(500).json({
					success: false,
					message: "Lỗi khi gọi PayOS API",
					error: err.message,
				});
			}
		} catch (error) {
			return res.status(403).json({ error: "Invalid or expired token" });
		}
	}
