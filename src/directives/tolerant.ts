import { DirectiveBinding } from 'vue';
const handle = (el: HTMLElement, binding: DirectiveBinding) => {
  // 当前dom的内容
  const { innerText } = el;
  const replacement: string = binding.value || '--';
  if (innerText !== replacement) {
    // 内容为空
    if (/null|undefined|nan|^\s*$/gi.test(innerText)) {
      el.innerText = replacement;
    }
  }
};
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    handle(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    handle(el, binding);
  }
};
