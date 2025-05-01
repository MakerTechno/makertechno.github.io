const fadeElement = document.querySelector('.fore-overlay');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;

  // 计算页面顶部距离视口高度的5%
  const threshold = viewportHeight * 0.05;

  // 控制透明度变化
  if (scrollTop > threshold) {
    fadeElement.style.opacity = Math.max(1 - (scrollTop - threshold) / viewportHeight, 0); // 渐隐
  } else {
    fadeElement.style.opacity = '1'; // 显现
  }
});
