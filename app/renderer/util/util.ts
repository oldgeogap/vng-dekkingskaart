import { Option } from "renderer/components/options";
import { format, formatDistance } from "date-fns";
import nl from "date-fns/locale/nl";

export const numberFormatter = new Intl.NumberFormat("nl-NL");

export function findOptionName(options: Option[], id: number): string {
  for (let option of options) {
    if (option.id == id) {
      return option.name;
    }
  }
  return "";
}

export function formatTimestamp(n: number) {
  let d = new Date(n);
  return format(d, "dd-MM-yyyy HH:mm:ss", { locale: nl });
}

export function formatDate(d: Date) {
  return format(d, "dd-MM-yyyy HH:mm:ss", { locale: nl });
}

export function formatTimestampDistance(n: number) {
  let d = new Date(n);

  return formatDistance(d, new Date(), { addSuffix: true, locale: nl });
}

export function formatNumber(num: number, unit: string) {
  if (num) {
    return `${numberFormatter.format(num)}${unit}`;
  }
  return "";
}

export function parsePointString(s: string): [number, number] | null {
  if (s.length > 8) {
    let bit = s.substring(6);
    bit = bit.substring(0, bit.length - 1);
    let bits = bit.split(" ");
    if (bits.length === 2) {
      return [parseFloat(bits[0]), parseFloat(bits[1])];
    }
  }

  return null;
}

export function msToReadableTime(ms: number) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  let readable = "";
  if (days > 0) {
    readable += `${days}d `;
  }
  if (hours > 0) {
    readable += `${hours % 24}u `;
  }
  if (minutes > 0) {
    readable += `${minutes % 60}m `;
  }
  if (seconds > 0) {
    readable += `${seconds % 60}s `;
  }

  return readable;
}
