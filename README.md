# ZOLA - Real-Time Chat App

Ứng dụng chat thời gian thực (real-time messaging), được xây dựng với MERN Stack (MongoDB, Express, React, Node.js) và Socket.io.
#
- Frontend: `https://zaloapp-client.onrender.com`
- Backend API: `https://zolaapp.onrender.com`

> ⚠️ Deploy trên Render free-tier, server có thể "ngủ" sau một thời gian không hoạt động, lần truy cập đầu có thể mất 30-60 giây để khởi động lại.

## Tính năng

- Đăng ký / đăng nhập với JWT, mã hóa mật khẩu bằng bcrypt
- Nhắn tin realtime 1-1 qua Socket.io
- Theo dõi trạng thái online / offline của người dùng
- Đếm và xóa số tin nhắn chưa đọc theo từng cuộc trò chuyện
- Hiển thị trạng thái "đang gõ..." (typing indicator)
- Tải lên ảnh đại diện qua Cloudinary
- Danh sách và tìm kiếm người dùng để bắt đầu cuộc trò chuyện mới

## Công nghệ sử dụng

**Frontend**
- React
- Redux
- Axios
- Socket.io-client

**Backend**
- Node.js, Express
- Socket.io
- MongoDB + Mongoose (MongoDB Atlas)
- JWT (jsonwebtoken)
- bcryptjs
- Cloudinary (lưu trữ ảnh)

**Triển khai (Deployment)**
- Render — Static Site cho client, Web Service cho server

## Cấu trúc thư mục

```
Real-Time-Chat-App/
├── server/
│   ├── config/
│   │   └── dbConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── chat.js
│   │   ├── message.js
│   │   └── user.js
│   ├── app.js
│   ├── cloudinary.js
│   ├── config.env
│   └── server.js
└── client/
    └── src/
        ├── apiCalls/
        ├── components/
        ├── pages/
        └── redux/
```

## ⚙️ Cài đặt

Yêu cầu: Node.js >= 16, tài khoản MongoDB Atlas, tài khoản Cloudinary.

```bash
# Clone repository
git clone https://github.com/dqhuy0604/Real-Time-Chat-App.git
cd Real-Time-Chat-App

# Cài đặt cho server
cd server
npm install

# Cài đặt cho client
cd ../client
npm install
```

## Biến môi trường

Tạo file `config.env` trong thư mục `server/` với nội dung:

```env
PORT_NUMBER=5000
CONN_STRING=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Trong `client/src/apiCalls/index.js`, cập nhật `url` trỏ về đúng địa chỉ backend của bạn:

```javascript
export const url = "https://your-backend-url.onrender.com";
```

## Chạy ứng dụng (local)

```bash
# Chạy server (mặc định port 5000)
cd server
npm start

# Chạy client (mặc định port 3000), mở terminal khác
cd client
npm start
```

Truy cập `http://localhost:3000` để sử dụng ứng dụng.

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/signup` | Đăng ký tài khoản mới | Không |
| POST | `/login` | Đăng nhập, trả về JWT token | Không |

### User — `/api/user`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/get-logged-user` | Lấy thông tin người dùng đang đăng nhập | Có |
| GET | `/get-all-users` | Lấy danh sách người dùng khác | Có |
| POST | `/upload-profile-pic` | Tải lên ảnh đại diện | Có |

### Chat — `/api/chat`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/create-new-chat` | Tạo cuộc trò chuyện mới | Có |
| GET | `/get-all-chats` | Lấy danh sách cuộc trò chuyện | Có |
| POST | `/clear-unread-message` | Đánh dấu đã đọc toàn bộ tin nhắn trong 1 chat | Có |

### Message — `/api/message`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/new-message` | Gửi tin nhắn mới | Có |
| GET | `/get-all-messages/:chatId` | Lấy toàn bộ tin nhắn của 1 cuộc trò chuyện | Có |

> Các route có "Auth: Có" yêu cầu gửi kèm header `Authorization: Bearer <token>`.

### Socket.io Events

| Event | Chiều | Mô tả |
|---|---|---|
| `join-room` | Client → Server | Tham gia phòng theo userId |
| `send-message` | Client → Server | Gửi tin nhắn realtime |
| `receive-message` | Server → Client | Nhận tin nhắn mới |
| `user-typing` / `started-typing` | 2 chiều | Trạng thái đang gõ |
| `user-login` / `user-offline` | Client → Server | Cập nhật trạng thái online |
| `online-users-updated` | Server → Client | Danh sách người dùng đang online |
| `clear-unread-messages` / `message-count-cleared` | 2 chiều | Đồng bộ số tin nhắn chưa đọc |

## 🐛 Các lỗi thường gặp khi deploy

- **CORS bị chặn:** kiểm tra origin trong `app.js` khớp chính xác domain frontend thật (phân biệt hoa/thường, không thừa/thiếu ký tự).
- **404 khi load trang React trên Render Static Site:** thêm Redirect/Rewrite rule `/* → /index.html` trong Settings của Static Site.
- **Server không nhận request (ERR_FAILED):** kiểm tra server đang lắng nghe đúng biến `process.env.PORT` (do Render tự gán), không hardcode port cố định.

## License

MIT (hoặc điều chỉnh theo nhu cầu của bạn)

## Tác giả

**dqhuy0604** — [GitHub](https://github.com/dqhuy0604)
