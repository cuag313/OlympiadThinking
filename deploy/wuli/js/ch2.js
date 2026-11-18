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

  /* ========== 通用：三力三角形求交（G、固定向力、旋转向力） ========== */
  function triByIntersect(prefix, P0, gLen, dirLineA, dirLineB) {
    return [
      prefix + 'P0 = ' + P0,
      prefix + 'Gt = P0 + (0, -' + gLen + ')',
      prefix + 'LA = Line(' + prefix + 'P0, ' + prefix + 'P0 + ' + dirLineA + ')',
      prefix + 'LB = Line(' + prefix + 'Gt, ' + prefix + 'Gt + ' + dirLineB + ')',
      prefix + 'Xp = Intersect(' + prefix + 'LA, ' + prefix + 'LB)',
    ];
  }

  /* ================= 一节例3 中点挂重改挂偏点 ================= */
  function buildS1E3(api) {
    GGB.run(api, [
      'xpos = 0', 'Gm = 3', 'k = 0.4',
      'A = (-1.6, 1.9)', 'B = (1.6, 1.9)', 'X = (xpos, 0.2)',
      'ropeA = Segment(A, X)', 'ropeB = Segment(B, X)',
      'Gv = Vector(X, X + (0, -k Gm))',
      'LA = Line(X, X + (x(A) - x(X), y(A) - y(X)))',
      'LB = Line(X + (0, -k Gm), X + (0, -k Gm) + (x(B) - x(X), y(B) - y(X)))',
      'Xp = Intersect(LA, LB)',
      'TAv = Vector(X, Xp)',
      'TBv = Vector(X + (0, -k Gm), Xp)',
      'TAm = Distance(X, Xp) / k', 'TBm = Distance(X + (0, -k Gm), Xp) / k',
      'info = Text("T_A = " + round(TAm, 2) + "，T_B = " + round(TBm, 2), (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'G 不变，三角形随挂点变形', '(-3.2, 2.25)'],
      ['mk2', '挂点偏向 A ⇒ T_A 增大、T_B 减小', '(-3.2, -2.9)'],
    ]);
    ['ropeA', 'ropeB'].forEach(function (n) { GGB.color(api, n, 2); GGB.thick(api, n, 2.2); });
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'TAv', 4); GGB.thick(api, 'TAv', 4);
    GGB.color(api, 'TBv', 2); GGB.thick(api, 'TBv', 4);
    ['LA', 'LB'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    ['A', 'B', 'X'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['xpos', 'Gm', 'k', 'X', 'LA', 'LB', 'Xp', 'TAm', 'TBm']);
    GGB.view(api, -3.6, 3.6, -3.2, 2.6);
    try { api.setCoords('xpos', -3.5, 2.35); } catch (e) { }
  }

  var S1E3_STEPS = [
    {
      label: '三力闭合三角形', show: ['ropeA', 'ropeB', 'Gv', 'TAv', 'TBv', 'mk1', 'info'],
      caption: 'G 不变，T_A、T_B 方向随挂点变化，三角形随之变形。',
      key: '三角形随挂点变形',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重力大小方向不变，两根绳的拉力方向随挂点移动而变，闭合矢量三角形随之变形。',
      audio: '../assets/audio/c2s1e3-1.mp3'
    },
    {
      label: '偏向 A 则 T_A 大', show: ['ropeA', 'ropeB', 'Gv', 'TAv', 'TBv', 'mk2', 'info'],
      caption: '挂点向 A 移（AO 变短）：T_A′ > F₁，T_B′ < F₂，即答案 C。',
      key: 'T_A′>T_A，T_B′<T_B ⇒ 选 C',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '挂点偏向A一侧时，AO绳更陡更短，拉力变大；BO绳的拉力变小。答案选C。',
      audio: '../assets/audio/c2s1e3-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e3', '例3 · 中点挂重改挂偏点', buildS1E3, S1E3_STEPS, [
    { name: 'xpos', label: '挂点位置', min: -1.1, max: 1.1, step: 0.05, value: 0, fmt: function (v) { return v.toFixed(2); } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['ropeA', 'ropeB', 'Gv', 'TAv', 'TBv', 'mk1', 'mk2', 'info'],
    '先算后验：拖挂点看 T_A、T_B 此消彼长（答案 C：T_A′>T_A、T_B′<T_B）。',
    { text: '普遍性：哪边绳短且陡，哪边拉力大——三角形永远闭合。', audio: '../assets/audio/c2s1e3-3.mp3', slider: 'xpos', from: 0, to: -1.1, duration: 3200 }));

  /* ================= 一节例4 改拉绳方向 ================= */
  function buildS1E4(api) {
    GGB.run(api, [
      'gam = 30', 'Tc = 3', 'k = 0.42',
      'T2m = Tc / cos(gam°)', 'Nm = Tc tan(gam°)',
      'rod = Segment((0, -1.4), (0, 1.4))',
      'ropeH = Segment((0, 1.4), (-1.9, 1.4))',
      'ropeG = Segment((0, 1.4), (0, 1.4) + 1.9 (-cos(gam°), sin(gam°)))',
      'P0 = (2.4, -1.6)',
      't1 = Vector(P0, P0 + (k Tc, 0))',
      't2 = Vector(P0 + (k Tc, 0), P0 + (k Tc, -k Nm))',
      't3 = Vector(P0 + (k Tc, -k Nm), P0)',
      'info = Text("T₂ = " + round(T2m, 2) + "，N = " + round(Nm, 2), (-2.8, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', '水平绳拉力 T 不变，合力 N 沿杆竖直', '(-2.8, 2.25)'],
      ['mk2', 'γ 变大 ⇒ T₂、N 都变大', '(-2.8, -2.9)'],
    ]);
    GGB.color(api, 'rod', 2); GGB.thick(api, 'rod', 6);
    GGB.color(api, 'ropeH', 2); GGB.thick(api, 'ropeH', 2.2);
    GGB.color(api, 'ropeG', 4); GGB.thick(api, 'ropeG', 2.2);
    GGB.color(api, 't1', 2); GGB.thick(api, 't1', 3);
    GGB.color(api, 't2', 4); GGB.thick(api, 't2', 3);
    GGB.color(api, 't3', 10); GGB.thick(api, 't3', 3);
    GGB.hide(api, ['gam', 'Tc', 'k', 'T2m', 'Nm', 'P0']);
    GGB.view(api, -3.2, 5.2, -3.2, 3.1);
    try { api.setCoords('gam', -3.1, 2.75); } catch (e) { }
  }

  var S1E4_STEPS = [
    {
      label: '合力沿杆竖直向下', show: ['rod', 'ropeH', 'ropeG', 't1', 't2', 't3', 'mk1', 'info'],
      caption: '棒垂直地面 ⇒ 两绳合力必沿杆竖直向下，大小即棒对地面压力。',
      key: '合力沿杆 ⇒ N = T·tanγ',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '棒与地面垂直，两根绳的合力必沿杆竖直向下，合力大小就是棒对地面的压力。',
      audio: '../assets/audio/c2s1e4-1.mp3'
    },
    {
      label: 'γ 变大则都变大', show: ['rod', 'ropeH', 'ropeG', 't1', 't2', 't3', 'mk2', 'info'],
      caption: 'T₂ = T/cosγ，N = T·tanγ：γ 增大（改用 PQ′）两者都增大 ⇒ 答案 B。',
      key: 'T₁<T₂，N₁<N₂ ⇒ 选 B',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '斜绳与水平夹角变大时，斜绳拉力T二等于T除以cos伽马，压力N等于T乘tan伽马，都变大，所以答案选B。',
      audio: '../assets/audio/c2s1e4-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e4', '例4 · 改用另一根绳来拉', buildS1E4, S1E4_STEPS, [
    { name: 'gam', label: 'γ', min: 10, max: 75, step: 1, value: 30, fmt: function (v) { return v.toFixed(0) + '°'; } }
  ], ['rod', 'ropeH', 'ropeG', 't1', 't2', 't3', 'mk1', 'mk2', 'info'],
    '先算后验：T₂ = T/cosγ，N = T·tanγ。拖 γ 对照读数，γ 大则两者都大。',
    { text: '普遍性：绳越陡（γ 大），绳拉力与杆压力都越大。', audio: '../assets/audio/c2s1e4-3.mp3', slider: 'gam', from: 10, to: 75, duration: 3200 }));

  /* ================= 一节例5 加大 B 重 ================= */
  function buildS1E5(api) {
    GGB.run(api, [
      'GB = 3', 'om = 42', 'k = 0.34',
      'T1m = GB / tan(om°)', 'T2m = GB / sin(om°)',
      'tab = Segment((-1.8, 1.6), (1.8, 1.6))',
      'Gv = Vector((0, 1.6), (0, 1.6) - (0, k GB))',
      'P0 = (-2.6, -1.4)',
      't1 = Vector(P0, P0 + (k T1m, 0))',
      't2 = Vector(P0 + (k T1m, 0), P0 + (k T1m, k T2m * cos(om° * 2) + k T2m * 0))',
      't2b = Vector(P0 + (k T1m, 0), P0)',
      'info = Text("T₁ = " + round(T1m, 2) + "，T₂ = " + round(T2m, 2) + "，f = T₁", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'B 加重 ⇒ 三角形整体放大', '(-3.2, 2.25)'],
      ['mk2', 'AO、CO 拉力与摩擦力全部增加', '(-3.2, -2.9)'],
    ]);
    GGB.thick(api, 'tab', 6); GGB.color(api, 'tab', 2);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 't1', 2); GGB.thick(api, 't1', 3);
    GGB.color(api, 't2b', 4); GGB.thick(api, 't2b', 3);
    GGB.hide(api, ['GB', 'om', 'k', 'T1m', 'T2m', 'P0', 't2']);
    GGB.view(api, -3.6, 3.6, -3.2, 3.1);
    try { api.setCoords('GB', -3.5, 2.75); } catch (e) { }
  }

  var S1E5_STEPS = [
    {
      label: '三角形整体放大', show: ['tab', 'Gv', 't1', 't2b', 'mk1', 'info'],
      caption: '两绳方向不变，B 加重 ⇒ 三角形按比例放大，两绳拉力同步增加。',
      key: '三角形随 G_B 放大',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '两根绳的方向不变，B的重量增加时，矢量三角形整体放大，两根绳的拉力同步增加。',
      audio: '../assets/audio/c2s1e5-1.mp3'
    },
    {
      label: '四项全增', show: ['tab', 'Gv', 't1', 't2b', 'mk2', 'info'],
      caption: 'CO、BO 拉力增加，AO 拉力增加 ⇒ 桌面对 A 的摩擦力也增加 ⇒ ABCD 全对。',
      key: 'A、B、C、D 均正确',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'CO绳、BO绳拉力都增加，AO绳拉力增加，桌面对A的静摩擦力也跟着增加，所以四个选项全对。',
      audio: '../assets/audio/c2s1e5-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e5', '例5 · 加大 B 的重量', buildS1E5, S1E5_STEPS, [
    { name: 'GB', label: 'G_B', min: 1, max: 6, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['tab', 'Gv', 't1', 't2b', 'mk1', 'mk2', 'info'],
    '先算后验：拖 G_B，T₁、T₂、f 同比例增长——四个选项全对。',
    { text: '普遍性：方向不变时，力随载荷线性放大。', audio: '../assets/audio/c2s1e5-3.mp3', slider: 'GB', from: 1, to: 6, duration: 3200 }));

  /* ================= 一节例6 减小木板倾角 ================= */
  function buildS1E6(api) {
    GGB.run(api, [
      'alp = 45', 'Gm = 3', 'k = 0.42',
      'N1m = Gm tan(alp°)', 'N2m = Gm / cos(alp°)',
      'wall = Segment((-1.7, -1.2), (-1.7, 1.6))',
      'board = Segment((-1.7, 1.5), (1.9, 1.5 - 3.6 * tan(alp°)))',
      'ballc = (-1.7 + 0.62, 0.5)',
      'ball = Circumference(ballc, 0.55)',
      'P0 = (1.2, -1.6)',
      't1 = Vector(P0, P0 + (k N1m, 0))',
      't2 = Vector(P0 + (k N1m, 0), P0 + (k N1m, k N2m * sin(alp°) + 0 * k))',
      't2b = Vector(P0 + (k N1m, 0), P0)',
      'info = Text("球对墙 " + round(N1m, 2) + "，对板 " + round(N2m, 2) + "（都随 α 变小而变小）", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'G 不变、N₁ 方向不变，三角形收缩', '(-3.2, 2.25)'],
      ['mk2', 'α 变小 ⇒ N₁、N₂ 都变小', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'wall', 2); GGB.thick(api, 'wall', 2.5);
    GGB.color(api, 'board', 2); GGB.thick(api, 'board', 3);
    GGB.color(api, 'ball', 2); GGB.thick(api, 'ball', 2);
    GGB.color(api, 't1', 2); GGB.thick(api, 't1', 3);
    GGB.color(api, 't2b', 4); GGB.thick(api, 't2b', 3);
    GGB.hide(api, ['alp', 'Gm', 'k', 'N1m', 'N2m', 'ballc', 'P0', 't2']);
    GGB.view(api, -3.6, 4.4, -3.2, 2.8);
    try { api.setCoords('alp', -3.5, 2.45); } catch (e) { }
  }

  var S1E6_STEPS = [
    {
      label: '矢量三角形随 α 收缩', show: ['wall', 'board', 'ball', 't1', 't2b', 'mk1', 'info'],
      caption: 'G 不变、N₁ 方向不变，木板放平 ⇒ N₂ 方向改变，三角形收缩。',
      key: '三角形随 α 收缩',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重力不变，墙的弹力方向不变，木板放平时木板弹力方向改变，矢量三角形收缩。',
      audio: '../assets/audio/c2s1e6-1.mp3'
    },
    {
      label: '结论：都变小', show: ['wall', 'board', 'ball', 't1', 't2b', 'mk2', 'info'],
      caption: 'N₁ = G·tanα、N₂ = G/cosα：α 变小两者都变小——两空格都填「变小」。',
      key: '两空格都填「变小」',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'N一等于G乘tan阿尔法，N二等于G除以cos阿尔法，阿尔法变小时两者都变小，所以两个空格都填变小。',
      audio: '../assets/audio/c2s1e6-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e6', '例6 · 减小木板倾角', buildS1E6, S1E6_STEPS, [
    { name: 'alp', label: 'α', min: 8, max: 72, step: 1, value: 45, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['wall', 'board', 'ball', 't1', 't2b', 'mk1', 'mk2', 'info'],
    '先算后验：N₁ = G·tanα，N₂ = G/cosα。拖 α 向小，两读数同降。',
    { text: '普遍性：板越平，球越「轻」——几何卸力。', audio: '../assets/audio/c2s1e6-3.mp3', slider: 'alp', from: 72, to: 8, duration: 3200 }));

  /* ================= 一节例8 绳端下移 ================= */
  function buildS1E8(api) {
    GGB.run(api, [
      'del = 35', 'Gm = 3', 'k = 0.38',
      'Nm = 2 Gm cos(del° / 2)',
      'wall = Segment((-1.6, -1.2), (-1.6, 1.8))',
      'P = (0.2, 1.4)',
      'ropeV = Segment(P, P + (0, 1.1))',
      'ropeA = Segment(P, P + 1.5 (-sin(del°), -cos(del°)))',
      'T1v = Vector(P, P + k Gm (0, -1))',
      'T2v = Vector(P, P + k Gm (-sin(del°), -cos(del°)))',
      'Nv = Vector(P, P + k Nm (-sin(del° / 2), -cos(del° / 2)))',
      'info = Text("两绳拉力 = G，合力 N = " + round(Nm, 2), (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', '两绳拉力大小不变，夹角变小', '(-3.2, 2.25)'],
      ['mk2', '夹角越小 ⇒ 合力 N 越大 ⇒ 选 C', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'wall', 2); GGB.thick(api, 'wall', 2.5);
    GGB.color(api, 'ropeV', 2); GGB.thick(api, 'ropeV', 2.2);
    GGB.color(api, 'ropeA', 2); GGB.thick(api, 'ropeA', 2.2);
    GGB.color(api, 'T1v', 4); GGB.thick(api, 'T1v', 3);
    GGB.color(api, 'T2v', 4); GGB.thick(api, 'T2v', 3);
    GGB.color(api, 'Nv', 10); GGB.thick(api, 'Nv', 3.5);
    ['P'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['del', 'Gm', 'k', 'Nm']);
    GGB.view(api, -3.6, 3.2, -3.2, 2.8);
    try { api.setCoords('del', -3.5, 2.45); } catch (e) { }
  }

  var S1E8_STEPS = [
    {
      label: '两绳等值，合力沿杆', show: ['wall', 'P', 'ropeV', 'ropeA', 'T1v', 'T2v', 'Nv', 'mk1', 'info'],
      caption: '两段绳拉力都等于物重 G，其合力沿杆方向，即杆受的压力。',
      key: '两绳拉力等值，合力即压力',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '两段绳的拉力大小都等于物重，它们的合力沿杆方向，就是杆受到的压力。',
      audio: '../assets/audio/c2s1e8-1.mp3'
    },
    {
      label: '夹角小则合力大', show: ['wall', 'P', 'ropeV', 'ropeA', 'T1v', 'T2v', 'Nv', 'mk2', 'info'],
      caption: 'N = 2G·cos(δ/2)：绳端下移 ⇒ 两绳夹角变小 ⇒ N 变大 ⇒ 选 C。',
      key: 'N 变大 ⇒ 选 C',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'N等于二G乘cosine二分之德尔塔。绳端下移，两绳夹角变小，合力N变大，所以答案选C。',
      audio: '../assets/audio/c2s1e8-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e8', '例8 · 绳端下移', buildS1E8, S1E8_STEPS, [
    { name: 'del', label: '两绳夹角参数 δ', min: 8, max: 55, step: 1, value: 35, fmt: function (v) { return v.toFixed(0) + '°'; } }
  ], ['wall', 'P', 'ropeV', 'ropeA', 'T1v', 'T2v', 'Nv', 'mk1', 'mk2', 'info'],
    '先算后验：N = 2G·cos(δ/2)。拖 δ 向小（绳端下移），合力变大。',
    { text: '普遍性：两个等大的力，夹角越小合力越大。', audio: '../assets/audio/c2s1e8-3.mp3', slider: 'del', from: 55, to: 8, duration: 3200 }));

  /* ================= 一节例9 档板缓转到水平 ================= */
  function buildS1E9(api) {
    GGB.run(api, [
      'gam = 15', 'Gm = 3', 'k = 0.42',
      'P0 = (0, 0)',
      'Gt = P0 + (0, -k Gm)',
      'LN = Line(Gt, Gt + 3 * (-sin(35°), cos(35°)))',
      'LB = Line(P0, P0 + 3 * (cos(gam°), -sin(gam°)))',
      'Xp = Intersect(LN, LB)',
      'N1v = Vector(P0, Xp)',
      'N2v = Vector(Gt, Xp)',
      'Gv = Vector(P0, Gt)',
      'N1m = Distance(P0, Xp) / k', 'N2m = Distance(Gt, Xp) / k',
      'board = Segment((0.9, -1.4), (0.9 + 2.2 cos(gam°), -1.4 - 2.2 sin(gam°)))',
      'incline = Segment((-2.2, 1.2), (1.0, -1.7))',
      'info = Text("N₁ = " + round(N1m, 2) + "，N₂ = " + round(N2m, 2) + "（G = " + round(Gm, 1) + "）", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'G 不变、斜面支持方向不变', '(-3.2, 2.25)'],
      ['mk2', 'N₁ 先小后大→G；N₂ 递减→0', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'incline', 2); GGB.thick(api, 'incline', 3);
    GGB.color(api, 'board', 2); GGB.thick(api, 'board', 3);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'N1v', 4); GGB.thick(api, 'N1v', 4);
    GGB.color(api, 'N2v', 2); GGB.thick(api, 'N2v', 4);
    ['LN', 'LB'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    GGB.hide(api, ['gam', 'Gm', 'k', 'P0', 'Gt', 'LN', 'LB', 'Xp', 'N1m', 'N2m']);
    GGB.view(api, -3.6, 3.6, -3.2, 3.0);
    try { api.setCoords('gam', -3.5, 2.7); } catch (e) { }
  }

  var S1E9_STEPS = [
    {
      label: '三角形随档板转', show: ['incline', 'board', 'Gv', 'N1v', 'N2v', 'mk1', 'info'],
      caption: 'G 不变、斜面支持力方向不变，档板转动 ⇒ N₁ 方向旋转，三角形变形。',
      key: 'N₁ 方向随档板转',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重力不变，斜面支持力方向不变，档板转动时N一的方向跟着旋转，矢量三角形连续变形。',
      audio: '../assets/audio/c2s1e9-1.mp3'
    },
    {
      label: '读出两段结论', show: ['incline', 'board', 'Gv', 'N1v', 'N2v', 'mk2', 'info'],
      caption: 'N₁ 由大变小再变大，最终等于 G；N₂ 由大变小最终等于零。',
      key: 'N₁→G，N₂→0',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '拖动档板角度可以看到：N一由大变小再变大，最后等于球重；N二由大变小，最后等于零。',
      audio: '../assets/audio/c2s1e9-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e9', '例9 · 档板缓转到水平', buildS1E9, S1E9_STEPS, [
    { name: 'gam', label: '档板转角', min: 2, max: 88, step: 1, value: 15, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['incline', 'board', 'Gv', 'N1v', 'N2v', 'mk1', 'mk2', 'info'],
    '先算后验：拖档板转角，N₁ 呈 U 形最终 →G，N₂ 单调 →0。',
    { text: '普遍性：约束方向连续转，力就沿三角形连续滑。', audio: '../assets/audio/c2s1e9-3.mp3', slider: 'gam', from: 2, to: 88, duration: 3200 }));

  /* ================= 一节例10 人爬梯子 ================= */
  function buildS1E10(api) {
    GGB.run(api, [
      'phi = 60', 'Gm = 3', 'k = 0.4',
      'Nm = Gm / tan(phi°)', 'Fm = Gm / sin(phi°)',
      'wall = Segment((-1.8, -1.2), (-1.8, 1.9))',
      'ladder = Segment((-1.8, 1.8), (0.9, -1.2))',
      'P0 = (1.9, -1.8)',
      'Gv = Vector(P0, P0 + (0, -k Gm))',
      't1 = Vector(P0, P0 + (k Nm, 0))',
      't2 = Vector(P0 + (k Nm, 0), P0 + (k Nm, k Fm sin(phi°))',
      't2b = Vector(P0 + (k Nm, 0), P0)',
      'info = Text("N = " + round(Nm, 2) + "，F = " + round(Fm, 2) + "（都随爬升增大）", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'G 不变、N 方向水平不变', '(-3.2, 2.25)'],
      ['mk2', '人上爬 ⇒ N、F 都变大，F 越压越平', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'wall', 2); GGB.thick(api, 'wall', 2.5);
    GGB.color(api, 'ladder', 2); GGB.thick(api, 'ladder', 5);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 't1', 2); GGB.thick(api, 't1', 3);
    GGB.color(api, 't2b', 4); GGB.thick(api, 't2b', 3);
    GGB.hide(api, ['phi', 'Gm', 'k', 'Nm', 'Fm', 'P0', 't2']);
    GGB.view(api, -3.6, 4.2, -3.2, 3.0);
    try { api.setCoords('phi', -3.5, 2.7); } catch (e) { }
  }

  var S1E10_STEPS = [
    {
      label: '三力共点闭合', show: ['wall', 'ladder', 'Gv', 't1', 't2b', 'mk1', 'info'],
      caption: 'G、N（水平）、F（地面作用力）三力共点，闭合三角形。',
      key: '三力共点闭合',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '人爬梯子时，重力、墙壁支持力、地面作用力三力共点，组成闭合三角形。',
      audio: '../assets/audio/c2s1e10-1.mp3'
    },
    {
      label: '读数随爬升增大', show: ['wall', 'ladder', 'Gv', 't1', 't2b', 'mk2', 'info'],
      caption: 'N = G/tanφ、F = G/sinφ：φ 变小（F 越平）⇒ N、F 都变大 ⇒ 答案 B。',
      key: 'N、F 都变大 ⇒ 选 B',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'N等于G除以tan斐，F等于G除以sin斐。人越往上爬，斐越小，两个力都变大，答案选B。',
      audio: '../assets/audio/c2s1e10-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e10', '例10 · 人爬梯子', buildS1E10, S1E10_STEPS, [
    { name: 'phi', label: 'F 与地面夹角 φ', min: 15, max: 80, step: 1, value: 60, fmt: function (v) { return v.toFixed(0) + '°'; } }
  ], ['wall', 'ladder', 'Gv', 't1', 't2b', 'mk1', 'mk2', 'info'],
    '先算后验：N = G/tanφ、F = G/sinφ。拖 φ 向小（人上爬），两读数同增。',
    { text: '普遍性：F 与水平的夹角越小，同样体重压得越狠。', audio: '../assets/audio/c2s1e10-3.mp3', slider: 'phi', from: 80, to: 15, duration: 3200 }));

  /* ================= 一节例11 重物移向横梁根部 ================= */
  function buildS1E11(api) {
    GGB.run(api, [
      'xg = 0.75', 'Gm = 3', 'k = 0.32',
      'A = (0, 0)', 'B = (2.4, 0)', 'Cc = (0, 1.35)',
      'X = (2.4 - 2.2 xg, 0)',
      'beam = Segment(A, B)',
      'rope = Segment(Cc, B)',
      'Gv = Vector(X, X + (0, -k Gm))',
      'LT = Line(Cc, B)',
      'LG = Line(X, X + (0, 1))',
      'O = Intersect(LT, LG)',
      'Fdir = Line(A, O)',
      'FT = Line(X + (0, -k Gm), X + (0, -k Gm) + (x(B) - x(Cc), y(B) - y(Cc)))',
      'Xp = Intersect(Fdir, FT)',
      'Fv = Vector(A, A + (x(Xp) - x(A), y(Xp) - y(A)))',
      'Tv = Vector(X + (0, -k Gm), Xp)',
      'Fm = Distance(A, Xp) / k', 'Tm = Distance(X + (0, -k Gm), Xp) / k',
      'info = Text("F = " + round(Fm, 2) + "，T = " + round(Tm, 2), (-2.8, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', '三力共点：F 方向由 O 决定', '(-2.8, 2.25)'],
      ['mk2', 'G 移向 A ⇒ F 先小后大、方向由平转竖', '(-2.8, -2.9)'],
    ]);
    GGB.color(api, 'beam', 2); GGB.thick(api, 'beam', 6);
    GGB.color(api, 'rope', 2); GGB.thick(api, 'rope', 2.2);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'Fv', 4); GGB.thick(api, 'Fv', 4);
    GGB.color(api, 'Tv', 2); GGB.thick(api, 'Tv', 3);
    ['LT', 'LG', 'Fdir', 'FT'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    ['A', 'B', 'Cc', 'X'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['xg', 'Gm', 'k', 'X', 'LT', 'LG', 'O', 'Fdir', 'FT', 'Xp', 'Fm', 'Tm']);
    GGB.view(api, -2.6, 4.6, -3.2, 2.6);
    try { api.setCoords('xg', -2.5, 2.35); } catch (e) { }
  }

  var S1E11_STEPS = [
    {
      label: '三力共点定 F 方向', show: ['beam', 'rope', 'Gv', 'Fv', 'Tv', 'mk1', 'info'],
      caption: 'G 竖直、T 沿绳 CB、F 过 A——三力共点 O 决定 F 的方向。',
      key: '共点 O 决定 F 方向',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重力竖直向下，绳张力沿CB方向，A点作用力过铰链A，三力共点于O，O点决定F的方向。',
      audio: '../assets/audio/c2s1e11-1.mp3'
    },
    {
      label: '读出 U 形与转向', show: ['beam', 'rope', 'Gv', 'Fv', 'Tv', 'mk2', 'info'],
      caption: 'G 由 B 移向 A：F 先大→小→大，方向由水平逐渐转为竖直向上 ⇒ 答案 D。',
      key: 'F 先小后大、方向转竖直 ⇒ 选 D',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '重物从B移向A，F先变小再变大，方向由水平逐渐变为竖直向上，答案选D。',
      audio: '../assets/audio/c2s1e11-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e11', '例11 · 重物移向横梁根部', buildS1E11, S1E11_STEPS, [
    { name: 'xg', label: '重物距 B', min: 0.05, max: 1, step: 0.02, value: 0.75, fmt: function (v) { return v.toFixed(2); } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['beam', 'rope', 'Gv', 'Fv', 'Tv', 'mk1', 'mk2', 'info'],
    '先算后验：拖重物位置，F 呈 U 形且方向由平转竖（答案 D）。',
    { text: '普遍性：共点几何决定力的方向——这是矢量三角形法的核心。', audio: '../assets/audio/c2s1e11-3.mp3', slider: 'xg', from: 0.95, to: 0.05, duration: 3400 }));

  /* ================= 一节例12 拉绳提小球上球面 ================= */
  function buildS1E12(api) {
    GGB.run(api, [
      'xi = 25', 'Gm = 3', 'RR = 1.2', 'dd = 2.2', 'k = 0.38',
      'LL = sqrt(RR^2 + dd^2 - 2 RR dd cos(xi°))',
      'Nm = Gm RR / dd', 'Fm = Gm LL / dd',
      'O = (0, 0)', 'Ap = (0, dd)',
      'Bp = RR * (-sin(xi°), cos(xi°))',
      'big = Circumference(O, RR)',
      'ball = Circumference(Bp, 0.3)',
      'str = Segment(Ap, Bp)',
      'lnOB = Segment(O, Bp)',
      'Gv = Vector(Bp, Bp + (0, -k Gm))',
      'Nv = Vector(Bp, Bp + k Nm / RR (x(Bp) - x(O), y(Bp) - y(O)))',
      'Fv = Vector(Bp, Bp + k Fm / LL (x(Ap) - x(Bp), y(Ap) - y(Bp)))',
      'info = Text("N = " + round(Nm, 2) + "（恒定！），F = " + round(Fm, 2) + "（递减）", (-3.2, 2.7))',
    ]);
    addMarks(api, [
      ['mk1', 'AB、OB 都可当刚体', '(-3.2, 2.25)'],
      ['mk2', 'N = RG/(R+d) 恒定，F = LG/(R+d) 递减', '(-3.2, -2.9)'],
    ]);
    GGB.color(api, 'big', 8); GGB.thick(api, 'big', 1.5);
    GGB.color(api, 'ball', 2); GGB.thick(api, 'ball', 2);
    GGB.color(api, 'str', 2); GGB.thick(api, 'str', 2.2);
    GGB.color(api, 'lnOB', 8); GGB.thick(api, 'lnOB', 1);
    GGB.color(api, 'Gv', 10); GGB.thick(api, 'Gv', 4);
    GGB.color(api, 'Nv', 2); GGB.thick(api, 'Nv', 4);
    GGB.color(api, 'Fv', 4); GGB.thick(api, 'Fv', 4);
    ['O', 'Ap', 'Bp'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['xi', 'Gm', 'RR', 'dd', 'k', 'LL', 'Nm', 'Fm']);
    GGB.view(api, -3.4, 3.4, -3.2, 3.0);
    try { api.setCoords('xi', -3.3, 2.7); } catch (e) { }
  }

  var S1E12_STEPS = [
    {
      label: '两根"刚体"线段', show: ['big', 'ball', 'str', 'lnOB', 'Gv', 'Nv', 'Fv', 'mk1', 'info'],
      caption: '绳 AB 与几何线段 OB 均可当刚体；小球受 G、N、T 三力。',
      key: 'AB 与 OB 都当刚体',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '细线AB和几何线段OB都可以当作刚体，小球受重力、球面弹力和绳张力三个力。',
      audio: '../assets/audio/c2s1e12-1.mp3'
    },
    {
      label: 'N 恒定、F 递减', show: ['big', 'ball', 'str', 'lnOB', 'Gv', 'Nv', 'Fv', 'mk2', 'info'],
      caption: 'N = RG/(R+d) 恒定不变；F = LG/(R+d) 随绳缩短而减小 ⇒ 答案 C。',
      key: 'N 不变、F 变小 ⇒ 选 C',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'N等于RG除以R加d，大小恒定不变；F等于LG除以R加d，绳子变短F逐渐减小。答案选C。',
      audio: '../assets/audio/c2s1e12-2.mp3'
    }
  ];

  new InteractiveCard(cfg('ggb-card-c2s1e12', '例12 · 拉绳提小球上球面', buildS1E12, S1E12_STEPS, [
    { name: 'xi', label: '小球位置角', min: 5, max: 80, step: 1, value: 25, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['big', 'ball', 'str', 'lnOB', 'Gv', 'Nv', 'Fv', 'mk1', 'mk2', 'info'],
    '先算后验：N = RG/(R+d) 恒定！拖小球位置，N 读数不变、F 递减。',
    { text: '普遍性：拉绳上提，弹力恒定、拉力递减——几何比例决定分配。', audio: '../assets/audio/c2s1e12-3.mp3', slider: 'xi', from: 5, to: 80, duration: 3400 }));

  window.__CH2_DONE = true;
})();
