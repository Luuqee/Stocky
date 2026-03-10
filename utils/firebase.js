const admin = require('firebase-admin');

function getDb() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "stocky-bot-5a9f8",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "61a583fe79730ce9095cf208f538ab1d06aa7215",
        private_key: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrtzRc4/Sp7J1c\n3B5qH56qQmbQVpyFDUN012lUAOUWGKPG2UTUoeAzB6JR4MRBeKD96EDi+nOZ8jui\nnSnggMdrjiv0xCPGwIVtldIKTjKrhDKoxQQxRJ748WXdJ8SG/DI27J8clDr971V9\nFu87QBdVzt+5QNRbzYEO8j7xRvXXuB3taKzB/NbuuuyGtqJl30JUbZfmg3tXnlBI\nhnwl+x48a5SQq8I6+INQEUsp9aCoUtpmZR3dlTpdL6Af4O1oeh3KxAEcGa7lXjJn\naNWP6JUrPHgw8crnLmhHNvjzO76SQTtqwPVtQXLM9Ykv9ymh9IO/Nc0blncmihZW\nyHzLmaChAgMBAAECggEAAX+WYoKfN43f5CfsEIVA3U+5xbLhyAPw/R+llMTyus4B\nfNpXwEq+0fcsto3xbHhU4E5S5aAlmtfrJwy7yTCafODnV4oQHVt/9pA2fl5HESnU\nxtX8RsFIaVfy6Xp/u6VO+112eHl/J8jbPD2TXhcdtQMafut2xuvMxuB8hd62hbi7\nB4o0ZK+g7IEXjI42ZdCD9Ird21vdJS4NfRkG8Pdgos3+yjpotmvMjcJgCMKvSNgI\nivUtYKzdknnXXUBnGTUGm4XCdKNtSCXTaEqTWtSIPRgHV6je9FySCrV2orCwYGL+\n3sW0Ro2Xg7XGwqcrBTYpr/k5WtTOwT9vToxr+cZlAQKBgQDiq9ndQx52T13hv+8e\ngJdypNdEED7ujEH5376x9LYyOm7C3Y3ZLAC/JZhwpdf4JaakKz8ZqJYNC6LuUPqt\n+iHLW1diSlqxsEqJkf1jjktz295OaILmHr3u8J0WK/4covE2AvrJoVCHGXVGsxyX\njoO2QtjMFFSKComGuUe6czjqYQKBgQDB7weJxFtHU6XC6yVRooHw5eN69h64waXJ\n5ETVqpuNaoLZGQk7q4c/2/D45UUWVv8T7w+1Jp58WAX3p/I7zPeoFSub5jkCbw4m\nrtFGvQGKc5BUHQ40wJgiXn0VA6PkCpCJHlN+xsvnQeQ1/C+25KKX0ZGDC8XxyO8i\nVxBGtKbeQQKBgQDUcFe5xaQRIgVNBMOpBL/sFI4kHk286PsUoxxoUH9Jx/Xy8A53\nkYQJocSjHuuwiCkMB/QVqiknhNZpIMAwuhNeMfdOCX3CtwTEtmyTF9OjfFd3iP/V\niM5d2GiBVS3NzPDgvB4rRuLgG34MiuWrLUhIU5I4gn1Q+ts1xwRwvHiFQQKBgQCE\nlCdgHHeWXG3uwhiCJYmVqWOJVSaNgf0X91DDjV3IIK+RQRdZzpqoonCrhvljG1hI\nRV9EpUElmnuB4jOshCQuqUJl0s7YhhlzgoGZTW73OqfJiQ+EKsIWhOgX7KQnKr3C\nr5O/EKKm1xnvehcYfldVWLSUlQDemVI59LEw1SFawQKBgCk7sBfKfZmuCnazuW6P\nBCQXWWNRNHLxrswdXrPMwe3U2Br914WOOnO4M7dUC8JwNQc7JoOyFO2GL8kzkRLF\nwrck229xW8LtmBU7YbdvZqqOa0itDV1ymGXZK9P1cdZ7W0oAcKOsudTH3fuchH5F\nKbHerHIdhS4Tf/5LYyX5P2ex\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@stocky-bot-5a9f8.iam.gserviceaccount.com",
        client_id: "112123633317847470350",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
      })
    });
  }
  return admin.firestore();
}

module.exports = { getDb };