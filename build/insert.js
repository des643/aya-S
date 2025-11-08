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
    console.log('scanAndHide called');
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
		if (document.readyState === 'loading') {
			window.addEventListener('DOMContentLoaded', () => {
				scanAndHide()
				mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
			})
		} else {
			scanAndHide()
			mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
		}
	}

	// 恢复显示函数（用于当 toggleHidden 变为 false 时）
	function restoreShown() {
		try {
			const icons = Array.from(document.querySelectorAll('.el-icon-lock'))
			if (!icons.length) return
			icons.forEach((icon) => {
				const tr = icon.closest('tr')
				if (tr && tr.style && tr.style.display === 'none') {
					tr.style.display = ''
				}
			})
		} catch (e) {
			console.error('restoreShown error', e)
		}
	}

	// 开发模式回退：监听 window.postMessage，方便在非扩展环境下通过控制台注入命令
	window.addEventListener('message', (event) => {
		try {
			// 调试信息：打印事件来源与 data，便于确认监听是否被触发
			// 注意：在 DevTools 的不同上下文（例如扩展上下文）运行时，postMessage 可能不会发送到页面
			console.log('[insert.js] received window.message', { origin: event.origin, source: event.source, data: event.data })

			const data = event.data
			if (!data) return
			if (data.__fromPopupDev && data.payload) {
				let msg = data.payload
				if (typeof msg === 'string') msg = JSON.parse(msg)
				console.log('[insert.js] parsed payload', msg)
				if (msg && msg.type === 'toggle-hidden') {
					if (msg.value === true) {
						console.log('[insert.js] calling scanAndHide()')
						scanAndHide()
					} else {
						console.log('[insert.js] calling restoreShown()')
						restoreShown()
					}
				}
			}
		} catch (e) {
			console.error('[insert.js] message handler error', e)
		}
	})

	init()
	}();
