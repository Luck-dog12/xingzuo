export function toDateOnly(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatChineseDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(`${date}T00:00:00+08:00`) : date;
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

export function getShanghaiToday() {
  return toDateOnly(new Date());
}

export function getWeekRange(date = new Date()) {
  const shanghaiDate = new Date(`${toDateOnly(date)}T00:00:00+08:00`);
  const day = shanghaiDate.getDay() || 7;
  const start = new Date(shanghaiDate);
  start.setDate(shanghaiDate.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: toDateOnly(start),
    end: toDateOnly(end),
    key: `${toDateOnly(start)}_${toDateOnly(end)}`,
  };
}

export function getMonthKey(date = new Date()) {
  const today = toDateOnly(date);
  return today.slice(0, 7);
}

export function isShanghaiFirstDayOfMonth(date = new Date()) {
  return toDateOnly(date).endsWith("-01");
}
