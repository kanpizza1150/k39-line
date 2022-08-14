const functions = require("firebase-functions")
const region = "asia-southeast1"

const axios = require("axios")

//LINE
const LINE_MESSAGING_API = "https://api.line.me/v2/bot"
const LINE_ACCESS_TOKEN = `GHgoVyrQaUVzwSmvhdbMJf8MhAjJBwdAR7WdYXNAMXZ6wuHihwZzJ9KoQ1j/PrWNErU6aEgYphY602jFlcaLI1BmUlCd2hQPIrRWv/LxiOkaXw5CWSEOqZ7wtet5lWq7QJrNUrf7mnex4eMac3RTJwdB04t89/1O/w1cDnyilFU=`
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
}

exports.LineBot = functions.region(region).https.onRequest((request: any, response: any) => {
  const user = getUser()
  console.log("user", user)
  if (request.method === "POST") {
    console.log("request.body.events[0]", request.body.events[0])
    const isGroup = checkIfGroup(request.body.events[0].source)
    console.log("isGroup", isGroup)
    const messageType = request.body.events[0].message.type
    if (messageType == "text") {
      const textMessage = request.body.events[0].message.text
      reply(request.body.events[0].replyToken, { type: "text", text: "Reply:" + textMessage })
    }
  }
  return response.status(200).send(request.method)
})

exports.LineBroadcast = functions.region(region).https.onRequest((request: any, response: any) => {
  broadcast({ type: "text", text: "Sawatdee" })
})

const checkIfGroup = (source: { groupId?: string }) => {
  return !!source?.groupId
}
const reply = (token: any, payload: any) => {
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: token,
      messages: [payload],
    }),
  })
}

const broadcast = (payload: any) => {
  return axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/broadcast`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      // replyToken: token,
      // messages: [payload],
      messages: [payload],
    }),
  })
}
