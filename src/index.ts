import { timer } from "./connpass";

declare const global: {
  [x: string]: any;
};

global.timer = function() {
  return timer();
};
