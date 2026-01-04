# Scripts - Question Generation

## 📁 Files

- **`questionData.js`** - Danh sách câu hỏi gốc từ đề thi CSP và CR chính thức
- **`generateQuestions.js`** - Script tự động generate câu hỏi với đáp án và giải thích sử dụng Claude API

## 🚀 Usage

### Generate Questions

```bash
# 1. Thêm API key vào file .env ở root project
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# 2. Chạy script
node scripts/generateQuestions.js
```

Script sẽ:
- ✅ Phân tích 190 câu CSP và 209 câu CR
- ✅ Tìm câu hỏi chung giữa CSP và CR (~32 câu)
- ✅ Generate 4 options, đáp án đúng, và giải thích cho mỗi câu
- ✅ Tạo file `src/data/questions.js` hoàn chỉnh
- ⏱️ Thời gian: ~5-10 phút

### Output

File `src/data/questions.js` sẽ chứa:
- ~327 câu hỏi hoàn chỉnh
- 150 câu CSP (22 câu chung)
- 199 câu CR (22 câu chung)
- Mỗi câu có: question, options[4], correct, explanation, category, tags

## 🔧 Configuration

Thay đổi batch size trong `generateQuestions.js`:
```javascript
const batchSize = 20; // Số câu hỏi mỗi lần gọi API
```

## 📝 Note

- Script tự động bỏ qua các batch lỗi và tiếp tục
- Có rate limiting 1s giữa các batch để tránh quá tải API
- File .env đã được thêm vào .gitignore để bảo vệ API key
