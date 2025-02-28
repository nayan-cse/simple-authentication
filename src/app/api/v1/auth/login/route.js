import { db } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Invalid credentials." }), { status: 401 });
        }

        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error }), { status: 500 });
    }
}
