import multireducer from 'multireducer';

// isolate concerns within a Redux application (modules)
// https://github.com/erikras/ducks-modular-redux

import device from './modules/device';
import counter from './modules/counter';
import temperatureCalculator from './modules/temperatureCalculator';
import filterableTable from './modules/filterableTable';
// import auth from './modules/auth';
// import notifs from './modules/notifs';
import info from './modules/info';
// import online from './modules/online';

export { default as initialState } from './initial-state';

// state shape
export default function rootReducer() {
  return {
    online: (v = true) => v,
    counter,
    device,
    counterCollection: multireducer({
      AboutOneMultireducer1: counter,
      AboutTwoMultireducer1: counter,
      AboutTwoMultireducer2: counter,
      AboutTwoMultireducer3: counter,
    }),
    filterableTableCollection: multireducer({
      AboutOneMultireducerFilterableTable1: filterableTable,
      AboutOneMultireducerFilterableTable2: filterableTable,
    }),
    temperatureCalculatorCollection: multireducer({
      AboutOne1: temperatureCalculator,
      AboutOne2: temperatureCalculator,
      AboutTwo1: temperatureCalculator,
      AboutTwo2: temperatureCalculator,
    }),
    info
  };
}
