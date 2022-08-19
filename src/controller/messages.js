const messagesModel = require('../models/messages')
const commonHelper = require('../helper/response')
const moment = require('moment')
moment.locale('id') 
// eslint-disable-next-line no-unused-vars
const getMessage=async(req, res, next)=>{
    const receiver_id = req.params.receiver_id
    const sender_id =req.decoded.id
    const {rows} = await messagesModel.getMessage(sender_id, receiver_id)
    console.log("rows =>",rows)
    const data = rows.map((item)=>{
        const datas ={
            chatid: item.id,
            date: moment(item.created_at).format('LT'),
            message: item.message,
            receiver_id: item.receiver_id,
            sender_id: item.sender_id
        }
        console.log("datas =>",datas)
        return datas
        
    })
    commonHelper.response(res, data, 200)
}

module.exports = {
    getMessage
}