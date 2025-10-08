import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.locale("es");
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

/**
 * Formatea automáticamente la fecha según cuán reciente sea.
 * - Hoy → "hoy a las 14:30"
 * - Ayer → "ayer"
 * - Últimos 7 días → "hace 3 días"
 * - Este año → "12 de marzo"
 * - Otro año → "12 de marzo de 2024"
 */
export function formatSmartDate(dateString?: string): string {
  if (!dateString) return "";

  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isToday()) return `hoy a las ${date.format("HH:mm")}`;
  if (date.isYesterday()) return "ayer";
  if (now.diff(date, "day") <= 7) return date.fromNow();
  return date.format("D [de] MMMM [de] YYYY");
}

/**
 * Formatos manuales si los necesitas
 */
export function formatDate(dateString?: string, mode: "short" | "long" | "time" | "relative" = "short"): string {
  if (!dateString) return "";

  const date = dayjs(dateString);
  switch (mode) {
    case "short":
      return date.format("DD/MM/YYYY");
    case "long":
      return date.format("DD [de] MMMM [de] YYYY, HH:mm");
    case "time":
      return date.format("HH:mm");
    case "relative":
      return date.fromNow();
    default:
      return date.format("DD/MM/YYYY");
  }
}
