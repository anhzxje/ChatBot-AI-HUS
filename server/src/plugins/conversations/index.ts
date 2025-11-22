import {
  Router,
  type Application,
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";
import { requireLogin } from "../auth/helpers";
import { ConversationRepo, type IConversationRepo } from "@data";
import { OpenAIClient, type GenAIClient } from "@integrations";

const conversationRepo: IConversationRepo = new ConversationRepo();
const aiClient: GenAIClient = new OpenAIClient();

// === 1. CẤU HÌNH SYSTEM PROMPT (LUẬT CHO AI & NGÔN NGỮ) ===
const SYSTEM_PROMPT = {
  role: "system",
  content: `Bạn là trợ lý ảo HUS hữu ích.
  
  QUY TẮC NGÔN NGỮ:
  - Luôn trả lời bằng Tiếng Việt một cách tự nhiên, thân thiện.

  QUY TẮC HIỂN THỊ TOÁN HỌC (BẮT BUỘC):
  1. MỌI công thức toán học, ký hiệu toán học (x, y, n,...) PHẢI được viết dưới dạng LaTeX.
  2. Bao quanh công thức cùng dòng (inline) bằng dấu $. Ví dụ: $E=mc^2$.
  3. Bao quanh công thức riêng dòng (block) bằng dấu $$. Ví dụ: $$ x = \frac{-b \pm \sqrt{\Delta}}{2a} $$.
  4. KHÔNG dùng ngoặc vuông \[...\] hoặc ngoặc đơn \(...\) cho công thức.
  5. Trình bày lời giải rõ ràng, từng bước.
  `
};

// === 2. HÀM FORMAT TIN NHẮN (HỖ TRỢ ẢNH + SYSTEM PROMPT) ===
const formatMessagesForAI = (messages: any[]) => {
  const formattedMessages = messages.map((msg) => {
    if (msg.images && Array.isArray(msg.images) && msg.images.length > 0) {
      return {
        role: msg.role,
        content: [
          { type: "text", text: msg.content || "" },
          {
            type: "image_url",
            image_url: {
              url: msg.images[0],
              detail: "auto",
            },
          },
        ],
      };
    }
    return {
      role: msg.role,
      content: msg.content,
    };
  });

  return [SYSTEM_PROMPT, ...formattedMessages];
};

export class Conversations {
  constructor(app: Application) {
    const router = Router();
    router.use(requireLogin);
    router.post("/", this.createConversation);
    router.put("/:conversationId", this.updateConversation);
    router.get("/", this.getConversations);
    router.get("/:conversationId", this.getConversation);
    router.delete("/:conversationId", this.deleteConversation);
    router.use(this.handleError);

    app.use("/api/conversations", router);

    console.log("Conversations plugin registered");
  }

  createConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { messages, title } = req.body;

      const messagesToSend = formatMessagesForAI(messages);

      const aiResponse = await aiClient.generateResponse(messagesToSend as any);
      
      if (!aiResponse) {
        throw {
          status: 502,
          // [VIỆT HÓA] Lỗi khi AI không phản hồi
          message: "Xin lỗi! Hệ thống đang phản hồi chậm. Vui lòng thử lại sau ít phút.",
        };
      }

      // --- XỬ LÝ TẠO TIÊU ĐỀ ---
      const fullConversationMessages = [
        ...messages,
        {
          role: aiResponse.role,
          content: aiResponse.content,
        },
      ];

      const titleRequestMessages = [
        ...fullConversationMessages.map(m => ({ 
            role: m.role, 
            content: Array.isArray(m.content) ? m.content[0].text : m.content 
        })),
        {
          role: "user",
          // [VIỆT HÓA] Lời nhắc tạo tiêu đề
          content: "Dựa trên nội dung cuộc trò chuyện, hãy đặt một tiêu đề thật ngắn gọn (tối đa 6 từ) bằng Tiếng Việt. Chỉ trả lời duy nhất tiêu đề đó, không có dấu ngoặc kép.",
        },
      ];

      const titleAiResponse = await aiClient.generateResponse(
        titleRequestMessages
      );

      const newTitle = titleAiResponse?.content
        ? titleAiResponse.content.trim().replace(/["']/g, "")
        : title || "Cuộc trò chuyện mới"; // [VIỆT HÓA] Tiêu đề mặc định

      // --- LƯU DB ---
      const conversation = await conversationRepo.create({
        title: newTitle,
        messages: fullConversationMessages,
        user: userId!,
      });

      if (!conversation) {
        throw { status: 422, message: "Không thể tạo cuộc trò chuyện mới." }; // [VIỆT HÓA]
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  updateConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { conversationId } = req.params;
      const { title, messages } = req.body;
      let conversation;

      if (messages?.length) {
        const messagesToSend = formatMessagesForAI(messages);

        const aiResponse = await aiClient.generateResponse(messagesToSend as any);
        
        if (!aiResponse) {
          throw {
            status: 502,
            message: "Xin lỗi! Hệ thống đang quá tải. Vui lòng thử lại sau.", // [VIỆT HÓA]
          };
        }

        conversation = await conversationRepo.update({
          _id: conversationId,
          user: userId!,
          title,
          messages: [
            ...messages,
            {
              role: aiResponse.role,
              content: aiResponse.content,
            },
          ],
        });
      } else {
        conversation = await conversationRepo.update({
          _id: conversationId,
          user: userId!,
          title,
        });
      }

      if (!conversation) {
        throw { status: 422, message: "Không thể cập nhật cuộc trò chuyện." }; // [VIỆT HÓA]
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversation: RequestHandler = async (req, res, next) => {
    try {
      const { conversationId } = req.params;
      const { id: userId } = req.session.user || {};
      const conversation = await conversationRepo.findById(
        conversationId,
        userId!
      );

      if (!conversation) {
        throw { status: 404, message: "Không tìm thấy cuộc trò chuyện." }; // [VIỆT HÓA]
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversations: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};

      const conversations = await conversationRepo.findByUser(userId!);

      res.json({ data: conversations });
    } catch (err) {
      next(err);
    }
  };

  deleteConversation: RequestHandler = async (req, res, next) => {
    const { id: userId } = req.session.user || {};
    const { conversationId } = req.params;
    try {
      const data = await conversationRepo.deleteById(conversationId, userId!);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  };

  handleError: ErrorRequestHandler = (err, req, res, next) => {
    console.error(
      "CONVERSATION_ERROR",
      JSON.stringify(
        {
          userId: req.session?.user?.id,
          conversationId: req.params?.conversationId,
          conversationTitle: req.body?.title,
          conversationMessages: req.body?.messages,
          err,
        },
        null,
        2
      )
    );
    res.status(err.status || 500).send(err.message);
  };
}