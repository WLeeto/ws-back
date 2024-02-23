const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
// const { koaBody } = require('koa-body')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const WS = require('ws')

const router = new Router()
const app = new Koa()
app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
// app.use(koaBody({
//     urlencoded: true,
// }))

function getCurrentDateTimeStr() {
    const DT = new Date()
    return `${DT.getHours()}:${DT.getMinutes()} ${DT.getDate()}.${DT.getMonth() + 1}.${DT.getFullYear()}`
}


// const chat = ['welcome to chat']
let user = ['User1', 'User2']

const chat = [
    {
      text: 'welcome to chat', 
      from: 'CHAT',
      dateTime: getCurrentDateTimeStr()
    }
  ]

router.get('/index', (ctx) => {
    ctx.response.body = 'hello j'
})

router.post('/user', (ctx) => {
    // console.log(typeof(ctx.request.body))
    // console.log(ctx.request.body)
    // users.push(ctx.request.body.username)
    return
})

router.delete('/user', (ctx) => {
    // const userToRemove = ctx.request.body.userToRemove
    // user = user.filter(item => item !== userToRemove)
    // ctx.response.status = 204
    return
})



const server = http.createServer(app.callback())
const port = 7070

const wsServer = new WS.Server({server})


wsServer.on('connection', (ws) => {


    ws.on('message', (e) => {

        const strData = e.toString()
        const data = JSON.parse(strData)

        console.log(data)
        
        if (data.message) {
            chat.push(data.message)
            const eventData = JSON.stringify({chat: [data.message]})
            
            Array.from(wsServer.clients)
            .filter(client => client.readyState === WS.OPEN)
            .forEach(client => client.send(eventData))
            }

        if (data.user) {
            user.push(data.user)
            const eventData = JSON.stringify({user: [data.user]})
            
            Array.from(wsServer.clients)
            .filter(client => client.readyState === WS.OPEN)
            .forEach(client => client.send(eventData))
            }

        if (data.quit) {
            user = user.filter(item => item !== data.quit)

            const eventData = JSON.stringify({user: [data.user]})
            
            Array.from(wsServer.clients)
            .filter(client => client.readyState === WS.OPEN)
            .forEach(client => client.send(eventData))
        }
    })

    ws.send(JSON.stringify({ chat, user }))
})



server.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Server is listenin to ' + port)
})
