import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// استيراد دالة تحديد الرابط من المكتبة التي وجدناها قبل قليل
import { setBaseUrl } from "../../../lib/api-client-react/src";

// تأكد من الرابط السحابي الصحيح للسيرفر (الباك إند)
setBaseUrl("https://insight-exam.onrender.com");

createRoot(document.getElementById("root")!).render(<App />);
