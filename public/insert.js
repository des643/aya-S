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

	init()
	}();
