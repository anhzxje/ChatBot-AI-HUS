import { useEffect } from 'react';

const KaTeXStyle = () => {
  useEffect(() => {
    // Kiểm tra xem đã nạp CSS chưa để tránh nạp trùng
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, []);

  return null; // Component này không hiển thị gì cả, chỉ chạy ngầm
};

export default KaTeXStyle;