// 功能：隐藏包含 el-icon-lock 图标的最近父 tr 行
void function hideLockedRowsModule() {
	// 隐藏单个图标所在的最近 tr
	function hideRowForIcon(iconEl) {
		if (!iconEl) return
		const tr = iconEl.closest('tr')
		if (tr && tr.style && tr.style.display !== 'none') {
			tr.style.display = 'none'
		}
	}

	// 扫描当前文档，隐藏所有匹配的行
	function scanAndHide() {
		const icons = Array.from(document.querySelectorAll('.el-icon-lock'))
		if (!icons.length) return
		icons.forEach(hideRowForIcon)
	}

	// MutationObserver 回调：当有新节点或属性变化时，检查新增节点中是否包含目标图标
	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.type === 'childList' && m.addedNodes.length) {
				m.addedNodes.forEach((node) => {
					if (!(node instanceof Element)) return
					if (node.matches && node.matches('.el-icon-lock')) hideRowForIcon(node)
					// 在新增节点内部查找图标
					const found = node.querySelectorAll && node.querySelectorAll('.el-icon-lock')
					if (found && found.length) found.forEach(hideRowForIcon)
				})
			}
			if (m.type === 'attributes' && m.target instanceof Element) {
				const t = m.target
				if (t.classList && t.classList.contains('el-icon-lock')) hideRowForIcon(t)
			}
		}
	})

	// 初始化：在 DOMContentLoaded 或立即运行扫描并启动 observer
	function init() {
    // 根据 chrome.storage 中的 isHidden 来决定是否进行隐藏操作
    const startObserver = () => {
      scanAndHide();
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    };

    // 存储当前是否应该隐藏（默认 true）
    let shouldHide = true;

    const setupWithStorage = () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['isHidden'], (res) => {
            if (res && typeof res.isHidden !== 'undefined') {
              shouldHide = !!res.isHidden;
            }
            if (shouldHide) startObserver();
          });

          // 监听 storage 的变化
          chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.isHidden) {
              shouldHide = !!changes.isHidden.newValue;
              console.log('[insert.js] chrome.storage.onChanged isHidden ->', shouldHide);
              if (shouldHide) {
                scanAndHide();
                // ensure observer is running
                if (!mo) return;
                // already observing in this implementation
              } else {
                // 如果不需要隐藏，可以暂时断开 observer
                try {
                  mo.disconnect();
                } catch (e) {}
              }
            }
          });
        }
      } catch (e) {
        // ignore
      }
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', setupWithStorage);
    } else {
      setupWithStorage();
    }
  }

  init();

  // 还监听 runtime 消息，便于 popup 主动发送消息通知内容脚本
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg && msg.type === 'isHiddenChanged') {
          console.log('[insert.js] runtime.onMessage isHiddenChanged ->', msg.isHidden);
          // 根据消息值进行相应处理
          if (msg.isHidden) scanAndHide();
        }
      });
    }
  } catch (e) {
    // ignore
  }

	}();
