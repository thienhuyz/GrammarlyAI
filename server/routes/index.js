const userRouter = require('./user')
const grammarRouter = require('./grammar');
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/grammar', grammarRouter);

    app.use(notFound)
    app.use(errHandler)

}

module.exports = initRoutes