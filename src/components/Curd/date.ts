// ----------------------- 日期相关 -----------------------
import type { CurdType } from "./index";

type DateType = CurdType.Date["dateType"];

interface Shortcut {
  text: string;
  value(): Date | Array<Date>;
}

interface DateTypeOption extends Pick<CurdType.Date, "format" | "formatShow"> {
  label: string;
  /** 日期组件类型 */
  value: DateType;
}

export const dateTypeOptions: Array<DateTypeOption> = [
  {
    label: "选择年份",
    value: "year",
    formatShow: "YYYY",
    format: "Y"
  },
  {
    label: "选择年份-月份",
    value: "month",
    formatShow: "YYYY-MM",
    format: "Y-M"
  },
  {
    label: "选择年份-周",
    value: "week",
    formatShow: "YYYY年 第ww周",
    format: "Y-M-D"
  },
  {
    label: "选择年份-月份-日",
    value: "date",
    formatShow: "YYYY-MM-DD",
    format: "Y-M-D"
  },
  {
    label: "选择年份-月份-日 时:分:秒",
    value: "datetime",
    formatShow: "YYYY-MM-DD HH:mm:ss",
    format: "Y-M-D h:m:s"
  },
  {
    label: "选择日期范围",
    value: "daterange",
    formatShow: "YYYY-MM-DD",
    format: "Y-M-D"
  },
  {
    label: "选择日期-时间范围",
    value: "datetimerange",
    formatShow: "YYYY-MM-DD HH:mm:ss",
    format: "Y-M-D h:m:s"
  }
];

const oneDay = 3600 * 1000 * 24;

function getLastMonth(last = 0) {
  const now = new Date();
  const date = new Date(now);
  date.setMonth(now.getMonth() - last);
  return date;
}

function getLastWeek(last = 0) {
  const date = new Date();
  const value = oneDay * 7 * last;
  date.setTime(date.getTime() - value);
  return date;
}

const commonShortcuts: Array<Shortcut> = [
  {
    text: "今天",
    value: () => new Date()
  },
  {
    text: "昨天",
    value() {
      const date = new Date();
      date.setTime(date.getTime() - oneDay);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => getLastWeek(1)
  },
  {
    text: "一个月前",
    value: () => getLastMonth(1)
  },
  {
    text: "三个月前",
    value: () => getLastMonth(3)
  },
  {
    text: "半年前",
    value: () => getLastMonth(6)
  },
  {
    text: "一年前",
    value: () => getLastMonth(12)
  }
];

const commonRangeShortcuts = commonShortcuts.map((item, index) => {
  const isFirst = index === 0;
  const current = new Date().toLocaleDateString();
  const today = [
    new Date(`${current} 00:00:00`),
    new Date(`${current} 23:59:59`)
  ];
  return {
    text: isFirst ? "今天内" : `${item.text}至今`,
    value: () => (isFirst ? today : [item.value(), new Date()])
  } as Shortcut;
});

export const shortcutMap: Record<DateType, Array<Shortcut>> = {
  year: [
    {
      text: "今年",
      value: () => new Date()
    },
    {
      text: "去年",
      value: () =>
        new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    },
    {
      text: "前年",
      value: () =>
        new Date(new Date().setFullYear(new Date().getFullYear() - 2))
    }
  ],
  month: [
    {
      text: "当月",
      value: () => new Date()
    },
    {
      text: "上月",
      value: () => getLastMonth(1)
    },
    {
      text: "前3个月",
      value: () => getLastMonth(3)
    },
    {
      text: "前6个月",
      value: () => getLastMonth(6)
    },
    {
      text: "前12个月",
      value: () => getLastMonth(12)
    }
  ],
  week: [
    {
      text: "本周",
      value: () => new Date()
    },
    {
      text: "上周",
      value: () => getLastWeek(1)
    },
    {
      text: "上2周",
      value: () => getLastWeek(2)
    },
    {
      text: "上3周",
      value: () => getLastWeek(3)
    },
    {
      text: "上4周",
      value: () => getLastWeek(4)
    }
  ],
  date: commonShortcuts,
  datetime: commonShortcuts,
  daterange: commonRangeShortcuts,
  datetimerange: commonRangeShortcuts
}
