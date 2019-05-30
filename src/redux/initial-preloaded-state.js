
export default req => ({

  device: {
    isMobile: req.isMobile
  },

  counter: {
    countPreloadedState: req.counter,
    countMultireducer: 0
  },

});
