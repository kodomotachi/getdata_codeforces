const { MongoClient } = require('mongodb');

// const url = 'mongodb://127.0.0.1:27017/'; // dùng IPv4 để tránh lỗi ECONNREFUSED
const url = `mongodb+srv://${username}:${password}@cluster0.e6oezwc.mongodb.net/?appName=Cluster0`;
const dbName = 'problemset'; // thay tên DB nếu cần

const client = new MongoClient(url);

async function checkConnection() {
  try {
    // Thử kết nối
    await client.connect();
    console.log('✅ Kết nối MongoDB thành công!');

    // Kiểm tra danh sách database (tùy chọn)
    const admin = client.db(dbName).admin();
    const dbs = await admin.listDatabases();
    console.log('📂 Danh sách databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));

  } catch (err) {
    console.error('❌ Kết nối MongoDB thất bại:', err.message);
  } finally {
    await client.close();
  }
}

checkConnection();
