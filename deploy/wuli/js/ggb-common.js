/* ============================================================
   ggb-common.js — GeoGebra 交互卡公共逻辑
   每个例题一个 GGBApplet，命令式构造，支持两种模式：
     - 自由探究：全部对象可见，滑块可调
     - 解题演示：按步骤点亮构造（受力分析→方程→矢量三角形→结论）
   ============================================================ */

(function (global) {
  'use strict';

  /**
   * 创建一个交互卡实例并绑定到 DOM。
   * @param {Object} opt
   *   container   卡片根元素（含 .ggb-stage / .ggb-steps）
   *   appId       GeoGebra applet DOM id（需唯一）
   *   width/height 画布尺寸
   *   commands    function(api) —— 建立全部构造（一次性）
   *   steps       [{label, show:[names], hide:[names], caption}] 解题步骤
   *   onExplore   function(api) —— 切到“自由探究”时调用（恢复全显）
   */
  function InteractiveCard(opt) {
    var self = this;
    this.opt = opt;
    this.mode = 'explore';
    this.stepIdx = -1;
    this.api = null;
    this.alwaysVisible = opt.alwaysVisible || [];

    var container = typeof opt.container === 'string'
      ? document.getElementById(opt.container)
      : opt.container;
    if (!container) return;

    this.stageEl = container.querySelector('.ggb-stage');
    this.stepsEl = container.querySelector('.ggb-steps');
    this.captionEl = container.querySelector('.ggb-caption');

    var params = {
      id: opt.appId,
      width: opt.width || 820,
      height: opt.height || 480,
      showMenuBar: false,
      showAlgebraInput: false,
      showResetIcon: true,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      showZoomButtons: true,
      showFullscreenButton: true,
      clickToLoad: false,
      buttonShadows: true,
      playButton: false,
      appName: 'geometry',
      language: 'zh'
    };

    var applet = new GGBApplet(params, true);

    // 构造完成后的初始化
    this._initAfterInject = function () {
      try {
        self.api = applet.getAPI ? applet.getAPI() : global[opt.appId];
        if (self.api && self.api.setErrorDialogsActive) self.api.setErrorDialogsActive(false);
        if (self.api && self.api.setPerspective) { try { self.api.setPerspective('G'); } catch (e) { } }
        if (opt.commands && self.api) opt.commands(self.api);
        // 滑块等常显控件
        self.alwaysVisible.forEach(function (n) {
          try {
            self.api.setVisible(n, true);
            self.api.setLabelVisible(n, true);
          } catch (e) { }
        });
        self._buildControls(container);
        self._buildNarration(container);
        self._bindTabs(container);
        self._setupFit();
        self._buildStepButtons();
        self.setMode('explore');
      } catch (e) {
        console.error('GeoGebra init failed:', e);
      }
    };

    // deployggb.js 注入
    var mount = this.stageEl;
    mount.id = opt.appId + '-mount';
    applet.inject(mount.id);

    // 就绪轮询：优先 getAPI()，回退到全局对象 window[appId]
    var tries = 0;
    (function waitReady() {
      var api = null;
      try {
        if (applet.getAPI) api = applet.getAPI();
        if (!api || !api.evalCommand) api = global[opt.appId] || null;
      } catch (e) { }
      if (api && typeof api.evalCommand === 'function') {
        self._initAfterInject();
      } else if (tries++ < 200) {
        setTimeout(waitReady, 150);
      } else {
        console.error('GeoGebra applet not ready');
      }
    })();
  }

  InteractiveCard.prototype._buildControls = function (container) {
    var self = this;
    if (!this.opt.controls || !this.opt.controls.length) return;
    var bar = document.createElement('div');
    bar.className = 'ggb-controls';
    this.opt.controls.forEach(function (c) {
      var wrap = document.createElement('label');
      wrap.className = 'ggb-ctl';
      var nameEl = document.createElement('span');
      nameEl.className = 'name';
      nameEl.textContent = c.label;
      var input = document.createElement('input');
      input.type = 'range';
      input.min = c.min; input.max = c.max; input.step = c.step || 0.01;
      input.value = c.value;
      var valEl = document.createElement('span');
      valEl.className = 'val';
      valEl.textContent = c.value;
      input.addEventListener('input', function () {
        var v = parseFloat(input.value);
        valEl.textContent = (c.fmt ? c.fmt(v) : v);
        try { self.api.setValue(c.name, v); } catch (e) { }
      });
      wrap.appendChild(nameEl);
      wrap.appendChild(input);
      wrap.appendChild(valEl);
      bar.appendChild(wrap);
    });
    this.stageEl.parentNode.insertBefore(bar, this.stepsEl || this.captionEl);
    this.controlsEl = bar;
  };

  /* ---------- 讲解播放器（影院模式：自动分步 + 语音） ---------- */

  InteractiveCard.prototype._buildNarration = function (container) {
    var self = this;
    if (!this.opt.narration) return;

    // 「看讲解」按钮挂在 tab 行右侧
    var tabs = container.querySelector('.ggb-tabs');
    var openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'ggb-narrate-btn';
    openBtn.textContent = '▶ 看讲解';
    openBtn.addEventListener('click', function () { self.openNarration(); });
    tabs.appendChild(openBtn);

    // 播放控制条（讲解模式专用）
    var player = document.createElement('div');
    player.className = 'ggb-player';
    player.innerHTML =
      '<button type="button" data-act="prev">⏮ 上一步</button>' +
      '<button type="button" data-act="toggle">⏸ 暂停</button>' +
      '<button type="button" data-act="next">⏭ 下一步</button>' +
      '<button type="button" data-act="replay">↻ 重播</button>' +
      '<button type="button" data-act="fs">⛶ 全屏</button>' +
      '<span class="ggb-player-progress"></span>' +
      '<span class="ggb-player-title"></span>' +
      '<button type="button" data-act="close" class="ggb-player-close">✕ 退出</button>';
    this.stageEl.parentNode.insertBefore(player, this.stageEl);
    this.playerEl = player;

    player.querySelector('.ggb-player-title').textContent =
      (this.opt.narration && this.opt.narration.title) || '解题讲解';

    player.addEventListener('click', function (e) {
      var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
      if (!act) return;
      if (act === 'prev') self.narrPrev();
      else if (act === 'next') self.narrNext();
      else if (act === 'toggle') self.narrToggle();
      else if (act === 'replay') self.narrReplay();
      else if (act === 'fs') self.toggleFullscreen();
      else if (act === 'close') self.closeNarration();
    });

    document.addEventListener('fullscreenchange', function () { self._onFsChange(); });
    document.addEventListener('webkitfullscreenchange', function () { self._onFsChange(); });

    this.narrIdx = -1;
    this.narrPlaying = false;
    this.narrAudio = null;
    this.narrTimer = null;

    this._escHandler = function (e) {
      if (e.key === 'Escape' && self._cinemaOpen) self.closeNarration();
    };
    document.addEventListener('keydown', this._escHandler);
  };

  InteractiveCard.prototype._enterCinema = function () {
    var card = this.stageEl.closest ? this.stageEl.closest('.ggb-card') : null;
    if (!card) return;
    card.classList.add('cinema');
    var backdrop = document.createElement('div');
    backdrop.className = 'cinema-backdrop';
    backdrop.addEventListener('click', this.closeNarration.bind(this));
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    this._cinemaOpen = true;
    this._cinemaCard = card;
    this._backdrop = backdrop;
    if (this._fitAfter) this._fitAfter();
    // 影院模式隐藏 tab 行与手动步骤条，显示播放条
    var tabs = card.querySelector('.ggb-tabs');
    if (tabs) tabs.style.display = 'none';
    if (this.stepsEl) this.stepsEl.classList.remove('visible');
    if (this.playerEl) this.playerEl.classList.add('visible');
  };

  InteractiveCard.prototype.closeNarration = function () {
    this._stopAudio();
    this.narrPlaying = false;
    if (this._cinemaCard) {
      this._cinemaCard.classList.remove('cinema');
      var tabs = this._cinemaCard.querySelector('.ggb-tabs');
      if (tabs) tabs.style.display = '';
    }
    if (this._backdrop && this._backdrop.parentNode) this._backdrop.parentNode.removeChild(this._backdrop);
    document.body.style.overflow = '';
    this._cinemaOpen = false;
    if (this.playerEl) this.playerEl.classList.remove('visible');
    if (this._fitAfter) this._fitAfter();
    if (this.opt.onNarrationEnd) this.opt.onNarrationEnd(this.api);
  };

  InteractiveCard.prototype._stopAudio = function () {
    if (this.narrAudio) {
      try { this.narrAudio.pause(); } catch (e) { }
      this.narrAudio = null;
    }
    if (this.narrTimer) {
      clearTimeout(this.narrTimer);
      this.narrTimer = null;
    }
  };

  InteractiveCard.prototype.openNarration = function () {
    this._enterCinema();
    this.mode = 'steps';
    this.narrIdx = -1;
    this.narrPlaying = true;
    this._updateToggleBtn();
    this.narrNext();
  };

  InteractiveCard.prototype.narrReplay = function () {
    this._stopAudio();
    this.narrIdx = -1;
    this.narrPlaying = true;
    this._updateToggleBtn();
    this.narrNext();
  };

  InteractiveCard.prototype.narrNext = function () {
    if (this.narrIdx + 1 >= this.opt.steps.length) {
      // 播完停在最后一步
      this.narrPlaying = false;
      this._updateToggleBtn();
      return;
    }
    this._showScene(this.narrIdx + 1);
  };

  InteractiveCard.prototype.narrPrev = function () {
    if (this.narrIdx <= 0) return;
    this._showScene(this.narrIdx - 1);
  };

  InteractiveCard.prototype.toggleFullscreen = function () {
    var card = this._cinemaCard || (this.stageEl.closest ? this.stageEl.closest('.ggb-card') : null);
    if (!card) return;
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    var req = card.requestFullscreen || card.webkitRequestFullscreen;
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    try {
      if (fsEl) {
        if (exit) exit.call(document);
      } else if (req) {
        var p = req.call(card);
        if (p && p.catch) p.catch(function () { });
      }
    } catch (e) { }
  };

  InteractiveCard.prototype._onFsChange = function () {
    var b = this.playerEl && this.playerEl.querySelector('[data-act="fs"]');
    var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (b) b.textContent = fsEl ? '⛶ 退出全屏' : '⛶ 全屏';
    // 全屏后容器尺寸变化，重新拟合画布
    if (this._fitAfter) this._fitAfter();
  };

  InteractiveCard.prototype.narrToggle = function () {
    if (this.narrPlaying) {
      this.narrPlaying = false;
      if (this.narrAudio) { try { this.narrAudio.pause(); } catch (e) { } }
      if (this.narrTimer) { clearTimeout(this.narrTimer); this.narrTimer = null; }
    } else {
      this.narrPlaying = true;
      if (this.narrIdx < 0) { this.narrNext(); }
      else if (this.narrAudio) {
        var self = this;
        this.narrAudio.play().catch(function () { self._fallbackTimer(); });
      } else {
        this._fallbackTimer();
      }
    }
    this._updateToggleBtn();
  };

  InteractiveCard.prototype._updateToggleBtn = function () {
    if (!this.playerEl) return;
    var b = this.playerEl.querySelector('[data-act="toggle"]');
    if (b) b.textContent = this.narrPlaying ? '⏸ 暂停' : '▶ 播放';
  };

  InteractiveCard.prototype._updateProgress = function () {
    if (!this.playerEl) return;
    var p = this.playerEl.querySelector('.ggb-player-progress');
    if (p) p.textContent = (this.narrIdx + 1) + ' / ' + this.opt.steps.length;
  };

  InteractiveCard.prototype._showScene = function (i) {
    var self = this;
    this.narrIdx = i;
    this._stopAudio();
    this.gotoStep(i);
    var st = this.opt.steps[i];
    var text = st.narration || st.caption || '';
    if (this.captionEl) this.captionEl.textContent = text;
    this._updateProgress();
    if (!this.narrPlaying) return;

    if (st.audio) {
      var audio = new Audio(st.audio);
      this.narrAudio = audio;
      audio.addEventListener('ended', function () {
        setTimeout(function () { if (self.narrPlaying) self.narrNext(); }, 550);
      });
      audio.addEventListener('error', function () {
        self.narrAudio = null;
        self._fallbackTimer(text);
      });
      audio.play().catch(function () {
        self.narrAudio = null;
        self._fallbackTimer(text);
      });
    } else {
      this._fallbackTimer(text);
    }
  };

  InteractiveCard.prototype._fallbackTimer = function (text) {
    var self = this;
    if (this.narrTimer) clearTimeout(this.narrTimer);
    var t = text || (this.opt.steps[this.narrIdx] && this.opt.steps[this.narrIdx].caption) || '';
    var ms = Math.max(2600, t.length * 210);
    this.narrTimer = setTimeout(function () {
      if (self.narrPlaying) self.narrNext();
    }, ms);
  };

  /* ---------- 响应式缩放（手机上按卡片宽度等比缩放 GeoGebra 画布） ---------- */

  InteractiveCard.prototype._fitStage = function () {
    var stage = this.stageEl;
    if (!stage) return;
    var scaler = stage.querySelector('.applet_scaler');
    if (!scaler) return;
    var designW = this.opt.width || 820;
    var designH = this.opt.height || 480;
    var w = stage.clientWidth;
    if (!w) return;
    var scale = Math.min(1, w / designW);
    scaler.style.transformOrigin = '0 0';
    scaler.style.transform = 'scale(' + scale + ')';
    stage.style.height = Math.round(designH * scale) + 'px';
    stage.style.minHeight = '0';
    stage.style.overflow = 'hidden';
  };

  InteractiveCard.prototype._setupFit = function () {
    var self = this;
    this._fitStage();
    window.addEventListener('resize', function () { self._fitStage(); });
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(function () { self._fitStage(); });
      this._ro.observe(this.stageEl);
    }
    // 影院模式开合会改变容器宽度，延时再拟合一次
    this._fitAfter = function () {
      self._fitStage();
      setTimeout(function () { self._fitStage(); }, 60);
    };
  };

  InteractiveCard.prototype._bindTabs = function (container) {
    var self = this;
    var tabs = container.querySelectorAll('.ggb-tabs button:not(.ggb-narrate-btn)');
    Array.prototype.forEach.call(tabs, function (btn, i) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        self.setMode(i === 0 ? 'explore' : 'steps');
      });
    });
  };

  InteractiveCard.prototype._buildStepButtons = function () {
    var self = this;
    if (!this.stepsEl || !this.opt.steps) return;
    var bar = this.stepsEl.querySelector('.ggb-step-btns');
    if (!bar) return;
    bar.innerHTML = '';
    this.opt.steps.forEach(function (st, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = (i + 1) + '. ' + st.label;
      b.addEventListener('click', function () { self.gotoStep(i); });
      bar.appendChild(b);
    });
    // “全部显示”按钮
    var all = document.createElement('button');
    all.type = 'button';
    all.textContent = '全部显示';
    all.addEventListener('click', function () { self.gotoStep(self.opt.steps.length); });
    bar.appendChild(all);
  };

  InteractiveCard.prototype.setMode = function (mode) {
    this.mode = mode;
    if (mode === 'explore') {
      if (this.stepsEl) this.stepsEl.classList.remove('visible');
      if (this.opt.onExplore && this.api) {
        this.opt.onExplore(this.api);
      } else {
        this._showAll(true);
      }
      if (this.captionEl && this.opt.exploreCaption) {
        this.captionEl.textContent = this.opt.exploreCaption;
      }
    } else {
      if (this.stepsEl) this.stepsEl.classList.add('visible');
      this.gotoStep(0);
    }
  };

  InteractiveCard.prototype._showAll = function (visible) {
    if (!this.api || !this.opt.allObjects) return;
    var api = this.api;
    var self = this;
    this.opt.allObjects.forEach(function (name) {
      if (self.alwaysVisible.indexOf(name) >= 0) return;
      try { api.setVisible(name, visible); } catch (e) { }
    });
  };

  InteractiveCard.prototype.gotoStep = function (idx) {
    var self = this;
    if (!this.api || !this.opt.steps) return;
    this.stepIdx = idx;

    var btns = this.stepsEl ? this.stepsEl.querySelectorAll('.ggb-step-btns button') : [];
    Array.prototype.forEach.call(btns, function (b, i) {
      b.classList.toggle('active', i === idx);
    });

    // 逐步累积显示：第 i 步显示前 i 步的所有对象
    if (idx >= this.opt.steps.length) {
      // 全部显示
      this._showAll(true);
      if (this.captionEl) this.captionEl.textContent = '全部构造已显示。';
      return;
    }

    this._showAll(false);
    for (var i = 0; i <= idx; i++) {
      var st = this.opt.steps[i];
      (st.show || []).forEach(function (name) {
        try { self.api.setVisible(name, true); } catch (e) { }
      });
      (st.hide || []).forEach(function (name) {
        if (self.alwaysVisible.indexOf(name) >= 0) return;
        try { self.api.setVisible(name, false); } catch (e) { }
      });
    }
    // 常显控件保证可见
    this.alwaysVisible.forEach(function (name) {
      try { self.api.setVisible(name, true); } catch (e) { }
    });
    if (this.captionEl) {
      this.captionEl.textContent = this.opt.steps[idx].caption || '';
    }
    if (this.opt.steps[idx].onEnter) {
      this.opt.steps[idx].onEnter(this.api);
    }
  };

  global.InteractiveCard = InteractiveCard;

  /* ---------- 公共构造小工具（供各例题脚本使用） ---------- */

  var GGB = {};

  /** 批量执行命令 */
  GGB.run = function (api, lines) {
    lines.forEach(function (line) {
      try { api.evalCommand(line); } catch (e) { console.warn('cmd fail:', line, e); }
    });
  };

  /** 设置对象标签样式：0 隐藏 1 名称 2 值 3 名称=值 */
  GGB.label = function (api, name, style) {
    try { api.setLabelStyle(name, style); } catch (e) { }
  };

  /** 颜色（按设计色板编号 → RGB） */
  var PALETTE = {
    2: [31, 41, 55],      // 墨色：结构线/杆件
    4: [37, 99, 235],     // 物理蓝：约束力、辅助线强调
    8: [156, 163, 175],   // 浅灰：辅助线
    10: [220, 38, 38],    // 力红：重力
    13: [245, 158, 11]    // 琥珀：合力/力矩
  };
  GGB.color = function (api, name, idx) {
    var rgb = PALETTE[idx] || [0, 0, 0];
    try { api.setColor(name, rgb[0], rgb[1], rgb[2]); } catch (e) { }
  };

  /** 线宽 */
  GGB.thick = function (api, name, w) {
    try { api.setLineThickness(name, w); } catch (e) { }
  };

  /** 点大小 */
  GGB.size = function (api, name, s) {
    try { api.setPointSize(name, s); } catch (e) { }
  };

  /** 隐藏对象 */
  GGB.hide = function (api, names) {
    (Array.isArray(names) ? names : [names]).forEach(function (n) {
      try { api.setVisible(n, false); } catch (e) { }
    });
  };

  /** 显示对象 */
  GGB.show = function (api, names) {
    (Array.isArray(names) ? names : [names]).forEach(function (n) {
      try { api.setVisible(n, true); } catch (e) { }
    });
  };

  /** 设置视野：隐藏坐标轴/网格，指定可见范围 */
  GGB.view = function (api, xmin, xmax, ymin, ymax) {
    try {
      api.setAxesVisible(false, false);
      api.setGridVisible(false);
      api.setCoordSystem(xmin, xmax, ymin, ymax);
    } catch (e) { console.warn('view cfg', e); }
  };

  /** 创建滑块（数字） */
  GGB.slider = function (api, name, min, max, val, step, x, y, caption) {
    api.evalCommand(name + '=' + val);
    try {
      api.setSliderMin(name, min);
      api.setSliderMax(name, max);
      api.setSliderStep(name, step || 0.01);
      api.setCaption(name, caption || name);
      api.setLabelStyle(name, 3);
      if (x !== undefined) api.setCoords(name, x, y);
    } catch (e) { console.warn('slider cfg', name, e); }
  };

  global.GGB = GGB;

})(window);
