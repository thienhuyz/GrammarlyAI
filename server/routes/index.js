const userRouter = require('./user')
const grammarRouter = require('./grammar');
const writingHistoryRouter = require("./writingHistory");
const paymentRouter = require('./payment');
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/grammar', grammarRouter);
    app.use('/api/history', writingHistoryRouter);
    app.use('/api/payment', paymentRouter);
    app.use(notFound)
    app.use(errHandler)

}

module.exports = initRoutes