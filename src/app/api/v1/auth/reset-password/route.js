import { db } from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { token, newPassword } = body;
        const [user] = await db.query("SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?", [
            token,
            Date.now(),
        ]);

        if (user.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid or expired token." }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query("UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?", [
            hashedPassword,
            user[0].id,
        ]);

        return new Response(JSON.stringify({ message: "Password reset successful." }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error }), { status: 500 });
    }
}
