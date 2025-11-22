Chatbot AI HUS
Thực hiện bởi: Nhóm sinh viên trường Đại học Khoa học Tự nhiên (HUS)

Project URL: https://www.suhanwijaya.com/ai-chatbot

Chạy trên máy cục bộ (Local Development)
Tạo một OpenAI API key và gán nó vào biến môi trường OPENAI_API_KEY.

Đảm bảo bạn đã cài đặt và đang chạy Docker. Để build và khởi động các container, chạy lệnh:

Bash

npm start
Dịch vụ sẽ chạy tại địa chỉ http://localhost:3000.

Để theo dõi logs (nhật ký hoạt động):

Bash

docker compose logs -f
Để dừng và gỡ bỏ các Docker container:

Bash

npm stop
Tổng quan
Chức năng
Các tính năng cốt lõi
Giao diện trò chuyện thời gian thực với phản hồi từ AI.

Xác thực người dùng (Đăng ký/Đăng nhập).

Quản lý lịch sử cuộc trò chuyện.

Hỗ trợ đa phiên làm việc (Multi-session).

Lưu trữ bền vững các cuộc hội thoại.

Tích hợp AI
Ứng dụng sử dụng mô hình GPT của OpenAI để tạo phản hồi, với giao diện GenAIClient được thiết kế để dễ dàng tích hợp với các nhà cung cấp AI khác trong tương lai.

Thiết kế và Trải nghiệm người dùng
Giao diện người dùng (UI)
Thiết kế hiện đại, gọn gàng dựa trên Material-UI.

Giao diện chat trực quan với lịch sử tin nhắn và khu vực nhập liệu.

Bố cục đơn giản với thanh bên (sidebar) có thể thu gọn để xem lại các đoạn chat cũ.

Trải nghiệm người dùng (UX)
Cập nhật tin nhắn theo thời gian thực.

Tự động cuộn xuống tin nhắn mới nhất.

Hiển thị trạng thái đang tải (loading) trong khi AI phản hồi.

Xử lý lỗi với các thông báo thân thiện cho người dùng.

Duy trì phiên đăng nhập.

Kiến trúc hệ thống
Cấu trúc dự án
Kiến trúc mô-đun (Modular architecture) với sự phân tách rõ ràng các mối quan tâm (separation of concerns).

Kết nối lỏng lẻo (Loosely coupled) giữa các thành phần: Client, Server, Data, Cache và Integration.

Sử dụng TypeScript toàn diện để đảm bảo an toàn kiểu dữ liệu (type safety) và trải nghiệm lập trình tốt (DevEx).

Sử dụng Docker compose để đơn giản hóa việc thiết lập môi trường cục bộ.

Phong cách code và định dạng nhất quán.

Kiến trúc 3 tầng (Three-Tier Architecture)
Client (Lớp Frontend)
React kết hợp với các component của Material-UI.

Redux để quản lý trạng thái toàn cục (global state management).

Tách biệt các lát cắt (slices) cho trạng thái dữ liệu và trạng thái giao diện.

Cập nhật giao diện lạc quan (Optimistic chat updates) giúp tăng trải nghiệm người dùng.

Server (Lớp Ứng dụng)
Máy chủ Express.js.

Kiến trúc dựa trên plugin để phân tách mối quan tâm và dễ dàng mở rộng trong tương lai.

Quản lý phiên (session) bảo mật.

RESTful API với xác thực và phản hồi lỗi rõ ràng.

Data (Lớp Dữ liệu)
MongoDB: Lưu trữ hồ sơ người dùng và nội dung cuộc trò chuyện.

Redis: Quản lý phiên làm việc (session management).

Repository Pattern: Trừu tượng hóa logic truy cập dữ liệu khỏi logic nghiệp vụ.

Cơ sở hạ tầng (Infrastructure)
Đóng gói bằng Docker (Containerization) giúp dễ dàng triển khai và mở rộng.

Cấu hình riêng biệt cho môi trường phát triển (development) và sản xuất (production).

Server và Redis được triển khai trên dịch vụ quản lý của Render.

Client được triển khai trên Render static site (đóng vai trò như CDN).

Cơ sở dữ liệu MongoDB được triển khai trên MongoDB Atlas serverless.

Bảo mật
Xác thực dựa trên phiên (Session-based Authentication)
Băm mật khẩu an toàn (Secure password hashing) trong kho dữ liệu.

Sử dụng Redis để lưu trữ phiên tạm thời.

Cấu hình Cookie bảo mật.

Bảo mật hạ tầng
Quản lý biến môi trường (không lưu trữ bí mật/secrets trong mã nguồn).

Làm sạch URI cơ sở dữ liệu để tránh lộ thông tin đăng nhập trong logs.

Khả năng mở rộng và Hiệu năng
Các tối ưu hiện tại
Docker containerization để dễ dàng triển khai và mở rộng quy mô.

Kho lưu trữ Redis cho phép tận dụng khả năng caching.

Tối ưu hóa Webpack để giảm kích thước gói ứng dụng (bundle size).

Cân nhắc về khả năng mở rộng
Sự liên kết lỏng lẻo giữa các kho dữ liệu và ứng dụng giúp mỗi lớp có thể được thay thế hoặc mở rộng độc lập.

Lựa chọn MongoDB cho khả năng mở rộng theo chiều ngang (horizontal scalability) và mô hình linh hoạt để phù hợp với các cuộc hội thoại đa phương thức.

Cấu hình render.yaml cho phép triển khai đám mây có thể mở rộng thông qua Infrastructure-as-Code.

Định hướng phát triển (Future Improvements)
Nếu có thêm thời gian, nhóm sẽ thực hiện các cải tiến sau:

Tính năng
Trau chuốt định dạng hiển thị của các câu trả lời từ AI.

Hỗ trợ tải lên tệp tin (file upload) để cho phép hội thoại đa phương thức.

Thêm tính năng xuất/chia sẻ cuộc trò chuyện.

Tích hợp thêm nhiều nhà cung cấp AI khác (ví dụ: Google Gemini, Anthropic Claude).

Hiệu năng
Viết các bài kiểm thử: Unit test, Integration test và End-to-end test.

Tối ưu hóa cơ sở dữ liệu trong việc cập nhật hội thoại.

Triển khai giới hạn tốc độ API (API rate limiting).

Thêm bộ nhớ đệm cho các yêu cầu (request caching).

Tối ưu hóa kích thước gói client.

Bảo mật
Triển khai xoay vòng API key.

Yêu cầu người dùng ứng dụng cung cấp API key của riêng họ.

Giám sát (Monitoring)
Cấu trúc hóa logging và báo cáo/xử lý lỗi tốt hơn.

Triển khai các công cụ quan sát (o11y tools) như Datadog.

Giám sát các chỉ số tính toán/lưu trữ, logs và traces.