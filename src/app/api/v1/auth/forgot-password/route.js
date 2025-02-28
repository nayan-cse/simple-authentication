import { db } from "../../../../lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 400 });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

        await db.query("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?", [
            resetToken,
            resetTokenExpiry,
            email,
        ]);

        // ✅ Set up Nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Use App Password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Reset link sent to email." }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
