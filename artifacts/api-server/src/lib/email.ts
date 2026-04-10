/**
 * Email notification utility using Nodemailer.
 *
 * Configure these environment variables with your SMTP provider credentials:
 *   SMTP_HOST  — e.g. "smtp.gmail.com" or "mail.your-domain.com"
 *   SMTP_PORT  — e.g. "587" (TLS) or "465" (SSL)
 *   SMTP_USER  — your SMTP username / email address
 *   SMTP_PASS  — your SMTP password or app password
 *
 * Until you set these, email sending is silently skipped (no crash).
 */
import nodemailer from "nodemailer";

const smtpConfigured =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendNewQuestionNotification(question: {
  text: string;
  chapter: string;
  questionType: string;
  difficulty: string;
  examPeriod: string;
  courseName: string;
  courseCode: string;
}) {
  if (!transporter) {
    console.log("[Email] SMTP not configured — skipping notification email.");
    return;
  }

  const typeLabel: Record<string, string> = {
    multiple_choice: "اختيار من متعدد",
    true_false: "صح وخطأ",
    essay: "مقالي",
    fill_blank: "أكمل الفراغ",
  };
  const diffLabel: Record<string, string> = {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
  };

  const adminUrl = `${process.env.APP_URL ?? "https://insightexam.com"}/admin`;

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563EB; margin-bottom: 4px;">Insight Exam</h2>
      <h3 style="color: #1e293b; margin-top: 0;">سؤال جديد بانتظار المراجعة</h3>
      <hr style="border-color: #e2e8f0;" />
      <table style="width:100%; border-collapse:collapse; margin-top: 16px;">
        <tr><td style="padding: 6px 0; color:#64748b; width:140px;">المقرر</td><td style="padding: 6px 0; font-weight:bold;">${question.courseName} (${question.courseCode})</td></tr>
        <tr><td style="padding: 6px 0; color:#64748b;">الفصل / الموضوع</td><td style="padding: 6px 0;">${question.chapter}</td></tr>
        <tr><td style="padding: 6px 0; color:#64748b;">نوع السؤال</td><td style="padding: 6px 0;">${typeLabel[question.questionType] ?? question.questionType}</td></tr>
        <tr><td style="padding: 6px 0; color:#64748b;">مستوى الصعوبة</td><td style="padding: 6px 0;">${diffLabel[question.difficulty] ?? question.difficulty}</td></tr>
        <tr><td style="padding: 6px 0; color:#64748b;">الفترة الدراسية</td><td style="padding: 6px 0;">${question.examPeriod}</td></tr>
      </table>
      <div style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border-right: 4px solid #2563EB;">
        <p style="margin: 0; color:#64748b; font-size: 13px;">نص السؤال:</p>
        <p style="margin: 8px 0 0; color:#1e293b;">${question.text}</p>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${adminUrl}" style="display:inline-block; background:#2563EB; color:#fff; text-decoration:none; padding: 12px 24px; border-radius: 8px; font-weight:bold;">
          مراجعة السؤال في لوحة الإدارة
        </a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Insight Exam" <${process.env.SMTP_USER}>`,
      to: "admin@insightexam.com",
      subject: "سؤال جديد بانتظار المراجعة — Insight Exam",
      html,
    });
    console.log("[Email] Admin notification sent successfully.");
  } catch (err) {
    console.error("[Email] Failed to send notification:", err);
  }
}
