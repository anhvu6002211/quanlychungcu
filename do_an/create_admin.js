const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'your_password_here',
        database: process.env.DB_NAME || 'apartment_db'
    });

    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.execute(
            'INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhau, VaiTro, TrangThai, Email) VALUES (?, ?, ?, ?, ?, ?)',
            ['ND001', 'admin', hashedPassword, 'admin', 'Hoạt động', 'admin@chungcu.com']
        );
        console.log("Admin user created successfully!");
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log("Admin user already exists. Updating password to admin123...");
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'UPDATE NguoiDung SET MatKhau = ?, VaiTro = "admin" WHERE TenDangNhap = "admin"',
                [hashedPassword]
            );
            console.log("Admin password updated successfully!");
        } else {
            console.error("Error:", err);
        }
    } finally {
        await connection.end();
    }
}

createAdmin();
