import moment from "moment";

const webhookUrl = process.env.WEBHOOK_URL;
const spreadSheetId = process.env.SPREAD_SHEET_ID;
const sheetName = process.env.SHEET_NAME;

const CONSTANTS = (() => {
  if (!webhookUrl || !spreadSheetId || !sheetName) {
    throw new Error("no env");
  }

  return {
    webhookUrl,
    spreadSheetId,
    sheetName,
    lastcheckedTimestampIndex: 0
  };
})();

/***************************************
 * Slackに投稿させる内容を作る
 ***************************************/
const sendHttpPostForSlack = (message: string): void => {
  const jsonData = {
    text: message,
    unfurl_links: true
  };
  const payload = JSON.stringify(jsonData);
  const options: {
    method: "post" | "put" | "get" | "patch" | "delete";
    contentType: string;
    payload: string;
  } = {
    method: "post",
    contentType: "application/json",
    payload
  };

  UrlFetchApp.fetch(CONSTANTS.webhookUrl, options);
};

/***************************************
 * Slackに投稿
 ***************************************/
const postToSlack = (message: string): void => {
  sendHttpPostForSlack(message); // Post
};

const getSheet = () =>
  SpreadsheetApp.openById(CONSTANTS.spreadSheetId).getSheetByName(
    CONSTANTS.sheetName
  );

const getLastCheckedTimestamp = () => {
  const sheet = getSheet();
  if (!sheet) {
    return;
  }

  const data = sheet.getDataRange().getValues();

  return data[CONSTANTS.lastcheckedTimestampIndex][0];
};

const searchMail = (): void => {
  const threads: {
    getLastMessageDate: () => Date;
    getMessages: () => { getSubject: () => string; getBody: () => string }[];
  }[] = GmailApp.search("label:connpass", 0, 20);
  const lastCheckedTimestamp = moment(getLastCheckedTimestamp());

  threads.forEach((thread): void => {
    const recievedDate = thread.getLastMessageDate();
    const targetTimestamp = moment(recievedDate);

    if (!targetTimestamp.isAfter(lastCheckedTimestamp)) {
      return;
    }

    const messages = thread.getMessages();
    const message = messages[0];
    const subject = message.getSubject();
    const body = message.getBody();

    const url = body.match(
      /<a href="https:\/\/.+\.connpass\.com\/event\/.+\/.+utm_content=detail_btn"/
    );
    if (!url) {
      return;
    }

    const newUrl = url[0].substring(
      '<a href="'.length,
      url[0].lastIndexOf("/") + 1
    );

    const msg = "*" + subject + "* \n" + newUrl;
    postToSlack(msg);
  });
};

const setLastCheckedTimestamp = (timestamp: moment.Moment): void => {
  const sheet = getSheet();
  if (!sheet) {
    return;
  }
  sheet.getRange(1, 1).setValue(timestamp.format("YYYY/MM/DD HH:mm"));
};

const doCheck = () => {
  searchMail();
  setLastCheckedTimestamp(moment());
};

export const timer = (): void => {
  doCheck();
};
