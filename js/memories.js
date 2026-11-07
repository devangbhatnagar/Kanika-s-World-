import {memories} from './data.js?v=joystick-20261107e';
export function memoryContent(i){const m=memories[i];return {icon:m[1],title:m[0],kicker:m[2],text:m[3]}}
