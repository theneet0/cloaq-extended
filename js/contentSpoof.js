// Auto-generated Zero-Latency MAIN World Pre-Shield for Cloaq Extended
(() => {
  try {
    const bits = window.__cloaq_b;
    try { delete window.__cloaq_b; } catch (e) {}
    if (!Array.isArray(bits) || bits.length === 0) return;

    const TIMEZONE_LIST = ["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmera","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Buenos_Aires","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Catamarca","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Ciudad_Juarez","America/Coral_Harbour","America/Cordoba","America/Costa_Rica","America/Coyhaique","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Inuvik","America/Iqaluit","America/Jamaica","America/Jujuy","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Louisville","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Mendoza","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montreal","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santa_Isabel","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Calcutta","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Istanbul","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Katmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Saigon","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faeroe","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","Brazil/East","Canada/Central","Canada/Eastern","Canada/Mountain","Canada/Pacific","Etc/GMT","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+2","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT-1","Etc/GMT-10","Etc/GMT-11","Etc/GMT-12","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-7","Etc/GMT-8","Etc/GMT-9","Etc/GMT0","Etc/UTC","Etc/Universal","Etc/Zulu","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Kyiv","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","GMT","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Johnston","Pacific/Kanton","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Ponape","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Truk","Pacific/Wake","Pacific/Wallis","US/Alaska","US/Central","US/Eastern","US/Hawaii","US/Mountain","US/Pacific","UTC"];
    const LOCALE_LIST = ["af-NA","ak-GH","ar-AE","ar-BH","ar-DZ","ar-EG","ar-IQ","ar-JO","ar-KW","ar-LB","ar-LY","ar-MA","ar-OM","ar-PS","ar-QA","ar-SA","ar-SY","ar-TD","ar-TN","ar-YE","az-AZ","be-BY","bg-BG","bm-ML","bn-BD","bs-BA","ca-AD","cs-CZ","da-DK","de-AT","de-CH","de-DE","de-LI","dv-MV","dz-BT","el-CY","el-GR","en-AG","en-AU","en-BB","en-BM","en-BS","en-BW","en-BZ","en-CA","en-DM","en-FJ","en-FM","en-GB","en-GD","en-GM","en-GU","en-GY","en-IE","en-IN","en-JM","en-KE","en-KI","en-KN","en-KY","en-LC","en-LR","en-LS","en-MH","en-MP","en-MU","en-MW","en-NG","en-NR","en-NZ","en-PG","en-PH","en-PW","en-SB","en-SC","en-SD","en-SG","en-SL","en-SO","en-SS","en-SZ","en-TO","en-TT","en-TV","en-TZ","en-UG","en-US","en-VC","en-VU","en-WS","en-ZA","en-ZM","en-ZW","es-AR","es-BO","es-CL","es-CO","es-CR","es-CU","es-DO","es-EC","es-ES","es-GQ","es-GT","es-HN","es-MX","es-NI","es-PA","es-PE","es-PY","es-SV","es-UY","et-EE","fa-AF","fa-IR","fi-FI","fr-BF","fr-BI","fr-BJ","fr-CA","fr-CD","fr-CF","fr-CG","fr-CM","fr-DJ","fr-FR","fr-GA","fr-GN","fr-HT","fr-KM","fr-LU","fr-MC","fr-MF","fr-MG","fr-MR","fr-NE","fr-RW","fr-SN","fr-TG","he-IL","hi-IN","hr-HR","hu-HU","hy-AM","id-ID","is-IS","it-IT","it-SM","it-VA","ja-JP","ka-GE","kk-KZ","km-KH","ko-KP","ko-KR","ky-KG","ln-AO","lo-LA","lt-LT","lv-LV","mk-MK","mn-MN","ms-BN","ms-MY","mt-MT","my-MM","nb-NO","ne-NP","nl-BE","nl-NL","nl-SR","no-NO","om-ET","pl-PL","pt-BR","pt-CV","pt-GW","pt-MZ","pt-PT","pt-ST","pt-TL","ro-MD","ro-RO","ru-RU","ru-TJ","si-LK","sk-SK","sl-SI","sq-AL","sr-Latn-ME","sr-RS","sv-SE","th-TH","ti-ER","tk-TM","tr-TR","uk-UA","ur-PK","vi-VN","zh-CN","zh-HK","zh-MO","zh-SG","zh-TW"];
    const QWERTY_US = {"Backquote":"`","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"-","Equal":"=","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"[","BracketRight":"]","Backslash":"\\","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":";","Quote":"'","KeyZ":"z","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":",","Period":".","Slash":"/"};
    const QWERTY_UK = {"Backquote":"`","Digit1":"1","Digit2":"\"","Digit3":"£","Digit4":"$","Digit5":"%","Digit6":"^","Digit7":"&","Digit8":"*","Digit9":"(","Digit0":")","Minus":"-","Equal":"=","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"[","BracketRight":"]","Backslash":"\\","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":";","Quote":"'","KeyZ":"z","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":",","Period":".","Slash":"/"};
    const QWERTZ_DE = {"Backquote":"^","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"ß","Equal":"´","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"z","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"ü","BracketRight":"+","Backslash":"#","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":"ö","Quote":"ä","KeyZ":"y","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":",","Period":".","Slash":"-"};
    const AZERTY_FR = {"Backquote":"²","Digit1":"&","Digit2":"é","Digit3":"\"","Digit4":"'","Digit5":"(","Digit6":"-","Digit7":"è","Digit8":"_","Digit9":"ç","Digit0":"à","Minus":")","Equal":"=","KeyQ":"a","KeyW":"z","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"^","BracketRight":"$","Backslash":"*","KeyA":"q","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":"m","Quote":"ù","KeyZ":"w","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":",","Comma":";","Period":":","Slash":"!"};
    const TURKISH_Q = {"Backquote":"\"","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"*","Equal":"-","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"ı","KeyO":"o","KeyP":"p","BracketLeft":"ğ","BracketRight":"ü","Backslash":",","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":"ş","Quote":"i","KeyZ":"z","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":"ö","Period":"ç","Slash":"."};
    const SPANISH = {"Backquote":"º","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"'","Equal":"¡","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"`","BracketRight":"+","Backslash":"ç","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":"ñ","Quote":"´","KeyZ":"z","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":",","Period":".","Slash":"-"};
    const ITALIAN = {"Backquote":"\\","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"'","Equal":"ì","KeyQ":"q","KeyW":"w","KeyE":"e","KeyR":"r","KeyT":"t","KeyY":"y","KeyU":"u","KeyI":"i","KeyO":"o","KeyP":"p","BracketLeft":"è","BracketRight":"+","Backslash":"ù","KeyA":"a","KeyS":"s","KeyD":"d","KeyF":"f","KeyG":"g","KeyH":"h","KeyJ":"j","KeyK":"k","KeyL":"l","Semicolon":"ò","Quote":"à","KeyZ":"z","KeyX":"x","KeyC":"c","KeyV":"v","KeyB":"b","KeyN":"n","KeyM":"m","Comma":",","Period":".","Slash":"-"};
    const JCUKEN_RU = {"Backquote":"ё","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","Digit0":"0","Minus":"-","Equal":"=","KeyQ":"й","KeyW":"ц","KeyE":"у","KeyR":"к","KeyT":"е","KeyY":"н","KeyU":"г","KeyI":"ш","KeyO":"щ","KeyP":"з","BracketLeft":"х","BracketRight":"ъ","Backslash":"\\","KeyA":"ф","KeyS":"ы","KeyD":"в","KeyF":"а","KeyG":"п","KeyH":"р","KeyJ":"о","KeyK":"л","KeyL":"д","Semicolon":"ж","Quote":"э","KeyZ":"я","KeyX":"ч","KeyC":"с","KeyV":"м","KeyB":"и","KeyN":"т","KeyM":"ь","Comma":"б","Period":"ю","Slash":"."};
    const PERSIAN_FA = {"Backquote":"÷","Digit1":"۱","Digit2":"۲","Digit3":"۳","Digit4":"۴","Digit5":"۵","Digit6":"۶","Digit7":"۷","Digit8":"۸","Digit9":"۹","Digit0":"۰","Minus":"-","Equal":"=","KeyQ":"ض","KeyW":"ص","KeyE":"ث","KeyR":"ق","KeyT":"ف","KeyY":"غ","KeyU":"ع","KeyI":"ه","KeyO":"خ","KeyP":"ح","BracketLeft":"ج","BracketRight":"چ","Backslash":"\\","KeyA":"ش","KeyS":"س","KeyD":"ی","KeyF":"ب","KeyG":"ل","KeyH":"ا","KeyJ":"ت","KeyK":"ن","KeyL":"م","Semicolon":"ک","Quote":"گ","KeyZ":"ظ","KeyX":"ط","KeyC":"ز","KeyV":"ر","KeyB":"ذ","KeyN":"د","KeyM":"پ","Comma":"و","Period":".","Slash":"/"};

    const getKeyboardLayoutForLocale = (locale) => {
      if (!locale) return QWERTY_US;
      const l = locale.toLowerCase();
      if (l.startsWith('de')) return QWERTZ_DE;
      if (l.startsWith('fr')) return AZERTY_FR;
      if (l.startsWith('tr')) return TURKISH_Q;
      if (l.startsWith('es')) return SPANISH;
      if (l.startsWith('it')) return ITALIAN;
      if (l === 'en-gb' || l.startsWith('en-gb')) return QWERTY_UK;
      if (l.startsWith('ru') || l.startsWith('uk') || l.startsWith('be') || l.startsWith('kk')) return JCUKEN_RU;
      if (l.startsWith('fa')) return PERSIAN_FA;
      return QWERTY_US;
    };

    const set = new Set(bits);
    const readInt = (startBit, numBits) => {
      let val = 0;
      for (let i = 0; i < numBits; i++) {
        if (set.has(startBit + i)) {
          val |= 1 << i;
        }
      }
      return val >>> 0;
    };

    const tzIndex = readInt(0, 10);
    const timezone = tzIndex < TIMEZONE_LIST.length ? TIMEZONE_LIST[tzIndex] : null;

    const locIndex = readInt(10, 8);
    let locale = null;
    if (locIndex < LOCALE_LIST.length) {
      locale = LOCALE_LIST[locIndex];
    } else if (locIndex === 254) {
      let customLoc = '';
      for (let c = 0; c < 14; c++) {
        const code = readInt(62 + c * 7, 7);
        if (code === 0) break;
        customLoc += String.fromCharCode(code);
      }
      locale = customLoc || null;
    }

    let lat = null;
    let lon = null;
    if (set.has(18)) {
      const latInt = readInt(19, 21);
      const lonInt = readInt(40, 22);
      lat = Number((latInt / 10000 - 90).toFixed(4));
      lon = Number((lonInt / 10000 - 180).toFixed(4));
    }

    if (!timezone && !locale && lat == null && lon == null) return;
    const layout = getKeyboardLayoutForLocale(locale || 'en-US');

    
function applyCloaqSpoof(rawLocale, rawTimezone, rawLayout, rawLat, rawLon) {
  'use strict';
  try {
    let currentLocale = rawLocale || null;
    let currentLanguages = currentLocale
      ? Array.from(new Set([currentLocale, currentLocale.split('-')[0], 'en-US', 'en']))
      : null;
    let currentTimezone = rawTimezone || null;
    let currentLayout = rawLayout || null;
    let currentLat = rawLat != null && rawLat !== '' && !Number.isNaN(Number(rawLat)) ? Number(rawLat) : null;
    let currentLon = rawLon != null && rawLon !== '' && !Number.isNaN(Number(rawLon)) ? Number(rawLon) : null;

    const rootWin = typeof window !== 'undefined' ? window : globalThis;
    const STATE_SYM = Symbol.for('__cloaq_internal_state__');

    try {
      if (rootWin.Function && rootWin.Function.prototype && typeof rootWin.Function.prototype.toString === 'function') {
        const existingState = rootWin.Function.prototype.toString.call(STATE_SYM);
        if (existingState && typeof existingState.update === 'function') {
          existingState.update(currentLocale, currentLanguages, currentTimezone, currentLayout, currentLat, currentLon);
          if (typeof existingState.patchWindow === 'function') {
            existingState.patchWindow(rootWin, false);
          }
          return;
        }
      }
    } catch (e) {}

    try {
      if (rootWin.parent && rootWin.parent !== rootWin && rootWin.parent.Function && rootWin.parent.Function.prototype) {
        const parentState = rootWin.parent.Function.prototype.toString.call(STATE_SYM);
        if (parentState && typeof parentState.patchWindow === 'function') {
          parentState.update(currentLocale, currentLanguages, currentTimezone, currentLayout, currentLat, currentLon);
          parentState.patchWindow(rootWin, false);
          return;
        }
      }
    } catch (e) {}

    const customToStrings = new WeakMap();
    const linkedStates = new Set();
    const patchedWindows = new WeakSet();
    const explicitLocaleObjs = new WeakSet();
    const explicitTzDTFs = new WeakSet();
    const spoofedInstances = new WeakMap();
    const blobPartsMap = new WeakMap();
    const blobUrlMap = new Map();
    let currentSpoofedMapData = currentLayout ? new Map(Object.entries(currentLayout)) : new Map();

    const TopOrigDTF =
      typeof Intl !== 'undefined' &&
      Intl.DateTimeFormat &&
      Intl.DateTimeFormat.prototype &&
      typeof Intl.DateTimeFormat.prototype.formatToParts === 'function'
        ? Intl.DateTimeFormat
        : null;

    let tzFormatter = null;
    const rebuildTzFormatter = (FallbackDTF) => {
      tzFormatter = null;
      const Ctor = TopOrigDTF || FallbackDTF;
      if (currentTimezone && Ctor && Ctor.prototype && typeof Ctor.prototype.formatToParts === 'function') {
        try {
          tzFormatter = new Ctor('en-US', {
            timeZone: currentTimezone,
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
            timeZoneName: 'long',
          });
        } catch (e) {
          tzFormatter = null;
        }
      }
    };
    rebuildTzFormatter(null);

    const internalState = {
      customToStrings,
      linkedStates,
      patchWindow,
      getCustomToString(fn) {
        if (!fn || (typeof fn !== 'function' && typeof fn !== 'object')) return undefined;
        if (customToStrings.has(fn)) return customToStrings.get(fn);
        for (const other of linkedStates) {
          if (other && other.customToStrings && other.customToStrings.has(fn)) {
            return other.customToStrings.get(fn);
          }
        }
        return undefined;
      },
      update(newLoc, newLangs, newTz, newLayout, newLat, newLon, visited) {
        const seen = visited || new Set();
        if (seen.has(internalState)) return;
        seen.add(internalState);
        if (newLoc !== undefined) {
          currentLocale = newLoc || null;
          currentLanguages = currentLocale
            ? Array.from(new Set([currentLocale, currentLocale.split('-')[0], 'en-US', 'en']))
            : null;
        }
        if (newTz !== undefined) {
          currentTimezone = newTz || null;
          rebuildTzFormatter(null);
        }
        if (newLayout !== undefined && newLayout !== null) {
          currentLayout = newLayout;
          currentSpoofedMapData = new Map(Object.entries(currentLayout));
        }
        if (newLat !== undefined) currentLat = newLat != null && newLat !== '' && !Number.isNaN(Number(newLat)) ? Number(newLat) : null;
        if (newLon !== undefined) currentLon = newLon != null && newLon !== '' && !Number.isNaN(Number(newLon)) ? Number(newLon) : null;
        for (const other of linkedStates) {
          if (other && typeof other.update === 'function') {
            other.update(newLoc, newLangs, newTz, newLayout, newLat, newLon, seen);
          }
        }
      }
    };

    function makeNative(fn, name, length = 0) {
      const method = ({
        [name](...args) {
          return fn.apply(this, args);
        }
      })[name];
      try {
        Object.defineProperty(method, 'name', { value: name, writable: false, enumerable: false, configurable: true });
        Object.defineProperty(method, 'length', { value: length, writable: false, enumerable: false, configurable: true });
        customToStrings.set(method, 'function ' + name + '() { [native code] }');
      } catch (e) {}
      return method;
    }

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function patchWindow(win, isTop) {
      if (!win || (typeof win !== 'object' && typeof win !== 'function')) return;
      if (patchedWindows.has(win)) return;

      try {
        if (win.Function && win.Function.prototype && typeof win.Function.prototype.toString === 'function') {
          const otherState = win.Function.prototype.toString.call(STATE_SYM);
          if (otherState && typeof otherState.update === 'function' && otherState.customToStrings) {
            if (otherState !== internalState) {
              linkedStates.add(otherState);
              if (otherState.linkedStates) otherState.linkedStates.add(internalState);
              otherState.update(currentLocale, currentLanguages, currentTimezone, currentLayout, currentLat, currentLon);
            }
            patchedWindows.add(win);
            return;
          }
        }
      } catch (e) {}

      patchedWindows.add(win);

      // 1. Stealth Function.prototype.toString Masking (concise method: no .prototype property, strict mode unboxed Symbol)
      try {
        const FnProto = (win.Function && win.Function.prototype) || (isTop ? Function.prototype : null);
        if (FnProto && FnProto.toString) {
          const origToString = FnProto.toString;
          const stealthToString = ({
            toString() {
              'use strict';
              if (this === STATE_SYM) return internalState;
              const masked = internalState.getCustomToString(this);
              if (masked !== undefined) return masked;
              return origToString.call(this);
            }
          }).toString;
          Object.defineProperty(stealthToString, 'name', { value: 'toString', writable: false, enumerable: false, configurable: true });
          Object.defineProperty(stealthToString, 'length', { value: 0, writable: false, enumerable: false, configurable: true });
          customToStrings.set(stealthToString, 'function toString() { [native code] }');
          Object.defineProperty(FnProto, 'toString', {
            value: stealthToString,
            writable: true,
            enumerable: false,
            configurable: true,
          });
        }
      } catch (e) {}

      // 2. Spoof Navigator.prototype & WorkerNavigator.prototype language & languages
      try {
        const navInst = win.navigator || (isTop && typeof navigator !== 'undefined' ? navigator : null);
        const NavCtor =
          win.Navigator ||
          win.WorkerNavigator ||
          (isTop && typeof Navigator !== 'undefined' ? Navigator : null) ||
          (isTop && typeof WorkerNavigator !== 'undefined' ? WorkerNavigator : null);
        const navProto =
          (NavCtor && NavCtor.prototype) ||
          (navInst ? Object.getPrototypeOf(navInst) : null);

        if (navProto) {
          const origLangDesc = Object.getOwnPropertyDescriptor(navProto, 'language');
          const origLangsDesc = Object.getOwnPropertyDescriptor(navProto, 'languages');
          if (navInst) {
            try { delete navInst.language; } catch (e) {}
            try { delete navInst.languages; } catch (e) {}
          }

          const getLanguage = makeNative(function () {
            if (currentLocale) return currentLocale;
            return origLangDesc && origLangDesc.get ? origLangDesc.get.call(this) : 'en-US';
          }, 'get language', 0);

          const getLanguages = makeNative(function () {
            if (currentLanguages) return Object.freeze([...currentLanguages]);
            return origLangsDesc && origLangsDesc.get ? origLangsDesc.get.call(this) : Object.freeze(['en-US', 'en']);
          }, 'get languages', 0);

          Object.defineProperty(navProto, 'language', {
            get: getLanguage,
            set: undefined,
            enumerable: true,
            configurable: true,
          });

          Object.defineProperty(navProto, 'languages', {
            get: getLanguages,
            set: undefined,
            enumerable: true,
            configurable: true,
          });
        }
      } catch (e) {}

      // 3. Spoof Intl APIs (DateTimeFormat for Timezone + Locale, and other Intl formatters for Locale)
      const intlObj = win.Intl || (isTop && typeof Intl !== 'undefined' ? Intl : null);
      const OrigDTF = intlObj && intlObj.DateTimeFormat ? intlObj.DateTimeFormat : null;
      if (!tzFormatter && OrigDTF) {
        rebuildTzFormatter(OrigDTF);
      }

      const normalizeDTFArgs = (locales, options) => {
        const effLocales = locales !== undefined ? locales : (currentLocale || undefined);
        let effOptions = options;
        if (currentTimezone) {
          if (options === undefined) {
            effOptions = { timeZone: currentTimezone };
          } else if (options !== null && typeof options === 'object' && options.timeZone === undefined) {
            effOptions = Object.assign({}, options, { timeZone: currentTimezone });
          }
        }
        return [effLocales, effOptions];
      };

      try {
        if (intlObj) {
          if (OrigDTF && OrigDTF.prototype) {
            if (OrigDTF.prototype.resolvedOptions) {
              const origDTFResolved = OrigDTF.prototype.resolvedOptions;
              const spoofedDTFResolved = makeNative(function () {
                const res = origDTFResolved.call(this);
                if (res && typeof res === 'object') {
                  if (currentLocale && !explicitLocaleObjs.has(this)) {
                    res.locale = currentLocale;
                  }
                  if (currentTimezone && !explicitTzDTFs.has(this)) {
                    res.timeZone = currentTimezone;
                  }
                }
                return res;
              }, 'resolvedOptions', 0);
              Object.defineProperty(OrigDTF.prototype, 'resolvedOptions', {
                value: spoofedDTFResolved,
                writable: true,
                enumerable: false,
                configurable: true,
              });
            }

            const markExplicitOptions = (inst, args) => {
              if (!inst || (typeof inst !== 'object' && typeof inst !== 'function')) return;
              if (args.length > 0 && args[0] !== undefined) {
                explicitLocaleObjs.add(inst);
              }
              if (args.length > 1 && args[1] != null && typeof args[1] === 'object' && args[1].timeZone !== undefined) {
                explicitTzDTFs.add(inst);
              }
            };

            const SpoofedDTF = new Proxy(OrigDTF, {
              construct(target, args, newTarget) {
                const [l, o] = normalizeDTFArgs(args[0], args[1]);
                const actualTarget = newTarget === SpoofedDTF ? target : newTarget;
                const inst = Reflect.construct(target, [l, o], actualTarget);
                markExplicitOptions(inst, args);
                return inst;
              },
              apply(target, thisArg, args) {
                const [l, o] = normalizeDTFArgs(args[0], args[1]);
                const inst = new target(l, o);
                markExplicitOptions(inst, args);
                return inst;
              },
            });
            customToStrings.set(SpoofedDTF, 'function DateTimeFormat() { [native code] }');
            try {
              Object.defineProperty(OrigDTF.prototype, 'constructor', {
                value: SpoofedDTF,
                writable: true,
                enumerable: false,
                configurable: true,
              });
            } catch (e) {}
            try {
              Object.defineProperty(intlObj, 'DateTimeFormat', {
                value: SpoofedDTF,
                writable: true,
                enumerable: false,
                configurable: true,
              });
            } catch (e) {
              intlObj.DateTimeFormat = SpoofedDTF;
            }
          }

          ['NumberFormat', 'Collator', 'PluralRules', 'RelativeTimeFormat', 'ListFormat', 'Segmenter'].forEach((api) => {
            const OrigCtor = intlObj[api];
            if (OrigCtor && OrigCtor.prototype) {
              if (OrigCtor.prototype.resolvedOptions) {
                const origResolved = OrigCtor.prototype.resolvedOptions;
                const spoofedResolved = makeNative(function () {
                  const res = origResolved.call(this);
                  if (res && typeof res === 'object' && currentLocale && !explicitLocaleObjs.has(this)) {
                    res.locale = currentLocale;
                  }
                  return res;
                }, 'resolvedOptions', 0);
                Object.defineProperty(OrigCtor.prototype, 'resolvedOptions', {
                  value: spoofedResolved,
                  writable: true,
                  enumerable: false,
                  configurable: true,
                });
              }

              const markExplicitLocale = (inst, args) => {
                if (inst && (typeof inst === 'object' || typeof inst === 'function') && args.length > 0 && args[0] !== undefined) {
                  explicitLocaleObjs.add(inst);
                }
              };

              const SpoofedIntlCtor = new Proxy(OrigCtor, {
                construct(target, args, newTarget) {
                  const effArgs = [...args];
                  if (effArgs[0] === undefined && currentLocale) {
                    effArgs[0] = currentLocale;
                  }
                  const actualTarget = newTarget === SpoofedIntlCtor ? target : newTarget;
                  const inst = Reflect.construct(target, effArgs, actualTarget);
                  markExplicitLocale(inst, args);
                  return inst;
                },
                apply(target, thisArg, args) {
                  const effArgs = [...args];
                  if (effArgs[0] === undefined && currentLocale) {
                    effArgs[0] = currentLocale;
                  }
                  const inst = target.apply(thisArg, effArgs);
                  markExplicitLocale(inst, args);
                  return inst;
                },
              });
              customToStrings.set(SpoofedIntlCtor, 'function ' + api + '() { [native code] }');
              try {
                Object.defineProperty(OrigCtor.prototype, 'constructor', {
                  value: SpoofedIntlCtor,
                  writable: true,
                  enumerable: false,
                  configurable: true,
                });
              } catch (e) {}
              try {
                Object.defineProperty(intlObj, api, {
                  value: SpoofedIntlCtor,
                  writable: true,
                  enumerable: false,
                  configurable: true,
                });
              } catch (e) {}
            }
          });
        }
      } catch (e) {}

      // Patch Number.prototype.toLocaleString to match default spoofed locale
      try {
        const NumCtor = win.Number || (isTop && typeof Number !== 'undefined' ? Number : null);
        if (NumCtor && NumCtor.prototype && NumCtor.prototype.toLocaleString) {
          const origNumToLocale = NumCtor.prototype.toLocaleString;
          const spoofedNumToLocale = makeNative(function (locales, options) {
            const effLoc = locales !== undefined ? locales : (currentLocale || undefined);
            return origNumToLocale.call(this, effLoc, options);
          }, 'toLocaleString', 0);
          Object.defineProperty(NumCtor.prototype, 'toLocaleString', {
            value: spoofedNumToLocale,
            writable: true,
            enumerable: false,
            configurable: true,
          });
        }
      } catch (e) {}

      // 4. Spoof Date & Date.prototype for Zero-Latency Timezone Consistency
      try {
        const OrigDate = win.Date || (isTop && typeof Date !== 'undefined' ? Date : null);
        if (OrigDate && OrigDate.prototype) {
          const OrigDateProto = OrigDate.prototype;
          const origGetTime = OrigDateProto.getTime;
          const origSetTime = OrigDateProto.setTime;
          const origGetUTCMs = OrigDateProto.getUTCMilliseconds;
          const origSetUTCFullYear = OrigDateProto.setUTCFullYear;
          const origGetTimezoneOffset = OrigDateProto.getTimezoneOffset;
          const origToString = OrigDateProto.toString;
          const origToDateString = OrigDateProto.toDateString;
          const origToTimeString = OrigDateProto.toTimeString;
          const origToLocaleString = OrigDateProto.toLocaleString;
          const origToLocaleDateString = OrigDateProto.toLocaleDateString;
          const origToLocaleTimeString = OrigDateProto.toLocaleTimeString;
          const origGetFullYear = OrigDateProto.getFullYear;
          const origGetYear = OrigDateProto.getYear;
          const origGetMonth = OrigDateProto.getMonth;
          const origGetDate = OrigDateProto.getDate;
          const origGetDay = OrigDateProto.getDay;
          const origGetHours = OrigDateProto.getHours;
          const origGetMinutes = OrigDateProto.getMinutes;
          const origGetSeconds = OrigDateProto.getSeconds;
          const origSetMilliseconds = OrigDateProto.setMilliseconds;
          const origSetSeconds = OrigDateProto.setSeconds;
          const origSetMinutes = OrigDateProto.setMinutes;
          const origSetHours = OrigDateProto.setHours;
          const origSetDate = OrigDateProto.setDate;
          const origSetMonth = OrigDateProto.setMonth;
          const origSetFullYear = OrigDateProto.setFullYear;
          const origSetYear = OrigDateProto.setYear;
          const origDateParse = OrigDate.parse;

          const getZonedParts = (ms) => {
            if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) return null;
            const d = new OrigDate(ms);
            if (Number.isNaN(origGetTime.call(d))) return null;
            let parts;
            try {
              parts = tzFormatter.formatToParts(d);
            } catch (e) {
              return null;
            }
            let weekdayShort = 'Thu', monthShort = 'Jan', dayPadded = '01', yearStr = '1970';
            let hourStr = '00', minutePadded = '00', secondPadded = '00', tzName = currentTimezone;
            let era = 'AD';
            for (let i = 0; i < parts.length; i++) {
              const p = parts[i];
              const t = p.type;
              if (t === 'weekday') weekdayShort = p.value;
              else if (t === 'month') monthShort = p.value;
              else if (t === 'day') dayPadded = p.value;
              else if (t === 'year') yearStr = p.value;
              else if (t === 'hour') hourStr = p.value;
              else if (t === 'minute') minutePadded = p.value;
              else if (t === 'second') secondPadded = p.value;
              else if (t === 'timeZoneName') tzName = p.value;
              else if (t === 'era') era = p.value;
            }
            let year = +yearStr;
            if (era === 'BC' || era === 'BCE') year = 1 - year;
            const monthIndex = MONTHS.indexOf(monthShort);
            const day = +dayPadded;
            const hour = (+hourStr) % 24;
            const minute = +minutePadded;
            const second = +secondPadded;
            const msPart = origGetUTCMs.call(d);
            let utcEquiv = OrigDate.UTC(year, monthIndex, day, hour, minute, second, msPart);
            if (year >= 0 && year < 100) {
              const fixD = new OrigDate(utcEquiv);
              origSetUTCFullYear.call(fixD, year);
              utcEquiv = origGetTime.call(fixD);
            }
            const offsetMin = Math.round((ms - utcEquiv) / 60000);
            return {
              year,
              monthIndex,
              day,
              hour,
              minute,
              second,
              weekdayShort,
              weekdayIndex: DAYS.indexOf(weekdayShort),
              monthShort,
              dayPadded,
              hourPadded: String(hour).padStart(2, '0'),
              minutePadded,
              secondPadded,
              offsetMin: offsetMin === 0 ? 0 : offsetMin,
              tzName,
            };
          };

          const localFieldsToMs = (year, month, day, hour, minute, second, msPart) => {
            if (
              Number.isNaN(year) ||
              Number.isNaN(month) ||
              Number.isNaN(day) ||
              Number.isNaN(hour) ||
              Number.isNaN(minute) ||
              Number.isNaN(second) ||
              Number.isNaN(msPart)
            ) {
              return NaN;
            }
            let rawUtc = OrigDate.UTC(year, month, day, hour, minute, second, msPart);
            const yrInt = Math.trunc(year);
            if (yrInt >= 0 && yrInt < 100) {
              const fixD = new OrigDate(rawUtc);
              origSetUTCFullYear.call(fixD, yrInt);
              rawUtc = origGetTime.call(fixD);
            }
            if (Number.isNaN(rawUtc)) return NaN;
            const zp1 = getZonedParts(rawUtc);
            if (!zp1) return NaN;
            const guessMs = rawUtc + zp1.offsetMin * 60000;
            const zp2 = getZonedParts(guessMs);
            return rawUtc + (zp2 ? zp2.offsetMin : zp1.offsetMin) * 60000;
          };

          const defineDateProtoMethod = (name, length, fn) => {
            const wrapped = makeNative(fn, name, length);
            Object.defineProperty(OrigDateProto, name, {
              value: wrapped,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          };

          defineDateProtoMethod('getTimezoneOffset', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.offsetMin : origGetTimezoneOffset.call(this);
          });

          defineDateProtoMethod('toDateString', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return 'Invalid Date';
            const zp = getZonedParts(ms);
            if (!zp) return origToDateString.call(this);
            const yStr = zp.year < 0 ? '-' + String(-zp.year).padStart(4, '0') : String(zp.year).padStart(4, '0');
            return zp.weekdayShort + ' ' + zp.monthShort + ' ' + zp.dayPadded + ' ' + yStr;
          });

          defineDateProtoMethod('toTimeString', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return 'Invalid Date';
            const zp = getZonedParts(ms);
            if (!zp) return origToTimeString.call(this);
            const totalAhead = -zp.offsetMin;
            const sign = totalAhead >= 0 ? '+' : '-';
            const absMin = Math.abs(totalAhead);
            const offH = String(Math.floor(absMin / 60)).padStart(2, '0');
            const offM = String(absMin % 60).padStart(2, '0');
            return zp.hourPadded + ':' + zp.minutePadded + ':' + zp.secondPadded + ' GMT' + sign + offH + offM + ' (' + zp.tzName + ')';
          });

          defineDateProtoMethod('toString', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return 'Invalid Date';
            const zp = getZonedParts(ms);
            if (!zp) return origToString.call(this);
            const yStr = zp.year < 0 ? '-' + String(-zp.year).padStart(4, '0') : String(zp.year).padStart(4, '0');
            const totalAhead = -zp.offsetMin;
            const sign = totalAhead >= 0 ? '+' : '-';
            const absMin = Math.abs(totalAhead);
            const offH = String(Math.floor(absMin / 60)).padStart(2, '0');
            const offM = String(absMin % 60).padStart(2, '0');
            return zp.weekdayShort + ' ' + zp.monthShort + ' ' + zp.dayPadded + ' ' + yStr + ' ' + zp.hourPadded + ':' + zp.minutePadded + ':' + zp.secondPadded + ' GMT' + sign + offH + offM + ' (' + zp.tzName + ')';
          });

          defineDateProtoMethod('getFullYear', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.year : origGetFullYear.call(this);
          });

          if (origGetYear) {
            defineDateProtoMethod('getYear', 0, function () {
              const ms = origGetTime.call(this);
              if (Number.isNaN(ms)) return NaN;
              const zp = getZonedParts(ms);
              return zp ? zp.year - 1900 : origGetYear.call(this);
            });
          }

          defineDateProtoMethod('getMonth', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.monthIndex : origGetMonth.call(this);
          });

          defineDateProtoMethod('getDate', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.day : origGetDate.call(this);
          });

          defineDateProtoMethod('getDay', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.weekdayIndex : origGetDay.call(this);
          });

          defineDateProtoMethod('getHours', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.hour : origGetHours.call(this);
          });

          defineDateProtoMethod('getMinutes', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.minute : origGetMinutes.call(this);
          });

          defineDateProtoMethod('getSeconds', 0, function () {
            const ms = origGetTime.call(this);
            if (Number.isNaN(ms)) return NaN;
            const zp = getZonedParts(ms);
            return zp ? zp.second : origGetSeconds.call(this);
          });

          if (origSetMilliseconds) {
            defineDateProtoMethod('setMilliseconds', 1, function (msVal) {
              const ms = origGetTime.call(this);
              const m = Number(msVal);
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetMilliseconds.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetMilliseconds.apply(this, arguments);
              return origSetTime.call(this, localFieldsToMs(zp.year, zp.monthIndex, zp.day, zp.hour, zp.minute, zp.second, m));
            });
          }

          if (origSetSeconds) {
            defineDateProtoMethod('setSeconds', 2, function (sec, msVal) {
              const ms = origGetTime.call(this);
              const s = Number(sec);
              const m = arguments.length > 1 ? Number(msVal) : origGetUTCMs.call(this);
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetSeconds.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetSeconds.apply(this, arguments);
              return origSetTime.call(this, localFieldsToMs(zp.year, zp.monthIndex, zp.day, zp.hour, zp.minute, s, m));
            });
          }

          if (origSetMinutes) {
            defineDateProtoMethod('setMinutes', 3, function (min, sec, msVal) {
              const ms = origGetTime.call(this);
              const mn = Number(min);
              const s = arguments.length > 1 ? Number(sec) : undefined;
              const m = arguments.length > 2 ? Number(msVal) : undefined;
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetMinutes.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetMinutes.apply(this, arguments);
              return origSetTime.call(
                this,
                localFieldsToMs(
                  zp.year,
                  zp.monthIndex,
                  zp.day,
                  zp.hour,
                  mn,
                  arguments.length > 1 ? s : zp.second,
                  arguments.length > 2 ? m : origGetUTCMs.call(this)
                )
              );
            });
          }

          if (origSetHours) {
            defineDateProtoMethod('setHours', 4, function (hour, min, sec, msVal) {
              const ms = origGetTime.call(this);
              const h = Number(hour);
              const mn = arguments.length > 1 ? Number(min) : undefined;
              const s = arguments.length > 2 ? Number(sec) : undefined;
              const m = arguments.length > 3 ? Number(msVal) : undefined;
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetHours.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetHours.apply(this, arguments);
              return origSetTime.call(
                this,
                localFieldsToMs(
                  zp.year,
                  zp.monthIndex,
                  zp.day,
                  h,
                  arguments.length > 1 ? mn : zp.minute,
                  arguments.length > 2 ? s : zp.second,
                  arguments.length > 3 ? m : origGetUTCMs.call(this)
                )
              );
            });
          }

          if (origSetDate) {
            defineDateProtoMethod('setDate', 1, function (dateVal) {
              const ms = origGetTime.call(this);
              const dt = Number(dateVal);
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetDate.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetDate.apply(this, arguments);
              return origSetTime.call(this, localFieldsToMs(zp.year, zp.monthIndex, dt, zp.hour, zp.minute, zp.second, origGetUTCMs.call(this)));
            });
          }

          if (origSetMonth) {
            defineDateProtoMethod('setMonth', 2, function (monthVal, dateVal) {
              const ms = origGetTime.call(this);
              const mo = Number(monthVal);
              const dt = arguments.length > 1 ? Number(dateVal) : undefined;
              if (!currentTimezone || !tzFormatter || Number.isNaN(ms)) {
                return origSetMonth.apply(this, arguments);
              }
              const zp = getZonedParts(ms);
              if (!zp) return origSetMonth.apply(this, arguments);
              return origSetTime.call(
                this,
                localFieldsToMs(zp.year, mo, arguments.length > 1 ? dt : zp.day, zp.hour, zp.minute, zp.second, origGetUTCMs.call(this))
              );
            });
          }

          if (origSetFullYear) {
            defineDateProtoMethod('setFullYear', 3, function (yearVal, monthVal, dateVal) {
              const ms = origGetTime.call(this);
              const yr = Number(yearVal);
              const mo = arguments.length > 1 ? Number(monthVal) : undefined;
              const dt = arguments.length > 2 ? Number(dateVal) : undefined;
              if (!currentTimezone || !tzFormatter) {
                return origSetFullYear.apply(this, arguments);
              }
              const zp = Number.isNaN(ms) ? { monthIndex: 0, day: 1, hour: 0, minute: 0, second: 0 } : getZonedParts(ms);
              if (!zp) return origSetFullYear.apply(this, arguments);
              const msPart = Number.isNaN(ms) ? 0 : origGetUTCMs.call(this);
              return origSetTime.call(
                this,
                localFieldsToMs(
                  yr,
                  arguments.length > 1 ? mo : zp.monthIndex,
                  arguments.length > 2 ? dt : zp.day,
                  zp.hour,
                  zp.minute,
                  zp.second,
                  msPart
                )
              );
            });
          }

          if (origSetYear) {
            defineDateProtoMethod('setYear', 1, function (yearVal) {
              const ms = origGetTime.call(this);
              const yNum = Number(yearVal);
              if (!currentTimezone || !tzFormatter) {
                return origSetYear.apply(this, arguments);
              }
              if (Number.isNaN(yNum)) return origSetTime.call(this, NaN);
              const yrTrunc = Math.trunc(yNum);
              const fullYr = yrTrunc >= 0 && yrTrunc <= 99 ? 1900 + yrTrunc : yNum;
              const zp = Number.isNaN(ms) ? { monthIndex: 0, day: 1, hour: 0, minute: 0, second: 0 } : getZonedParts(ms);
              if (!zp) return origSetYear.apply(this, arguments);
              const msPart = Number.isNaN(ms) ? 0 : origGetUTCMs.call(this);
              return origSetTime.call(this, localFieldsToMs(fullYr, zp.monthIndex, zp.day, zp.hour, zp.minute, zp.second, msPart));
            });
          }

          if (origToLocaleString) {
            defineDateProtoMethod('toLocaleString', 0, function (locales, options) {
              const [l, o] = normalizeDTFArgs(locales, options);
              return origToLocaleString.call(this, l, o);
            });
          }
          if (origToLocaleDateString) {
            defineDateProtoMethod('toLocaleDateString', 0, function (locales, options) {
              const [l, o] = normalizeDTFArgs(locales, options);
              return origToLocaleDateString.call(this, l, o);
            });
          }
          if (origToLocaleTimeString) {
            defineDateProtoMethod('toLocaleTimeString', 0, function (locales, options) {
              const [l, o] = normalizeDTFArgs(locales, options);
              return origToLocaleTimeString.call(this, l, o);
            });
          }

          const hasExplicitZoneInString = (s) =>
            /[zZ]$|[+-]\d{2}:?\d{2}(?::?\d{2}(?:\.\d+)?)?$|\b(?:GMT|UTC)\b|^(?:\d{4}|[+-]\d{6})(?:-\d{2}(?:-\d{2})?)?$/.test(s.trim());

          const adjustParsedMs = (str) => {
            const rawMs = origDateParse.call(OrigDate, str);
            if (Number.isNaN(rawMs) || !currentTimezone || !tzFormatter || typeof str !== 'string' || hasExplicitZoneInString(str)) {
              return rawMs;
            }
            const hostOff = origGetTimezoneOffset.call(new OrigDate(rawMs));
            const zp1 = getZonedParts(rawMs);
            if (!zp1) return rawMs;
            const guessMs = rawMs + (zp1.offsetMin - hostOff) * 60000;
            const zp2 = getZonedParts(guessMs);
            return rawMs + ((zp2 ? zp2.offsetMin : zp1.offsetMin) - hostOff) * 60000;
          };

          const spoofedParse = makeNative(function (str) {
            return adjustParsedMs(String(str));
          }, 'parse', 1);

          Object.defineProperty(OrigDate, 'parse', {
            value: spoofedParse,
            writable: true,
            enumerable: false,
            configurable: true,
          });

          const SpoofedDate = new Proxy(OrigDate, {
            construct(target, args, newTarget) {
              const actualTarget = newTarget === SpoofedDate ? target : newTarget;
              if (!currentTimezone || !tzFormatter || args.length === 0) {
                return Reflect.construct(target, args, actualTarget);
              }
              if (args.length === 1) {
                const a0 = args[0];
                if (typeof a0 === 'string') {
                  return Reflect.construct(target, [adjustParsedMs(a0)], actualTarget);
                }
                return Reflect.construct(target, args, actualTarget);
              }
              const rawUtc = target.UTC(...args);
              if (Number.isNaN(rawUtc)) {
                return Reflect.construct(target, [NaN], actualTarget);
              }
              const zp1 = getZonedParts(rawUtc);
              if (!zp1) {
                return Reflect.construct(target, args, actualTarget);
              }
              const guessMs = rawUtc + zp1.offsetMin * 60000;
              const zp2 = getZonedParts(guessMs);
              const exactMs = rawUtc + (zp2 ? zp2.offsetMin : zp1.offsetMin) * 60000;
              return Reflect.construct(target, [exactMs], actualTarget);
            },
            apply(target) {
              return OrigDateProto.toString.call(new target());
            },
          });

          customToStrings.set(SpoofedDate, 'function Date() { [native code] }');
          try {
            Object.defineProperty(OrigDateProto, 'constructor', {
              value: SpoofedDate,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          } catch (e) {}
          try {
            Object.defineProperty(win, 'Date', {
              value: SpoofedDate,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          } catch (e) {}
        }
      } catch (e) {}

      // 5. Spoof Temporal.Now.timeZoneId if present
      try {
        if (win.Temporal && win.Temporal.Now && typeof win.Temporal.Now.timeZoneId === 'function') {
          const origTzId = win.Temporal.Now.timeZoneId;
          const spoofedTzId = makeNative(function () {
            return currentTimezone || origTzId.call(this);
          }, 'timeZoneId', 0);
          Object.defineProperty(win.Temporal.Now, 'timeZoneId', {
            value: spoofedTzId,
            writable: true,
            enumerable: false,
            configurable: true,
          });
        }
      } catch (e) {}

      // 6. Spoof KeyboardLayoutMap & navigator.keyboard.getLayoutMap
      try {
        let LayoutMapClass =
          win.KeyboardLayoutMap ||
          (isTop && typeof KeyboardLayoutMap !== 'undefined' ? KeyboardLayoutMap : null);

        if (!LayoutMapClass) {
          LayoutMapClass = class KeyboardLayoutMap {
            constructor() {
              throw new TypeError('Illegal constructor');
            }
          };
          LayoutMapClass.prototype[Symbol.toStringTag] = 'KeyboardLayoutMap';
          try {
            Object.defineProperty(win, 'KeyboardLayoutMap', {
              value: LayoutMapClass,
              writable: true,
              configurable: true,
            });
          } catch (e) {}
        }

        if (LayoutMapClass && LayoutMapClass.prototype) {
          const proto = LayoutMapClass.prototype;
          const origGet = proto.get;
          const origHas = proto.has;

          proto.get = makeNative(function (code) {
            if (spoofedInstances.has(this)) {
              return currentSpoofedMapData.get(code);
            }
            return origGet ? origGet.call(this, code) : undefined;
          }, 'get', 1);

          proto.has = makeNative(function (code) {
            if (spoofedInstances.has(this)) {
              return currentSpoofedMapData.has(code);
            }
            return origHas ? origHas.call(this, code) : false;
          }, 'has', 1);

          Object.defineProperty(proto, 'size', {
            get: makeNative(function () {
              if (spoofedInstances.has(this)) return currentSpoofedMapData.size;
              return 0;
            }, 'get size', 0),
            configurable: true,
            enumerable: true,
          });

          proto.keys = makeNative(function () {
            if (spoofedInstances.has(this)) return currentSpoofedMapData.keys();
            return (new Map()).keys();
          }, 'keys', 0);

          proto.values = makeNative(function () {
            if (spoofedInstances.has(this)) return currentSpoofedMapData.values();
            return (new Map()).values();
          }, 'values', 0);

          const entriesFn = makeNative(function () {
            if (spoofedInstances.has(this)) return currentSpoofedMapData.entries();
            return (new Map()).entries();
          }, 'entries', 0);

          proto.entries = entriesFn;
          proto[Symbol.iterator] = entriesFn;

          proto.forEach = makeNative(function (cb, thisArg) {
            if (spoofedInstances.has(this)) {
              currentSpoofedMapData.forEach((val, key) => cb.call(thisArg, val, key, this));
            }
          }, 'forEach', 1);
        }

        const createLayoutMapInstance = () => {
          const inst = Object.create(LayoutMapClass.prototype);
          spoofedInstances.set(inst, true);
          return inst;
        };

        const navInst = win.navigator || (isTop && typeof navigator !== 'undefined' ? navigator : null);
        if (navInst && navInst.keyboard) {
          const spoofedGetLayoutMap = makeNative(function () {
            return Promise.resolve(createLayoutMapInstance());
          }, 'getLayoutMap', 0);

          const keyboardProto =
            (win.Keyboard && win.Keyboard.prototype) ||
            Object.getPrototypeOf(navInst.keyboard);

          if (keyboardProto && keyboardProto.getLayoutMap) {
            keyboardProto.getLayoutMap = spoofedGetLayoutMap;
          }

          Object.defineProperty(navInst.keyboard, 'getLayoutMap', {
            value: spoofedGetLayoutMap,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        }
      } catch (e) {}

      // 7. Spoof Geolocation callbacks when coordinates are active
      try {
        const navInst = win.navigator || (isTop && typeof navigator !== 'undefined' ? navigator : null);
        if (navInst && navInst.geolocation) {
          const geoProto = Object.getPrototypeOf(navInst.geolocation);
          if (geoProto) {
            ['getCurrentPosition', 'watchPosition'].forEach((methodName) => {
              const origMethod = geoProto[methodName];
              if (typeof origMethod === 'function') {
                const spoofedGeoMethod = makeNative(function (success, error, options) {
                  if (typeof success !== 'function' || currentLat == null || currentLon == null) {
                    return origMethod.apply(this, arguments);
                  }
                  const wrappedSuccess = (pos) => {
                    try {
                      if (pos && pos.coords) {
                        const patchCoord = (target) => {
                          Object.defineProperty(target, 'latitude', { value: currentLat, configurable: true, enumerable: true });
                          Object.defineProperty(target, 'longitude', { value: currentLon, configurable: true, enumerable: true });
                          Object.defineProperty(target, 'accuracy', { value: 20, configurable: true, enumerable: true });
                        };
                        patchCoord(pos.coords);
                      }
                    } catch (e) {}
                    return success(pos);
                  };
                  return origMethod.call(this, wrappedSuccess, error, options);
                }, methodName, origMethod.length || 1);
                Object.defineProperty(geoProto, methodName, {
                  value: spoofedGeoMethod,
                  writable: true,
                  enumerable: true,
                  configurable: true,
                });
              }
            });
          }
        }
      } catch (e) {}

      // 8. Synchronously patch same-origin iframes upon contentWindow / contentDocument access
      try {
        const IFrameCtor = win.HTMLIFrameElement || (isTop && typeof HTMLIFrameElement !== 'undefined' ? HTMLIFrameElement : null);
        if (IFrameCtor && IFrameCtor.prototype) {
          const cwDesc = Object.getOwnPropertyDescriptor(IFrameCtor.prototype, 'contentWindow');
          if (cwDesc && cwDesc.get) {
            const origGetCw = cwDesc.get;
            const spoofedGetCw = makeNative(function () {
              const cw = origGetCw.call(this);
              try {
                if (cw) patchWindow(cw, false);
              } catch (e) {}
              return cw;
            }, 'get contentWindow', 0);
            Object.defineProperty(IFrameCtor.prototype, 'contentWindow', {
              get: spoofedGetCw,
              set: cwDesc.set,
              enumerable: cwDesc.enumerable,
              configurable: cwDesc.configurable,
            });
          }
          const cdDesc = Object.getOwnPropertyDescriptor(IFrameCtor.prototype, 'contentDocument');
          if (cdDesc && cdDesc.get) {
            const origGetCd = cdDesc.get;
            const spoofedGetCd = makeNative(function () {
              const cd = origGetCd.call(this);
              try {
                if (cd && cd.defaultView) patchWindow(cd.defaultView, false);
              } catch (e) {}
              return cd;
            }, 'get contentDocument', 0);
            Object.defineProperty(IFrameCtor.prototype, 'contentDocument', {
              get: spoofedGetCd,
              set: cdDesc.set,
              enumerable: cdDesc.enumerable,
              configurable: cdDesc.configurable,
            });
          }
        }
      } catch (e) {}

      // 9. Zero-Latency Web Worker & SharedWorker Bootstrap Pre-Shield (for inline blob: & data: workers spawned at 0.00ms)
      try {
        const OrigBlob = win.Blob || (isTop && typeof Blob !== 'undefined' ? Blob : null);
        const OrigURL = win.URL || (isTop && typeof URL !== 'undefined' ? URL : null);
        const origCreateObjectURL = OrigURL && typeof OrigURL.createObjectURL === 'function' ? OrigURL.createObjectURL : null;

        if (OrigBlob && OrigURL && origCreateObjectURL) {
          const SpoofedBlob = new Proxy(OrigBlob, {
            construct(target, args, newTarget) {
              const actualTarget = newTarget === SpoofedBlob ? target : newTarget;
              const inst = Reflect.construct(target, args, actualTarget);
              try {
                if (Array.isArray(args[0])) {
                  blobPartsMap.set(inst, { parts: args[0], options: args[1] });
                }
              } catch (e) {}
              return inst;
            }
          });
          customToStrings.set(SpoofedBlob, 'function Blob() { [native code] }');
          try {
            Object.defineProperty(OrigBlob.prototype, 'constructor', {
              value: SpoofedBlob,
              writable: true,
              enumerable: false,
              configurable: true,
            });
            Object.defineProperty(win, 'Blob', {
              value: SpoofedBlob,
              writable: true,
              enumerable: false,
              configurable: true,
            });
          } catch (e) {}

          const spoofedCreateObjectURL = makeNative(function (obj) {
            const url = origCreateObjectURL.apply(this, arguments);
            try {
              if (obj && typeof url === 'string' && blobPartsMap.has(obj)) {
                blobUrlMap.set(url, obj);
              }
            } catch (e) {}
            return url;
          }, 'createObjectURL', 1);
          Object.defineProperty(OrigURL, 'createObjectURL', {
            value: spoofedCreateObjectURL,
            writable: true,
            enumerable: true,
            configurable: true,
          });

          const buildWorkerBootstrap = () =>
            ';(' +
            applyCloaqSpoof.toString() +
            ')(' +
            JSON.stringify(currentLocale) +
            ',' +
            JSON.stringify(currentTimezone) +
            ',null,' +
            JSON.stringify(currentLat) +
            ',' +
            JSON.stringify(currentLon) +
            ');\n';

          const rewriteWorkerScriptUrl = (rawUrl, options) => {
            if (!currentTimezone && !currentLocale && currentLat == null && currentLon == null) {
              return rawUrl;
            }
            const urlStr = String(rawUrl);
            const isModule = options && typeof options === 'object' && options.type === 'module';
            const bootstrap = buildWorkerBootstrap();
            const trackedBlob = blobUrlMap.get(urlStr);
            if (trackedBlob && blobPartsMap.has(trackedBlob)) {
              const entry = blobPartsMap.get(trackedBlob);
              const patchedBlob = new OrigBlob([bootstrap, ...entry.parts], entry.options || { type: 'application/javascript' });
              return origCreateObjectURL.call(OrigURL, patchedBlob);
            }
            if (!isModule && (urlStr.startsWith('blob:') || urlStr.startsWith('data:'))) {
              const patchedBlob = new OrigBlob(
                [bootstrap + 'importScripts(' + JSON.stringify(urlStr) + ');\n'],
                { type: 'application/javascript' }
              );
              return origCreateObjectURL.call(OrigURL, patchedBlob);
            }
            return rawUrl;
          };

          ['Worker', 'SharedWorker'].forEach((workerCtorName) => {
            const OrigWorkerCtor = win[workerCtorName] || (isTop && typeof globalThis[workerCtorName] === 'function' ? globalThis[workerCtorName] : null);
            if (OrigWorkerCtor && OrigWorkerCtor.prototype) {
              const SpoofedWorkerCtor = new Proxy(OrigWorkerCtor, {
                construct(target, args, newTarget) {
                  const actualTarget = newTarget === SpoofedWorkerCtor ? target : newTarget;
                  if (args.length > 0 && args[0] != null) {
                    try {
                      const rewritten = rewriteWorkerScriptUrl(args[0], args[1]);
                      const nextArgs = [...args];
                      nextArgs[0] = rewritten;
                      return Reflect.construct(target, nextArgs, actualTarget);
                    } catch (e) {}
                  }
                  return Reflect.construct(target, args, actualTarget);
                }
              });
              customToStrings.set(SpoofedWorkerCtor, 'function ' + workerCtorName + '() { [native code] }');
              try {
                Object.defineProperty(OrigWorkerCtor.prototype, 'constructor', {
                  value: SpoofedWorkerCtor,
                  writable: true,
                  enumerable: false,
                  configurable: true,
                });
                Object.defineProperty(win, workerCtorName, {
                  value: SpoofedWorkerCtor,
                  writable: true,
                  enumerable: false,
                  configurable: true,
                });
              } catch (e) {}
            }
          });
        }
      } catch (e) {}
    }

    patchWindow(rootWin, true);
  } catch (err) {}
}

    applyCloaqSpoof(locale, timezone, layout, lat, lon);
  } catch (e) {}
})();
