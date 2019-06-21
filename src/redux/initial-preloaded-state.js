
export default req => ({

  device: {
    userAgent: req.userAgent,
    isBot: req.isBot
  },

  counter: {
    countPreloadedState: req.counter,
    countMultireducer: 0
  },

});
