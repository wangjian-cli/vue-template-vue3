import { DirectiveBinding } from 'vue';
import Cover from '@/assets/images/cover.png';
import { errorReport } from '_t';
export default {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    // 图片报错
    el.onerror = () => {
      // 进行错误上报
      errorReport({
        name: `图片${el.src}加载出错`,
        message: '',
        stack: ''
      });
      // 兜底图片
      el.src = binding.value || Cover;
    };
  }
};
