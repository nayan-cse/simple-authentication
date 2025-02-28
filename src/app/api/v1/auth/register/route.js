import { db } from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
        }

        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ message: "User already exists." }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        return new Response(JSON.stringify({ message: "User registered successfully." }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error }), { status: 500 });
    }
}
