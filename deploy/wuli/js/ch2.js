/* ============================================================
   ch2.js — 第二章 GGB 交互（oPhysics 先算后验）
   ============================================================ */

(function () {
  'use strict';

  function addMarks(api, defs) {
    var lines = defs.map(function (d) {
      return "'" + d[0] + " = Text(\"" + d[1] + "\", " + d[2] + ")',";
    });
    GGB.run(api, lines);
    defs.forEach(function (d) {
      GGB.color(api, d[0], 13);
      try { api.setVisible(d[0], false); } catch (e) { }
      try { api.setLabelVisible(d[0], false); } catch (e) { }
      try { api.setFontSize(d[0], 14); } catch (e) { }
    });
  }

  function cfg(id, title, buildFn, steps, controls, allObj, explore, epilogue, opts) {
    opts = opts || {};
    return {
      container: id,
      appId: 'ggb' + id.replace(/-/g, ''),
      width: 820,
      height: opts.height || 450,
      commands: buildFn,
      steps: steps,
      narration: { title: title, epilogue: epilogue },
      controls: controls,
      allObjects: allObj,
      exploreCaption: explore,
      onExplore: function (api) { GGB.show(api, allObj); }
    };
  }

  /* ================= 旗舰：五节 圆切线极值 ================= */
  function buildS5E1(api) {
    GGB.run(api, [
      'F1 = 4', 'F2 = 2', 'th = 40', 'k = 0.62',
      'O = (0, 0)',
      'P1 = (k F1, 0)',
      'circ = Circle(P1, k * F2)',
      'Ft = P1 + (k * F2) * (-cos(th°), sin(th°))',
      'F1v = Vector(O, P1)',
      'F2v = Vector(P1, Ft)',
      'Fv = Vector(O, Ft)',
      'bet = atan(y(Ft) / x(Ft))',
      'betmax = asin(F2 / F1)',
      'thopt = 180° - acos(F2 / F1)',
      'Topt = (k * sqrt(F1^2 - F2^2)) * (cos(betmax), sin(betmax))',
      'Fmax = Vector(O, Topt)',
      'F2t = Vector(P1, Topt)',
      'rayMax = Line(O, O + 3.2 * (cos(betmax), sin(betmax)))',
      'info = Text("β = " + round(180 bet / pi, 1) + "°    βmax = " + round(180 betmax / pi, 1) + "°", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', '以 F₁ 末端为圆心、F₂ 为半径画圆', '(-3.2, 2.25)'],
      ['mk2', 'F 与圆相切时 β 最大 = arcsin(F₂/F₁)', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'F1v', 4); GGB.thick(api, 'F1v', 4);
    GGB.color(api, 'F2v', 10); GGB.thick(api, 'F2v', 4);
    GGB.color(api, 'Fv', 2); GGB.thick(api, 'Fv', 4);
    GGB.color(api, 'circ', 8); GGB.thick(api, 'circ', 1);
    GGB.color(api, 'Fmax', 13); GGB.thick(api, 'Fmax', 3);
    GGB.color(api, 'F2t', 13); GGB.thick(api, 'F2t', 3);
    GGB.color(api, 'rayMax', 13); GGB.thick(api, 'rayMax', 1);
    ['P1', 'O', 'Ft', 'Topt'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['F1', 'F2', 'th', 'k', 'P1', 'Ft', 'bet', 'betmax', 'thopt', 'Topt', 'Fmax', 'F2t', 'rayMax']);
    GGB.view(api, -3.6, 4.2, -3.2, 3.2);
    try { api.setCoords('F1', -3.5, 2.8); } catch (e) { }
  }

  var S5_STEPS = [
    {
      label: '画圆定合力端点', show: ['F1v', 'F2v', 'Fv', 'circ', 'mk1', 'info'],
      caption: 'F₁ 末端为圆心、F₂ 为半径画圆，合力 F 的端点始终在圆周上。',
      key: '合力端点在圆周上',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '以F一的末端为圆心、F二的大小为半径画一个圆。无论夹角怎么变，合力F的端点始终落在圆周上。',
      audio: '../assets/audio/c2s5-1.mp3'
    },
    {
      label: '相切时 β 最大', show: ['F1v', 'F2v', 'Fv', 'circ', 'Fmax', 'F2t', 'rayMax', 'mk2', 'info'],
      caption: 'F 与圆相切时 F 与 F₁ 的夹角 β 最大：β = arcsin(F₂/F₁)。',
      key: 'βmax = arcsin(F₂/F₁)',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '当合力F与圆相切时，F与F一的夹角贝塔达到最大，贝塔max等于arcsinF二比F一。橙色切线就是极限方向。',
      audio: '../assets/audio/c2s5-2.mp3'
    },
    {
      label: '写出 θ 与 β', show: ['F1v', 'F2v', 'Fv', 'circ', 'Fmax', 'F2t', 'rayMax', 'info', 'mk2'],
      caption: '此时 F₁ 与 F₂ 的夹角 θ = 180° − arccos(F₂/F₁)。拖 F₂ 对照读数。',
      key: 'θ = 180° − arccos(F₂/F₁)',
      narration: '此时F一与F二的夹角西塔等于一百八十度减arccosF二比F一。拖动F二滑块，读数始终与公式一致。',
      audio: '../assets/audio/c2s5-3.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s5e1', '例题 · 圆切线求极值角', buildS5E1, S5_STEPS, [
    { name: 'F1', label: 'F₁', min: 2, max: 5, step: 0.1, value: 4, fmt: function (v) { return v.toFixed(1); } },
    { name: 'F2', label: 'F₂', min: 0.5, max: 1.8, step: 0.05, value: 2, fmt: function (v) { return v.toFixed(2); } }
  ], ['F1v', 'F2v', 'Fv', 'circ', 'Fmax', 'F2t', 'rayMax', 'mk1', 'mk2', 'info'],
    '先算后验：βmax = arcsin(F₂/F₁)。拖 F₂ 对照读数，橙色切线即极限方向。',
    { text: '普遍性：只要 F₁>F₂，切线极值总是 arcsin(F₂/F₁)，与具体数值无关。', audio: '../assets/audio/c2s5-4.mp3', slider: 'F2', from: 0.5, to: 1.8, duration: 3000 }));

  /* ================= 一节例1 绳上移，T、N 变小 ================= */
  function buildS1E1(api) {
    GGB.run(api, [
      'Gm = 3', 'phi = 25', 'k = 0.42',
      'Tm = Gm / sin(phi°)',
      'Nm = Gm / tan(phi°)',
      'A = (0, 0)',
      'Gv = Vector(A, A + (0, -k Gm))',
      'Tv = Vector(A, A + k Tm (cos(phi°), sin(phi°)))',
      'Nv = Vector(A, A + k Nm (-1, 0))',
      'rod = Segment(A, A + (2.2, 0))',
      'P0 = (3.1, -2.2)',
      'P1 = P0 + (0, -k Gm)',
      'P2 = P1 + k Nm (-1, 0)',
      't1 = Vector(P0, P1)',
      't2 = Vector(P1, P2)',
      't3 = Vector(P2, P0)',
      'info = Text("T = " + round(Tm, 2) + "，N = " + round(Nm, 2), (-2.6, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'F、N、T 组成闭合矢量三角形', '(-2.6, 2.25)'],
      ['mk2', 'φ 变大 ⇒ T、N 都变小', '(-2.6, -2.9)'],
    ]);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'Tv', 4); GGB.thick(api, 'Tv', 4);
    GGB.color(api, 'Nv', 2); GGB.thick(api, 'Nv', 4);
    GGB.thick(api, 'rod', 6); GGB.color(api, 'rod', 2);
    ['t1', 't3'].forEach(function (n) { GGB.color(api, n, 2); GGB.thick(api, n, 3); });
    GGB.color(api, 't2', 10); GGB.thick(api, 't2', 3);
    ['A', 'P0', 'P1', 'P2'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['Gm', 'phi', 'k', 'Tm', 'Nm', 'P0', 'P1', 'P2']);
    GGB.view(api, -3.2, 5.2, -3.2, 3.1);
    try { api.setCoords('phi', -3.1, 2.8); } catch (e) { }
  }

  var S1E1_STEPS = [
    {
      label: '受力与闭合三角形', show: ['rod', 'Gv', 'Tv', 'Nv', 't1', 't2', 't3', 'mk1', 'info'],
      caption: 'A 点受 F(=G)、N、T 三力平衡，必构成闭合矢量三角形。',
      key: '三力闭合成三角形',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: 'A点受重物拉力、杆的支持力和绳的拉力，三力平衡，必组成一个闭合的矢量三角形。',
      audio: '../assets/audio/c2s1e1-1.mp3'
    },
    {
      label: '角变大则收缩', show: ['rod', 'Gv', 'Tv', 'Nv', 't1', 't2', 't3', 'mk2', 'info'],
      caption: '绳上移 ⇒ T 与水平夹角变大 ⇒ 三角形收缩，T、N 均变小。',
      key: 'φ 变大，T、N 变小',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '绳的固定点上移，T与水平的夹角变大，三角形收缩，所以T和N都变小。',
      audio: '../assets/audio/c2s1e1-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e1', '例1 · 绳上移 T、N 变小', buildS1E1, S1E1_STEPS, [
    { name: 'phi', label: 'φ', min: 10, max: 75, step: 1, value: 25, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['rod', 'Gv', 'Tv', 'Nv', 't1', 't2', 't3', 'mk1', 'mk2', 'info'],
    '先算后验：T = G/sinφ，N = G/tanφ。拖 φ 看三角形收缩、读数变小。',
    { text: '普遍性：φ→90° 时 N→0、T→G，绳越竖直杆越轻松。', audio: '../assets/audio/c2s1e1-3.mp3', slider: 'phi', from: 10, to: 75, duration: 3200 }));

  /* ================= 一节例2 悬挂点移动：T_A 先减后增 ================= */
  function buildS1E2(api) {
    GGB.run(api, [
      'Gm = 3', 'angn = 20', 'k = 0.4',
      'P0 = (0, 0)',
      'Gtip = P0 + (0, -k Gm)',
      'LA = Line(P0, P0 + 3 (-sin(angn°), cos(angn°)))',
      'LB = Line(Gtip, Gtip + 3 (sin(40°), cos(40°)))',
      'X = Intersect(LA, LB)',
      'TAv = Vector(P0, X)',
      'TBv = Vector(Gtip, X)',
      'Gv = Vector(P0, Gtip)',
      'TAm = Distance(P0, X) / k',
      'TBm = Distance(Gtip, X) / k',
      'circ = Circumference(P0, 2.6)',
      'info = Text("T_A = " + round(TAm, 2) + "，T_B = " + round(TBm, 2), (-3.4, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'G 不变、T_B 方向不变', '(-3.4, 2.25)'],
      ['mk2', 'T_A 先减后增，T_B 单调增大', '(-3.4, -2.9)'],
    ]);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'TAv', 4); GGB.thick(api, 'TAv', 4);
    GGB.color(api, 'TBv', 2); GGB.thick(api, 'TBv', 4);
    GGB.color(api, 'circ', 8); GGB.thick(api, 'circ', 1);
    ['LA', 'LB'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    ['P0', 'Gtip', 'X'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['Gm', 'angn', 'k', 'P0', 'Gtip', 'X', 'TAm', 'TBm', 'LA', 'LB']);
    GGB.view(api, -3.8, 3.8, -3.4, 3.1);
    try { api.setCoords('angn', -3.7, 2.8); } catch (e) { }
  }

  var S1E2_STEPS = [
    {
      label: '闭合三角形随角度变', show: ['Gv', 'TAv', 'TBv', 'circ', 'mk1', 'info'],
      caption: 'G 大小方向不变、T_B 方向不变，T_A 方向随悬挂点移动而变。',
      key: 'G 与 T_B 方向不变',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重力大小方向不变，BO绳拉力方向不变，只有AO绳的方向在变，三角形随之变形。',
      audio: '../assets/audio/c2s1e2-1.mp3'
    },
    {
      label: '读出 U 形规律', show: ['Gv', 'TAv', 'TBv', 'circ', 'mk2', 'info'],
      caption: '拖动角度：T_A 先减后增（U 形），T_B 单调增大——即答案 C。',
      key: 'T_A 先减后增 ⇒ 选 C',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '拖动滑块可以看到：AO绳拉力先减小后增大，BO绳拉力单调增大。这道题答案是C。',
      audio: '../assets/audio/c2s1e2-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e2', '例2 · 悬挂点移动的 U 形规律', buildS1E2, S1E2_STEPS, [
    { name: 'angn', label: '∠(AO,竖直)', min: 5, max: 80, step: 1, value: 20, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['Gv', 'TAv', 'TBv', 'circ', 'mk1', 'mk2', 'info'],
    '先算后验：T_A = G·sin40°/sin(∠A+40°) 呈 U 形。拖动角度看读数先降后升。',
    { text: '普遍性：T_A 极小出现在两绳方向对称于竖直时。', audio: '../assets/audio/c2s1e2-3.mp3', slider: 'angn', from: 5, to: 80, duration: 3200 }));

  /* ================= 一节例7 带长带短 ================= */
  function buildS1E7(api) {
    GGB.run(api, [
      'll = 1.6', 'Gm = 3', 'w = 1.0', 'k = 0.55',
      'hh = sqrt(ll^2 - (w / 2)^2)',
      'Tm = Gm ll / (2 hh)',
      'A = (0, k hh)',
      'B = (-k w / 2, 0)',
      'Cc = (k w / 2, 0)',
      's1 = Segment(A, B)', 's2 = Segment(A, Cc)',
      'bag = Segment(B, Cc)',
      'Gv = Vector((0, 0), (0, -k Gm))',
      'T1v = Vector(B, B + k Tm (w / 2 / ll, hh / ll))',
      'T2v = Vector(Cc, Cc + k Tm (-w / 2 / ll, hh / ll))',
      'info = Text("T = " + round(Tm, 2) + "（带越长越小）", (-2.8, 2.8))',
    ]);
    addMarks(api, [
      ['mk1', 'T = G·l / (2h)，带长 h/l 大 ⇒ T 小', '(-2.8, 2.35)'],
      ['mk2', '带短时受力大，易断', '(-2.8, -2.9)'],
    ]);
    ['s1', 's2'].forEach(function (n) { GGB.color(api, n, 2); GGB.thick(api, n, 2.2); });
    GGB.thick(api, 'bag', 5); GGB.color(api, 'bag', 2);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    ['T1v', 'T2v'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 3); });
    ['A', 'B', 'Cc'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['ll', 'Gm', 'w', 'k', 'hh', 'Tm']);
    GGB.view(api, -2.6, 2.6, -3.1, 3.1);
    try { api.setCoords('ll', -2.5, 2.8); } catch (e) { }
  }

  var S1E7_STEPS = [
    {
      label: '带长带短对比', show: ['s1', 's2', 'bag', 'Gv', 'T1v', 'T2v', 'mk1', 'info'],
      caption: '带长则带与竖直夹角小，T = G·l/(2h) 小；带短则 T 大。',
      key: 'T = G·l/(2h)',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '带子越长，带与竖直方向的夹角越小，拉力T等于Gl除以2h也就越小。',
      audio: '../assets/audio/c2s1e7-1.mp3'
    },
    {
      label: '结论：短带易断', show: ['s1', 's2', 'bag', 'Gv', 'T1v', 'T2v', 'mk2', 'info'],
      caption: '拖动带长：带越短读数越大——带短时易断。',
      key: '带短受力大，易断',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '拖动带长滑块：带越短，读数越大。所以带短时受力较大，容易断；带长时受力较小，不易断。',
      audio: '../assets/audio/c2s1e7-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e7', '例7 · 带长带短哪根易断', buildS1E7, S1E7_STEPS, [
    { name: 'll', label: '带长 l', min: 0.85, max: 2.5, step: 0.05, value: 1.6, fmt: function (v) { return v.toFixed(2); } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['s1', 's2', 'bag', 'Gv', 'T1v', 'T2v', 'mk1', 'mk2', 'info'],
    '先算后验：T = G·l/(2h)。拖带长看读数：越长越小。',
    { text: '普遍性：同样的包，长带比短带省力——几何分配力。', audio: '../assets/audio/c2s1e7-3.mp3', slider: 'll', from: 0.85, to: 2.5, duration: 3200 }));

  /* ================= 二节例1 斜抛射程射高（含飞行动画） ================= */
  function buildS2E1(api) {
    GGB.run(api, [
      'v0 = 12', 'ang = 45', 'gg = 10', 'tt = 0', 'k = 0.16',
      'TT = 2 v0 sin(ang°) / gg',
      'rng = v0^2 sin(2 ang°) / gg',
      'hh = v0^2 sin(ang°)^2 / (2 gg)',
      'A = (0, 0)',
      'Bv = (k v0 TT cos(ang°), k v0 TT sin(ang°))',
      'Cv = (k v0 TT cos(ang°), 0)',
      'traj = Curve((k v0 cos(ang°) t, k (v0 sin(ang°) t - 0.5 gg t^2)), t, 0, TT)',
      'pt = (k v0 cos(ang°) tt, k (v0 sin(ang°) tt - 0.5 gg tt^2))',
      'P0 = (-3.1, -1.2)',
      'P1 = P0 + (k v0 TT cos(ang°), k v0 TT sin(ang°))',
      'P2 = P1 + (0, -k 0.5 gg TT^2)',
      'q1 = Vector(P0, P1)',
      'q2 = Vector(P1, P2)',
      'q3 = Vector(P2, P0)',
      'info = Text("T = " + round(TT, 2) + " s，射程 " + round(rng, 2) + " m，射高 " + round(hh, 2) + " m", (-3.6, 2.85))',
    ]);
    addMarks(api, [
      ['mk1', '斜抛 = 沿 v₀ 匀速 + 自由落体', '(-3.6, 2.4)'],
      ['mk2', 'T = 2v₀sinθ/g，x = v₀²sin2θ/g', '(-3.6, -2.9)'],
    ]);
    GGB.color(api, 'traj', 8); GGB.thick(api, 'traj', 2);
    GGB.color(api, 'pt', 10); GGB.size(api, 'pt', 8);
    ['q1', 'q3'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 3); });
    GGB.color(api, 'q2', 10); GGB.thick(api, 'q2', 3);
    ['A', 'Bv', 'Cv', 'P0', 'P1', 'P2'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['v0', 'ang', 'gg', 'tt', 'k', 'TT', 'rng', 'hh', 'A', 'Bv', 'Cv', 'P0', 'P1', 'P2']);
    GGB.view(api, -3.8, 3.8, -3.2, 3.2);
    try { api.setCoords('v0', -3.7, 2.9); } catch (e) { }
  }

  var S2E1_STEPS = [
    {
      label: '分解为两个分运动', show: ['traj', 'pt', 'mk1', 'info'],
      caption: '斜抛 = 沿 v₀ 方向匀速直线 + 竖直自由落体，两者合成即轨迹。',
      key: '匀速 + 自由落体',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '斜抛运动可以看成沿初速度方向的匀速直线运动，和竖直方向自由落体运动的合运动。',
      audio: '../assets/audio/c2s2e1-1.mp3'
    },
    {
      label: '位移矢量三角形', show: ['q1', 'q2', 'q3', 'mk2', 'info', 'traj'],
      caption: 's_AB = v₀T，s_BC = ½gT²，合位移即射程；由 ½gT² = v₀T sinθ 得 T。',
      key: 'T = 2v₀sinθ/g',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '位移矢量三角形中，自由落体位移等于匀速位移乘sin西塔，立刻解出T等于二v零sin西塔除以g，射程x等于v零平方sin二西塔除以g。',
      audio: '../assets/audio/c2s2e1-2.mp3'
    },
    {
      label: '看飞行动画', show: ['traj', 'pt', 'q1', 'q2', 'q3', 'info', 'mk2'],
      caption: '拖动时间滑块（或看尾声自动飞行），读数始终符合公式。',
      key: '拖时间滑块看飞行',
      narration: '拖动时间滑块看小球飞行，射程、射高读数始终与公式一致，这就是先算后验。',
      audio: '../assets/audio/c2s2e1-3.mp3',
      anim: { slider: 'tt', from: 0, to: 1.7, duration: 3000 }
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s2e1', '例1 · 斜抛的射程与射高', buildS2E1, S2E1_STEPS, [
    { name: 'v0', label: 'v₀', min: 5, max: 16, step: 0.5, value: 12, fmt: function (v) { return v.toFixed(1); } },
    { name: 'ang', label: 'θ', min: 15, max: 75, step: 1, value: 45, fmt: function (v) { return v.toFixed(0) + '°'; } }
  ], ['traj', 'pt', 'q1', 'q2', 'q3', 'mk1', 'mk2', 'info'],
    '先算后验：T = 2v₀sinθ/g、x = v₀²sin2θ/g。拖 v₀、θ 对照读数；θ=45° 射程最大。',
    { text: '普遍性：θ=45° 时射程最大；θ 与 90°−θ 射程相同。', audio: '../assets/audio/c2s2e1-4.mp3', slider: 'ang', from: 15, to: 75, duration: 3200 }, { height: 480 }));

  /* ================= 三节例1 雨中车不淋湿 ================= */
  function buildS3E1(api) {
    GGB.run(api, [
      'th = 30', 'v1 = 6', 'v2 = 4', 'k = 0.35',
      'Lr = 1', 'hr = 0.6',
      'need = v2 (Lr / hr cos(th°) + sin(th°))',
      'O = (0, 0)',
      'v1v = Vector(O, O + k v1 (-1, 0))',
      'v2v = Vector(O + k v1 (-1, 0), O + k v1 (-1, 0) + k v2 (sin(th°), -cos(th°)))',
      'v3v = Vector(O, O + k v1 (-1, 0) + k v2 (sin(th°), -cos(th°)))',
      'bagx = 2.6',
      'bag = Rectangle((bagx, -1.2), 1.1, 1.2)',
      'lnA = Line((bagx, -1.2), (bagx + 1.1, 0))',
      'info = Text("需 v₁ ≥ " + round(need, 2) + "，现 v₁ = " + round(v1, 2) + "  " + If(v1 >= need, "不淋湿 ✓", "会淋湿 ✗"), (-3.4, 2.8))',
    ]);
    addMarks(api, [
      ['mk1', '以车为参照物：v₃ = v₁(左) + v₂(斜下)', '(-3.4, 2.35)'],
      ['mk2', '不淋湿条件：v₁ ≥ v₂(L/h·cosθ + sinθ)', '(-3.4, -2.9)'],
    ]);
    GGB.color(api, 'v1v', 2); GGB.thick(api, 'v1v', 4);
    GGB.color(api, 'v2v', 4); GGB.thick(api, 'v2v', 4);
    GGB.color(api, 'v3v', 10); GGB.thick(api, 'v3v', 4);
    GGB.color(api, 'bag', 2); GGB.thick(api, 'bag', 2);
    GGB.color(api, 'lnA', 13); GGB.thick(api, 'lnA', 1);
    ['O'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['th', 'v1', 'v2', 'k', 'Lr', 'hr', 'need', 'O']);
    GGB.view(api, -3.6, 4.6, -3.2, 3.2);
    try { api.setCoords('v1', -3.5, 2.9); } catch (e) { }
  }

  var S3E1_STEPS = [
    {
      label: '相对速度三角形', show: ['v1v', 'v2v', 'v3v', 'mk1', 'info'],
      caption: '以车为参照物，雨滴 = 向左 v₁ + 斜向下 v₂，合速 v₃。',
      key: 'v₃ = v₁ + v₂（相对运动）',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '以车为参照物，雨滴一方面以v一向左运动，一方面以v二斜向下运动，合速度v三由矢量三角形决定。',
      audio: '../assets/audio/c2s3e1-1.mp3'
    },
    {
      label: '几何条件定车速', show: ['bag', 'lnA', 'v1v', 'v2v', 'v3v', 'mk2', 'info'],
      caption: '行李不被淋湿需 β ≤ α，即 v₁ ≥ v₂(L/h·cosθ + sinθ)。拖 v₁ 验证。',
      key: 'v₁ ≥ v₂(L/h·cosθ+sinθ)',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '行李不被淋湿的条件是相对速度方向落在行李的几何角内，解出车速必须大于v二乘L比h cos西塔加sin西塔。',
      audio: '../assets/audio/c2s3e1-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s3e1', '例1 · 车速多大不淋湿', buildS3E1, S3E1_STEPS, [
    { name: 'v1', label: 'v₁', min: 1, max: 12, step: 0.1, value: 6, fmt: function (v) { return v.toFixed(1); } },
    { name: 'th', label: 'θ(雨)', min: 10, max: 70, step: 1, value: 30, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'v2', label: 'v₂', min: 2, max: 8, step: 0.1, value: 4, fmt: function (v) { return v.toFixed(1); } }
  ], ['bag', 'lnA', 'v1v', 'v2v', 'v3v', 'mk1', 'mk2', 'info'],
    '先算后验：拖 v₁ 直到读数变为「不淋湿 ✓」，对照公式下限。',
    { text: '普遍性：雨越斜（θ 大）、行李越矮胖（L/h 小），越容易不淋湿。', audio: '../assets/audio/c2s3e1-3.mp3', slider: 'v1', from: 1, to: 12, duration: 3200 }));

  /* ================= 三节例5 绳拉船 ================= */
  function buildS3E5(api) {
    GGB.run(api, [
      'th = 35', 'v0 = 2', 'Oy = 2.1', 'k = 0.5',
      'Ax = Oy / tan(th°)',
      'vx = v0 / cos(th°)',
      'O = (0, Oy)',
      'A = (Ax, 0)',
      'rope = Segment(O, A)',
      'wline = Segment((-1.6, 0), (3.2, 0))',
      'boat = Rectangle((Ax - 0.75, -0.28), 1.5, 0.28)',
      'v0v = Vector(A, A + k v0 (-cos(th°), sin(th°)))',
      'vxv = Vector(A, A + k vx (1, 0))',
      'vthv = Vector(A, A + k v0 (sin(th°), cos(th°)))',
      'info = Text("v_x = v₀/cosθ = " + round(vx, 2), (-2.6, 2.8))',
    ]);
    addMarks(api, [
      ['mk1', '船速沿绳、垂直绳分解', '(-2.6, 2.35)'],
      ['mk2', 'v_x = v₀/cosθ：绳越平，船越快', '(-2.6, -2.6)'],
    ]);
    GGB.color(api, 'rope', 2); GGB.thick(api, 'rope', 2.2);
    GGB.color(api, 'boat', 2); GGB.thick(api, 'boat', 2);
    GGB.color(api, 'wline', 8); GGB.thick(api, 'wline', 1.5);
    GGB.color(api, 'v0v', 4); GGB.thick(api, 'v0v', 4);
    GGB.color(api, 'vxv', 10); GGB.thick(api, 'vxv', 4);
    GGB.color(api, 'vthv', 2); GGB.thick(api, 'vthv', 3);
    ['O', 'A'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['th', 'v0', 'Oy', 'k', 'Ax', 'vx']);
    GGB.view(api, -2.4, 3.6, -2.9, 3.2);
    try { api.setCoords('th', -2.3, 2.9); } catch (e) { }
  }

  var S3E5_STEPS = [
    {
      label: '速度分解', show: ['rope', 'boat', 'wline', 'v0v', 'vxv', 'vthv', 'mk1', 'info'],
      caption: '船速 v_x 分解为沿绳 v₀ 与垂直绳 v_θ，绳不可伸长 ⇒ 沿绳分速 = v₀。',
      key: 'v_x 沿绳分量 = v₀',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '船的实际速度可以分解为沿绳方向和垂直绳方向，由于绳不可伸长，沿绳分量就等于拉绳速度v零。',
      audio: '../assets/audio/c2s3e5-1.mp3'
    },
    {
      label: '得出 v_x = v₀/cosθ', show: ['rope', 'boat', 'wline', 'v0v', 'vxv', 'vthv', 'mk2', 'info'],
      caption: '由三角形：v_x = v₀/cosθ。θ 变小（船远去）时 v_x 迅速增大。',
      key: 'v_x = v₀/cosθ',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '由速度三角形立刻得到v_x等于v零除以cosine西塔。船越远，绳越平，同样的拉绳速度对应的船速越快。',
      audio: '../assets/audio/c2s3e5-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s3e5', '例5 · 绳拉船的速度', buildS3E5, S3E5_STEPS, [
    { name: 'th', label: 'θ', min: 10, max: 75, step: 1, value: 35, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'v0', label: 'v₀', min: 0.5, max: 5, step: 0.1, value: 2, fmt: function (v) { return v.toFixed(1); } }
  ], ['rope', 'boat', 'wline', 'v0v', 'vxv', 'vthv', 'mk1', 'mk2', 'info'],
    '先算后验：v_x = v₀/cosθ。拖 θ 看船滑动、读数变化。',
    { text: '普遍性：θ→0 时 v_x→∞——拉绳模型中船速可远大于绳速。', audio: '../assets/audio/c2s3e5-3.mp3', slider: 'th', from: 75, to: 12, duration: 3200 }));

  /* ================= 四节例1 转台摩擦力冲量 ================= */
  function buildS4E1(api) {
    GGB.run(api, [
      'om = 2', 'R = 1.2', 'mm = 1', 'gam = 20', 'k = 0.5',
      'vv = om R',
      'J = sqrt(2) mm om R',
      'O = (0, 0)',
      'pt = (R cos(gam°), R sin(gam°))',
      'circ = Circumference(O, R)',
      'vv1 = Vector(pt, pt + k vv (-sin(gam°), cos(gam°)))',
      'P0 = (2.4, -2.3)',
      'p1 = Vector(P0, P0 + (k mm vv, 0))',
      'p2 = Vector(P0 + (k mm vv, 0), P0 + (k mm vv, k mm vv))',
      'dp = Vector(P0, P0 + (k mm vv, k mm vv))',
      'info = Text("v = ωR = " + round(vv, 2) + "，冲量 = √2 mωR = " + round(J, 2), (-3.2, 2.85))',
    ]);
    addMarks(api, [
      ['mk1', '转 1/4 圈：速度方向改变 90°', '(-3.2, 2.4)'],
      ['mk2', 'Δp = √2 mv ⇒ fΔt = √2 mωR', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'circ', 8); GGB.thick(api, 'circ', 1.5);
    GGB.color(api, 'pt', 2); GGB.size(api, 'pt', 7);
    GGB.color(api, 'vv1', 4); GGB.thick(api, 'vv1', 4);
    GGB.color(api, 'p1', 4); GGB.thick(api, 'p1', 3);
    GGB.color(api, 'p2', 2); GGB.thick(api, 'p2', 3);
    GGB.color(api, 'dp', 10); GGB.thick(api, 'dp', 3);
    ['O', 'pt', 'P0'].forEach(function (n) { try { api.setLabelVisible(n, false); } catch (e) { } });
    GGB.hide(api, ['om', 'R', 'mm', 'gam', 'k', 'vv', 'J', 'O', 'P0']);
    GGB.view(api, -3.6, 5.2, -3.3, 3.2);
    try { api.setCoords('om', -3.5, 2.9); } catch (e) { }
  }

  var S4E1_STEPS = [
    {
      label: '动量变化就是冲量', show: ['circ', 'pt', 'vv1', 'p1', 'p2', 'dp', 'mk1', 'info'],
      caption: '转过 1/4 圈速度方向变 90°：p₁、p₂ 大小不变，Δp 由三角形定。',
      key: 'Δp 就是摩擦力冲量',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '木块转过四分之一圆周，速度大小不变但方向改变九十度，动量变化量就是静摩擦力的冲量。',
      audio: '../assets/audio/c2s4e1-1.mp3'
    },
    {
      label: 'Δp = √2 mv', show: ['circ', 'pt', 'vv1', 'p1', 'p2', 'dp', 'mk2', 'info'],
      caption: '由动量三角形 Δp = √2 mv = √2 mωR，即摩擦力冲量。',
      key: '冲量 = √2 mωR',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '动量三角形是等腰直角三角形，动量变化等于根号二mv，也就是根号二m欧米伽R。',
      audio: '../assets/audio/c2s4e1-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s4e1', '例1 · 转台摩擦力冲量', buildS4E1, S4E1_STEPS, [
    { name: 'om', label: 'ω', min: 0.5, max: 5, step: 0.1, value: 2, fmt: function (v) { return v.toFixed(1); } },
    { name: 'mm', label: 'm', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'R', label: 'R', min: 0.6, max: 2, step: 0.1, value: 1.2, fmt: function (v) { return v.toFixed(1); } }
  ], ['circ', 'pt', 'vv1', 'p1', 'p2', 'dp', 'mk1', 'mk2', 'info'],
    '先算后验：冲量 = √2 mωR。拖 ω、m、R 对照读数；木块转 1/4 圈看方向变化 90°。',
    { text: '普遍性：冲量只看初末动量之差，与中间路径无关——动量定理的威力。', audio: '../assets/audio/c2s4e1-3.mp3', slider: 'gam', from: 20, to: 110, duration: 3200 }));

  window.__CH2_DONE = true;
})();
