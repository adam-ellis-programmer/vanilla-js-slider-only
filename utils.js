const get = (el) => {
  const element = document.querySelector(el);
  if (el) return element;

  throw new Error('--------> Enter a element <--------');
};

export { get };
