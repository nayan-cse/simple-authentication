import { db } from "../../../lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.query("SELECT id, name, email FROM users WHERE id = ?", [decoded.id]);
        if (user.length === 0) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
        }

        return new Response(JSON.stringify({ user: user[0] }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Invalid token." }), { status: 401 });
    }
}
