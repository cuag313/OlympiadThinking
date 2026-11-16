/* ============================================================
   ex1.js — 例1：均匀直杆 AB 放置在光滑半球形容器内
   探究：拖动 λ=L/R，观察平衡角 θ、支持力 N₁/N₂、矢量三角形闭合
   演示：受力分析 → 力矩方程 → 三力共点 → 正交分解 → 矢量三角形
   ============================================================ */

(function () {
  'use strict';

  function build(api) {
    /* ---------- 参数与基本量 ---------- */
    GGB.run(api, [
      'R = 2',                                   // 球半径（绘图单位）
      'lmb = 2.4',                               // λ = L/R
      'Gm = 3',                                  // 重力大小（绘图单位）
      'cc = (lmb + sqrt(lmb^2 + 128)) / 16',     // cosθ 由平衡条件 Lcosθ = 4Rcos2θ 解出
      'th = acos(cc)',                           // 平衡角（角度对象）
      'L = lmb R',                               // 杆长
      'N2m = Gm L / (4 R)',                      // N₂ = GL/(4R)
      'N1m = Gm L sin(th) / (4 R cos(2 th))',    // N₁ = GLsinθ/(4Rcos2θ)
    ]);

    try {
      api.setSliderMin('lmb', 2.05); api.setSliderMax('lmb', 3.0); api.setSliderStep('lmb', 0.05);
      api.setSliderMin('Gm', 2); api.setSliderMax('Gm', 4); api.setSliderStep('Gm', 0.1);
    } catch (e) { }

    /* ---------- 几何：碗、杆、接触点 ---------- */
    GGB.run(api, [
      'O = (0, 0)',                                              // 球心
      'A = (-R cos(2 th), -R sin(2 th))',                        // 杆端点（弧上）
      'B = (R, 0)',                                              // 容器口接触点
      'E = A + (L cos(th), L sin(th))',                          // 杆另一端（容器外）
      'M = (A + E) / 2',                                         // 重心
      'circ = Circle(O, R)',                                     // 球（辅助圆）
      'bowl = Semicircle((R, 0), (-R, 0))',                // 半球形容器（下半圆弧，有向线段左侧）
      'diam = Segment((-R, 0), (R, 0))',                         // 开口直径
      'rod = Segment(A, E)',                                     // 直杆
    ]);

    /* ---------- 三力作用线与共点 O ---------- */
    GGB.run(api, [
      'ln1 = Line(A, O)',                                        // N₁ 作用线（沿半径）
      'ln2 = Line(B, B + (-sin(th), cos(th)))',                  // N₂ 作用线（垂直杆）
      'lnG = Line(M, M + (0, -1))',                               // G 作用线（竖直）
      'Cn = Intersect(ln1, ln2)',                                // 三力共点（圆上）
    ]);

    /* ---------- 力矢量（k = 0.45 为显示比例） ---------- */
    GGB.run(api, [
      'gvec = Vector(M, M + (0, -0.45 Gm))',
      'n2vec = Vector(B, B + 0.45 N2m (-sin(th), cos(th)))',
      'n1vec = Vector(A, A + 0.45 N1m (cos(2 th), sin(2 th)))',
    ]);

    /* ---------- 矢量三角形（右侧，首尾相接自动闭合） ---------- */
    GGB.run(api, [
      'P0 = (4.95, -1.75)',
      'P1 = P0 + (0, -0.45 Gm)',
      'P2 = P1 + 0.45 N2m (-sin(th), cos(th))',
      'P3 = P2 + 0.45 N1m (cos(2 th), sin(2 th))',
      'v1 = Vector(P0, P1)',
      'v2 = Vector(P1, P2)',
      'v3 = Vector(P2, P3)',
    ]);

    /* ---------- 力臂辅助（以 A 为轴） ---------- */
    GGB.run(api, [
      'armG = Segment(A, A + (L / 2 cos(th), 0))',               // G 的力臂 (L/2)cosθ
      'armN2 = Segment(A, B)',                                   // N₂ 的力臂 2Rcosθ
    ]);

    /* ---------- 标注文字 ---------- */
    GGB.run(api, [
      'tA = Text("A", A + (-0.35, -0.3))',
      'tB = Text("B", B + (0.15, 0.3))',
      'tC = Text("C", E + (0.15, -0.1))',
      'tO = Text("O", Cn + (0.12, 0.12))',
      'tG = Text("G", M + (0.12, -0.45 Gm - 0.1))',
      'tN1 = Text("N₁", A + 0.45 N1m (cos(2 th), sin(2 th)) + (0.1, 0.15))',
      'tN2 = Text("N₂", B + 0.45 N2m (-sin(th), cos(th)) + (-0.35, -0.1))',
      'tTri = Text("矢量三角形", P0 + (-0.1, 0.6))',
      'txt = Text("λ = " + round(lmb, 2) + "   N₁ = " + round(N1m, 2) + "   N₂ = " + round(N2m, 2), (-3.6, -3.6))',
    ]);

    /* ---------- 颜色与样式 ---------- */
    GGB.color(api, 'rod', 2); GGB.thick(api, 'rod', 6);
    GGB.color(api, 'bowl', 2); GGB.thick(api, 'bowl', 5);
    GGB.color(api, 'circ', 8); GGB.thick(api, 'circ', 1);
    GGB.color(api, 'diam', 8); GGB.thick(api, 'diam', 1);
    ['gvec', 'v1'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    ['n1vec', 'n2vec', 'v2', 'v3'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    ['ln1', 'ln2', 'lnG', 'armG', 'armN2'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    GGB.color(api, 'Cn', 4); GGB.size(api, 'Cn', 5);
    GGB.color(api, 'M', 10); GGB.size(api, 'M', 4);
    ['A', 'B', 'E', 'O'].forEach(function (n) { GGB.size(api, n, 4); });

    // 隐藏计算用中间点与 GeoGebra 自带滑块（改用 HTML 控制条）
    GGB.hide(api, ['P0', 'P1', 'P2', 'P3', 'cc', 'N2m', 'N1m', 'L', 'th', 'A', 'E', 'M', 'lmb', 'Gm']);
    // 保留 B、O、Cn 的标签
    try { api.setLabelVisible('B', true); api.setLabelVisible('O', false); } catch (e) { }
    GGB.hide(api, 'Cn');   // 用文字 tO 代替
    try { api.setLabelVisible('rod', false); api.setLabelVisible('bowl', false); } catch (e) { }

    GGB.view(api, -4.5, 8.5, -4.0, 3.4);
    try {
      api.setCoords('lmb', -4.3, 3.1);
      api.setCoords('Gm', -4.3, 2.45);
    } catch (e) { }
  }

  /* 解题演示的分步显示对象集合 */
  var STEPS = [
    {
      label: '受力分析',
      show: ['bowl', 'rod', 'gvec', 'n1vec', 'n2vec', 'tA', 'tB', 'tC', 'tG', 'tN1', 'tN2'],
      caption: '杆受重力 G（重心处）、A 点支持力 N₁（垂直弧面，沿半径指向球心）、B 点支持力 N₂（垂直杆）。',
      narration: '我们先对杆做受力分析。杆受到三个力：竖直向下的重力G，作用在杆的重心；A点的支持力N1，方向沿半径指向球心；B点的支持力N2，垂直于杆向上。',
      audio: '../assets/audio/ex1-1.mp3'
    },
    {
      label: '力矩方程（A 轴）',
      show: ['bowl', 'rod', 'gvec', 'n2vec', 'armG', 'armN2', 'tA', 'tB', 'tG', 'tN2', 'txt'],
      caption: '以 A 为转轴：N₂·2Rcosθ = G·(L/2)cosθ，故 N₂ = GL/4R。图中橙色线段为两力的力臂。',
      narration: '取A点为转轴，列力矩方程。N2的力臂是二R乘cosine西塔，重力的力臂是二分之L乘cosine西塔。由力矩平衡，立刻解出N2等于GL除以四R。',
      audio: '../assets/audio/ex1-2.mp3'
    },
    {
      label: '三力共点',
      show: ['bowl', 'rod', 'circ', 'gvec', 'n1vec', 'n2vec', 'ln1', 'ln2', 'lnG', 'Cn', 'tO', 'tA', 'tB', 'tG', 'tN1', 'tN2'],
      caption: '三力平衡必共点：N₁ 沿半径、N₂ 垂直杆、G 竖直，三条作用线交于圆上一点 O（与 A 关于球心对称）。',
      narration: '三个力平衡，作用线必定共点。把N1、N2和G的作用线画出来，它们交于圆上的O点。O恰好与A点关于球心对称，这是个很漂亮的几何结论。',
      audio: '../assets/audio/ex1-3.mp3'
    },
    {
      label: '正交分解',
      show: ['bowl', 'rod', 'gvec', 'n1vec', 'n2vec', 'tA', 'tB', 'tG', 'tN1', 'tN2', 'txt'],
      caption: '在共点 O 建立坐标系，由 ΣFx = 0：N₁cos2θ = N₂sinθ，得 N₁ = GLsinθ/(4Rcos2θ)。',
      narration: '在共点O建立直角坐标系。由水平方向合力为零，N1乘cosine二西塔等于N2乘sine西塔。解出N1等于GL乘sine西塔，除以四R乘cosine二西塔。',
      audio: '../assets/audio/ex1-4.mp3'
    },
    {
      label: '矢量三角形',
      show: ['v1', 'v2', 'v3', 'tTri'],
      caption: '三个力首尾相接构成封闭三角形——平衡的几何判据。拖动 λ 可验证三角形始终闭合。',
      narration: '最后，把三个力首尾相接，构成一个封闭的三角形，这就是平衡的几何判据。回到探究模式拖动滑块，无论杆多长，三角形始终是闭合的。',
      audio: '../assets/audio/ex1-5.mp3'
    }
  ];

  var card = new InteractiveCard({
    container: 'ggb-card-1',
    appId: 'ggbAppletEx1',
    width: 820,
    height: 470,
    commands: build,
    steps: STEPS,
    narration: { title: '例1 · 半球形容器中的直杆' },
    controls: [
      { name: 'lmb', label: 'λ = L/R', min: 2.05, max: 3, step: 0.05, value: 2.4, fmt: function (v) { return v.toFixed(2); } },
      { name: 'Gm', label: 'G', min: 2, max: 4, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
    ],
    allObjects: ['bowl', 'rod', 'circ', 'diam', 'gvec', 'n1vec', 'n2vec', 'ln1', 'ln2', 'lnG',
      'armG', 'armN2', 'v1', 'v2', 'v3', 'Cn', 'tA', 'tB', 'tC', 'tO', 'tG', 'tN1', 'tN2', 'tTri', 'txt'],
    exploreCaption: '拖动滑块 λ = L/R（杆长与球半径之比），观察平衡角 θ、支持力大小与矢量三角形的联动。',
    onExplore: function (api) {
      GGB.show(api, ['bowl', 'rod', 'circ', 'diam', 'gvec', 'n1vec', 'n2vec', 'v1', 'v2', 'v3',
        'tA', 'tB', 'tC', 'tO', 'tG', 'tN1', 'tN2', 'tTri', 'txt']);
      GGB.hide(api, ['ln1', 'ln2', 'lnG', 'armG', 'armN2']);
    }
  });
})();
