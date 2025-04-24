/**
 * 笔记图片前端测试脚本 - 安全版本
 * 用于处理后端返回的相对图片URL
 */

// 示例后端返回的图片URL (现在是相对URL)
const backendResponse = {
  code: 0,
  data: "/images/wMRq8ols-1893564417139503106-带土.jpg",
  message: "ok"
};

/**
 * 处理后端返回的图片URL，确保安全访问
 * 
 * 注意：后端现在返回相对URL，前端需要根据当前环境构建完整URL
 * 
 * @param {string} relativeUrl - 后端返回的相对图片URL
 * @returns {string} 完整的可访问图片URL
 */
function processImageUrl(relativeUrl) {
  if (!relativeUrl) return '';
  
  // 如果已经是绝对URL (以http或https开头)，直接返回
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  
  // 确保URL没有双斜杠等安全隐患
  let processedUrl = relativeUrl.replace(/\/\//g, '/');
  
  // 获取当前环境的基础URL
  // 在实际环境中，这可能来自配置或者环境变量
  const apiBaseUrl = getApiBaseUrl();
  
  // 确保URL格式正确
  if (processedUrl.startsWith('/')) {
    return apiBaseUrl + processedUrl;
  } else {
    return apiBaseUrl + '/' + processedUrl;
  }
}

/**
 * 获取当前环境的API基础URL
 * 在实际项目中，这应该从配置中读取
 */
function getApiBaseUrl() {
  // 检测当前环境
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  // 在生产环境中，这通常是你的应用域名
  const productionBaseUrl = 'https://example.com/api'; 
  
  // 开发环境URL
  const devBaseUrl = 'http://localhost:8010/api';
  
  // 根据当前环境返回适当的URL
  return isLocalhost ? devBaseUrl : productionBaseUrl;
}

/**
 * 在页面上显示图片
 * @param {string} relativeUrl - 相对图片URL
 */
function displayImage(relativeUrl) {
  // 在实际前端代码中：
  console.log('后端返回的相对URL:', relativeUrl);
  const fullUrl = processImageUrl(relativeUrl);
  console.log('处理后的完整URL:', fullUrl);
  
  // 示例：在实际应用中如何使用
  // const imgElement = document.createElement('img');
  // imgElement.src = fullUrl;
  // imgElement.alt = "笔记图片";
  // imgElement.onerror = function() {
  //   console.error('图片加载失败:', fullUrl);
  //   this.src = '/assets/error-image.png'; // 加载失败时显示的替代图片
  // };
  // document.querySelector('.note-content').appendChild(imgElement);
  
  return {
    relativeUrl: relativeUrl,
    fullUrl: fullUrl,
    imgTag: `<img src="${fullUrl}" alt="笔记图片" onerror="this.onerror=null;this.alt='图片加载失败';this.style.background='#ffeeee';"/>`
  };
}

// 示例：处理后端返回的图片URL
const result = displayImage(backendResponse.data);

// 输出结果
console.log('相对URL:', result.relativeUrl);
console.log('完整URL:', result.fullUrl);
console.log('图片标签示例:', result.imgTag);

// 导出函数供其他文件使用
if (typeof module !== 'undefined') {
  module.exports = {
    processImageUrl,
    displayImage,
    getApiBaseUrl
  };
} 