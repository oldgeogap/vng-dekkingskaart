import { Option } from "renderer/components/options";
import { format, formatDistance } from "date-fns";
import nl from "date-fns/locale/nl";

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
  return format(d, "dd-MM-yyyy HH:mm:ss");
}

export function formatTimestampDistance(n: number) {
  let d = new Date(n);

  return formatDistance(d, new Date(), { addSuffix: true, locale: nl });
}
