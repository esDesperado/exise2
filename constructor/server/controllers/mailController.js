const fs = require('fs');
const uuid = require('uuid')
const path = require('path')
const db = require('../models/models')
const {Interfaces,Stats} = require('../models/models')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const ApiError = require('../error/ApiError')
const axios = require("axios");
const FormData = require('form-data');

class MailController{
    async order(req,res,next) {
        try {
            let {name, phone, price, priceList, delivery, address} = req.body
            let transporter = await nodemailer.createTransport({
                host:'smtp.mail.ru',
                port:2525,
                secure:false,
                auth:{
                    user:'wellsites@mail.ru',
                    pass:'epCdhwax6PA9sZtnHabr'
                },
            })
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            let orderId = Math.floor(getRandomArbitrary(1, 9999));



            const username = 'r-stroidiskont_com-api';
            const password = 'Stroy_api9173';
            const gateway_url = 'https://payment.alfabank.ru/payment/rest/';
            const return_url = 'https://stroidiskont.com?payment=success';

            async function gateway(method, data) {
                let formUrl = "";
                await axios({
                    method:'post',
                    url: gateway_url + method,
                    params: data
                })
                .then(function(resp) {
                    console.log('Ответ сервера успешно получен!');
                    console.log(resp.data);
                    //axios.post('https://webhook.site/bd488383-1ba8-4136-b6bb-c12609fc6f58', resp.data);
                    const mailOptions ={
                        from:'wellsites@mail.ru',
                        to:'stroidiskont21@mail.ru',
                        subject:'Новый заказ',
                        html:`<div style="color:black;font-size:1.2em;backgroundColor:white;">
                        <div style="text-align:center"><h3>Новый заказ.</h3><div>
                        Имя заказчика: <b>${name}</b>,<br/>
                        Номер: <b>${phone}</b><br/>
                        <div><br/>Выбранные товары: <br/>${priceList}</div>
                        <div><br/>Сумма без учёта доставки: <b>${price} рублей</b></div>
                        <div><br/>Способ получения: <b>${delivery}</b></div>
                        ${delivery === 'Доставка' ? '<div><br/>Адрес доставки: <b>' + address + '</b></div>' : ''}
                        <div><br/>Номер заказа: ${orderId}</div>
                        <div><br/>Order Id: ${resp.data.orderId}</div>
                        <b>Внимание! Проверьте поступление оплаты.</b>
                    </div>`
                    }
                    transporter.sendMail(mailOptions, (err, info)=>{
                        if(err) {
                            console.error( 'Невозможно отправить письмо: ' + err );
                            axios.post('https://webhook.site/bd488383-1ba8-4136-b6bb-c12609fc6f58', 'Невозможно отправить письмо: ' + err );
                        }
                    });
                    formUrl = resp.data.formUrl;
                    return resp;
                })
                .catch(function(error) {
                    console.log(error);
                    //axios.post('https://webhook.site/bd488383-1ba8-4136-b6bb-c12609fc6f58', error);
                    return error;
                });
                return formUrl;
            }

            let amount = '';

            if (price.includes('.') || price.includes(',')) {
                if (price.split('.').pop().length === 2 || price.split(',').pop().length === 2) {
                    amount = price.replace('.','').replace(',','');
                } else {
                    amount = price.replace('.','').replace(',','') + '0';
                }
            } else {
                amount = price + '00';
            }


            let formData = {
                'userName': username,
                'password': password,
                'orderNumber': orderId,
                'amount': amount,
                'returnUrl': return_url,
            }
            console.log(formData.amount)
            //axios.post('https://webhook.site/bd488383-1ba8-4136-b6bb-c12609fc6f58', formData);

            let response = await gateway('register.do', formData);


            return res.json(response)

        } catch (e) {
            return e.message;
        }
    }
    async mail(req,res,next){
        try{
            let {proc} = req.params
            let {name,number,email,price,priceList,} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(proc === 'sendCalc'){
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Новая заявка',
                    html:`<div style="color:black;font-size:1.2em;backgroundColor:white;">
                        <div style={{textAlign:'center'}}><h3>Новая заявка.</h3><div>
                        Имя заказчика: <b>${name}</b>,<br/>
                        Номер: <b>${number}</b><br/>
                        Email: <b>${email}</b><br/>
                        <div>${priceList}</div>
                        <div><br/>Предварительная цена: <b>${price} рублей</b></div>
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return res.json(true)
            }
            return
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async callMe(req,res,next){
        try{
            let {obj,code} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(code === '!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$'){
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                obj = JSON.parse(obj)
                let str1 = ''
                for(let key in obj) {
                    str1 = str1 + `${key}: <b>${obj[key]}</b><br/>`
                }
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Поступила заявка с сайта',
                    html:`<div style="color:black;font-size:1.3em;backgroundColor:white;">
                        Заполнена форма на сайте:<br/>
                        ${str1}
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return
            }else{next(ApiError.internal("fuck off, bastard"))}
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async sendQuiz(req,res,next){
        try{
            let {obj,code} = req.body
            const data = await Interfaces.findOne({where:{id:0}},)
            if(code === '!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$'){
                let fileName = false
                if(req.files){
                    const {img} = req.files
                    if(['png','jpg','gif','psd','pdf','eps','jpeg','tiff','ai'].includes(img.name.split('.')[img.name.split('.').length - 1])){
                        fileName = uuid.v4() + '.' + img.name.split('.')[img.name.split('.').length - 1]
                        img.mv(path.resolve(__dirname, '..', 'static', 'mailImages', fileName))
                    }
                }
                obj = JSON.parse(obj)
                let transporter = await nodemailer.createTransport({
                    service:'mail',
                    host:'smtp.mail.ru',
                    port:465,
                    secure:true,
                    auth:{
                        user:data.mail,
                        pass:data.mailPass
                    },
                    tls:{
                        rejectUnauthorized:false,
                    }
                })
                let str1 = ''
                for(let key in obj) {
                    str1 = str1 + `${key}: <b>${obj[key]}</b><br/>`
                }
                let img1 = fileName?`Фото: ${process.env.REACT_APP_API_URL + fileName}`:''
                const mailOptions ={
                    from:data.mail,
                    to:data.mailToSend,
                    subject:'Поступила заявка с сайта',
                    html:`<div style="color:black;font-size:1.3em;backgroundColor:white;">

                        <div>${str1}</div>
                        ${img1}
                    </div>`
                }
                await transporter.sendMail(mailOptions)
                return
            }else{next(ApiError.internal("fuck off"))}
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}
module.exports = new MailController()