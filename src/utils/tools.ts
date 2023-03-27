import { OpenClientParam, ErrorReportParam } from '@/types/toolsType';
// 节流
function throttle(cb: any, time: number) {
  let timer: NodeJS.Timeout | null;
  return function (...args: any) {
    if (timer) {
      return;
    }
    timer = setTimeout(function () {
      timer = null;
      cb(...args);
    }, time);
  };
}
//防抖
function debounce(fn: any, delay: number) {
  let timer: any = null;
  return function (...argu: any) {
    const args = argu;
    // @ts-ignore
    const context = this;
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}
// 打开客户端弹窗, mode常用的有5,6,8;5,6相同,6给pdf使用,8是无边框,15是给pdf使用
const openClient = ({
  link,
  mode,
  width = '1440',
  height = '900'
}: OpenClientParam): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    if (!link) {
      reject('链接异常');
    }
    if (!window.API) {
      reject('客户端方法异常');
    }
    window.API.use({
      method: 'Util.openURL2',
      data: { mode, width, height, url: link, useCef: true },
      notClient: () => {
        window.open(link);
      },
      success: () => {
        resolve('');
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  }).catch((error: Error | string) => {
    ElMessage.error('数据异常，请稍后重试！');
    errorReport({
      name: '打开客户端弹框失败',
      message: (error as Error)?.message || '',
      stack: (error as Error)?.stack || ''
    });
  });
};
// 打开反馈弹框
const openFeedBack = (link: string, id: number): Promise<unknown> => {
  let border: number = 0;
  return new Promise((resolve, reject) => {
    if (!link) {
      reject('链接异常');
    }
    if (!window.API) {
      reject('客户端方法异常');
    }
    const url = `${link}?border=${border}&entry=${id}`;
    window.API.use({
      method: 'Util.openIntegrateFeedBack',
      data: [url],
      notClient: () => {
        window.open(url);
      },
      success: () => {
        resolve('');
      },
      error: () => {
        border = 1;
        window.API.use({
          method: 'Util.openURL2',
          data: {
            url: `${link}?border=${border}&entry=${id}`,
            mode: '8',
            useCef: true
          },
          error: (error: Error) => {
            reject(error);
          }
        });
      }
    });
  }).catch((error: Error | string) => {
    ElMessage.error('反馈失败，请稍后重试！');
    errorReport({
      name: '打开反馈弹窗失败',
      message: (error as Error)?.message || '',
      stack: (error as Error)?.stack || ''
    });
  });
};
// 错误上报
const errorReport = ({ name, message, stack }: ErrorReportParam) => {
  window.ClientMonitor.reportFrameErrors(
    {
      // 类型
      category: 'js',
      // 级别
      grade: 'Error'
    },
    {
      name,
      message,
      stack
    }
  );
};
// dateplus
class DatePlus extends Date {
  constructor(args?: any) {
    args ? super(args) : super();
  }
  format(fmt = 'yyyy-MM-dd hh:mm:ss') {
    const quarterlyMonths = 3;
    const o = {
      //月份
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + quarterlyMonths) / quarterlyMonths),
      S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        `${this.getFullYear()}`.substr(quarterlyMonths + 1 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          // @ts-ignore
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
        );
      }
    }
    return fmt;
  }
}
// 时间处理
const dealTime = (date: string): string => {
  const timeStartPos5: number = 5;
  const timeStartPos11: number = 11;
  const timeEndPos10: number = 10;
  const timeEndPos4: number = 4;
  const timeEndPos: number = 16;
  // 1min
  const sixty: number = 60;
  const twentyFour: number = 24;
  const oneMin: number = 6e4;
  const oneYearDay: number = 365;
  const sixtyMin: number = oneMin * sixty;
  const twentyFourHour: number = sixtyMin * twentyFour;
  const oneYear: number = oneYearDay * twentyFourHour;
  const dateTime = new Date(date).getTime();
  const nowDate = new DatePlus();
  const nowTime = nowDate.getTime();
  // 是否是同一天
  const isSameDay = nowDate.format('yyyy-MM-dd') === date.substring(0, timeEndPos10);
  // 是否是同一年
  const isSameYear = nowDate.format('yyyy') === date.substring(0, timeEndPos4);
  const differenceTime = nowTime - dateTime;
  switch (true) {
    case differenceTime <= oneMin:
      return '刚刚';
    case differenceTime <= sixtyMin:
      return `${(differenceTime / oneMin).toFixed()}分钟之前`;
    case differenceTime <= twentyFourHour && isSameDay:
      return date.substring(timeStartPos11, timeEndPos);
    case differenceTime <= oneYear && isSameYear:
      return date.substring(timeStartPos5, timeEndPos);
    default:
      return date.substring(0, timeEndPos);
  }
};
export { throttle, debounce, openClient, openFeedBack, errorReport, dealTime };
