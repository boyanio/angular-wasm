import { Pipe, PipeTransform } from "@angular/core";

const zeroRegex = new RegExp("^0[\\.\\,]0+$");

const numberToFixed = (num: number) => {
  const fractionDigits = 5;
  let res = num.toFixed(fractionDigits);
  if (zeroRegex.test(res)) {
    // The number is 0.00000
    res = `0.${"0".repeat(fractionDigits - 1)}1`;
  }
  return res;
};

/*
 * Converts ms to human-readable time string
 * Usage:
 *   value | humanizeTime
 * Example:
 *   {{ 2001 | humanizeTime }}
 *   formats to: 2s 1ms
 *
 *   {{ 1.234 | humanizeTime }}
 *   formats to: 1.234ms
 */
@Pipe({ name: "humanizeTime" })
export class HumanizeTimePipe implements PipeTransform {
  transform(value: number) {
    const milliseconds = value % 1000;
    const timeTakenInSec = (value - milliseconds) / 1000;
    const hours = Math.floor(timeTakenInSec / 3600);
    const minutes = Math.floor((timeTakenInSec - hours * 3600) / 60);
    const seconds = timeTakenInSec - hours * 3600 - minutes * 60;

    let str = "";
    if (hours > 0) {
      str += `${hours}h `;
    }
    if (minutes > 0) {
      str += `${minutes}m `;
    }
    if (seconds > 0) {
      str += `${seconds}s `;
    }
    if (milliseconds > 0) {
      str += numberToFixed(milliseconds) + "ms";
    }
    return str;
  }
}
