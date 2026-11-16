/* ============================================================
   ex3.js — 例3：均匀梯子 AB 斜靠在光滑墙上（L=3.9m，G=360N）
   探究：拖动梯脚距墙距离 s 与重力 G，观察共点 O、地面作用力 F、墙支持力 N₁
   演示：四力→三力（合成 f、N₂）→ 定共点 O → 几何 tanθ → 平衡方程
   ============================================================ */

(function () {
  'use strict';

  function build(api) {
    /* ---------- 参数 ---------- */
    GGB.run(api, [
      'L = 3.9',           // 梯长（m）
      's = 1.5',           // 梯脚距墙（m）
      'G = 360',           // 梯重（N）
      'k = 0.004',         // 力的显示比例（N → 绘图单位）
      'h = sqrt(L^2 - s^2)',                 // 梯顶高度 3.6m
      'th = atan(2 h / s)',                  // 地面作用力 F 与水平夹角 θ（tanθ = 2h/s）
      'N1 = G s / (2 h)',                    // 墙支持力 N₁ = G/tanθ
      'Fm = sqrt(G^2 + N1^2)',               // 地面作用力大小
    ]);

    try {
      api.setSliderMin('s', 0.8); api.setSliderMax('s', 2.6); api.setSliderStep('s', 0.05);
      api.setSliderMin('G', 200); api.setSliderMax('G', 500); api.setSliderStep('G', 10);
    } catch (e) { }

    /* ---------- 几何：墙、地、梯 ---------- */
    GGB.run(api, [
      'W1 = (0, 0.4)', 'W2 = (0, 4.6)',               // 墙
      'Gr1 = (-0.4, 0)', 'Gr2 = (3.2, 0)',            // 地面
      'A = (0, h)',                                   // 梯顶（墙）
      'B = (s, 0)',                                   // 梯脚（地）
      'Cc = (0, 0)',                                  // 墙脚
      'Gpt = (s / 2, h / 2)',                         // 重心（中点）
      'ladder = Segment(A, B)',
      'wall = Segment(W1, W2)',
      'ground = Segment(Gr1, Gr2)',
    ]);

    /* ---------- 共点 O 与几何三角形 ODB ---------- */
    GGB.run(api, [
      'D = (s / 2, 0)',                               // O 在地面的垂足
      'O = (s / 2, h)',                               // 三力共点（N₁ 线与 G 线交点）
      'lnN1 = Line(A, O)',                            // N₁ 作用线（水平）
      'lnG = Line(Gpt, Gpt + (0, -1))',               // G 作用线（竖直）
      'lnF = Line(B, O)',                             // F 作用线（过 O）
      'triO = Polygon(O, D, B)',                      // △ODB
    ]);

    /* ---------- 四力 + 合成 F ---------- */
    GGB.run(api, [
      'n1v = Vector(A, A + (k G / tan(th), 0))',                  // 墙支持力 N₁（水平向右）
      'gv = Vector(Gpt, Gpt + (0, -k G))',                        // 重力
      'fv = Vector(B, B + (-k G / tan(th), 0))',                  // 摩擦力 f（指向墙）
      'n2v = Vector(B, B + (0, k G))',                            // 地面支持力 N₂
      'Fv = Vector(B, B + (-k G / tan(th), k G))',                // 合成 F
    ]);

    /* ---------- 矢量三角形（右上角） ---------- */
    GGB.run(api, [
      'Q0 = (3.9, 3.5)',
      'Q1 = Q0 + (0, -k G)',
      'Q2 = Q1 + (-k G / tan(th), k G)',
      'q1 = Vector(Q0, Q1)',
      'q2 = Vector(Q1, Q2)',
      'q3 = Vector(Q2, Q0)',
    ]);

    /* ---------- 标注 ---------- */
    GGB.run(api, [
      'tA = Text("A", A + (-0.3, 0.12))',
      'tB = Text("B", B + (0.12, -0.12))',
      'tC = Text("C", Cc + (-0.3, -0.15))',
      'tO = Text("O", O + (0.1, 0.15))',
      'tD = Text("D", D + (0.05, -0.28))',
      'tG = Text("G", Gpt + (0.12, -k G - 0.1))',
      'tN1 = Text("N₁", A + (k G / tan(th) + 0.08, 0.15))',
      'tN2 = Text("N₂", B + (0.12, k G + 0.05))',
      'tf = Text("f", B + (-k G / tan(th) - 0.3, -0.05))',
      'tF = Text("F", B + (-k G / tan(th) - 0.6, k G + 0.12))',
      'tTri = Text("力三角形", Q0 + (-0.6, 0.45))',
      'info = Text("tanθ = OD/DB = 2h/s = " + round(2 h / s, 2) + "   N₁ = G/tanθ = " + round(G / tan(th), 1) + " N   F = " + round(sqrt(G^2 + (G / tan(th))^2), 1) + " N", (-0.5, -0.75))',
    ]);

    /* ---------- 样式 ---------- */
    GGB.thick(api, 'ladder', 7); GGB.color(api, 'ladder', 2);
    GGB.thick(api, 'wall', 4); GGB.color(api, 'wall', 2);
    GGB.thick(api, 'ground', 4); GGB.color(api, 'ground', 2);
    ['gv', 'q1'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    ['n1v', 'n2v', 'fv', 'Fv', 'q2', 'q3'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    ['lnN1', 'lnG', 'lnF'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    GGB.color(api, 'triO', 13);
    try {
      api.setLineThickness('triO', 1);
      api.setFilling('triO', 0.12);
    } catch (e) { }
    ['A', 'B', 'Cc', 'O', 'D', 'Gpt', 'Q0', 'Q1', 'Q2', 'W1', 'W2', 'Gr1', 'Gr2'].forEach(function (n) {
      try { api.setLabelVisible(n, false); } catch (e) { }
    });
    GGB.hide(api, ['L', 'th', 'N1', 'Fm', 'k', 'h', 'Cc', 'Gpt', 'D', 'Q0', 'Q1', 'Q2',
      'W1', 'W2', 'Gr1', 'Gr2', 's', 'G']);

    GGB.view(api, -1.2, 9.2, -1.7, 4.7);
    try {
      api.setCoords('s', 5.4, 4.3);
      api.setCoords('G', 5.4, 3.7);
    } catch (e) { }
  }

  var STEPS = [
    {
      label: '受力分析（四力）',
      show: ['wall', 'ground', 'ladder', 'gv', 'n1v', 'n2v', 'fv', 'tA', 'tB', 'tG', 'tN1', 'tN2', 'tf'],
      caption: '梯子受四个力：重力 G（中点）、墙支持力 N₁（A 处水平）、地面支持力 N₂ 与摩擦力 f（B 处）。',
      narration: '对梯子做受力分析：重力G，作用在中点；墙的支持力N1，水平向右；地面有支持力N2和摩擦力f。一共四个力。',
      audio: '../assets/audio/ex3-1.mp3'
    },
    {
      label: '合成 f、N₂ 定共点 O',
      show: ['wall', 'ground', 'ladder', 'gv', 'n1v', 'Fv', 'lnN1', 'lnG', 'lnF', 'O', 'tO', 'tA', 'tB', 'tG', 'tN1', 'tF', 'info'],
      caption: '把 f 与 N₂ 合成为地面作用力 F：G、F、N₁ 三力共点——F 的作用线必过 N₁ 线与 G 线的交点 O。',
      narration: '把摩擦力f和支持力N2合成为地面的作用力F。这样梯子只受三个力，必定共点。F的作用线，一定通过N1与G作用线的交点O。',
      audio: '../assets/audio/ex3-2.mp3'
    },
    {
      label: '几何求 tanθ',
      show: ['wall', 'ground', 'ladder', 'gv', 'n1v', 'Fv', 'triO', 'O', 'tO', 'tA', 'tB', 'tD', 'tG', 'tN1', 'tF', 'info'],
      caption: '在 △ODB 中：tanθ = OD/DB = h/(s/2) = 2h/s = 4.8（原题数值）。',
      narration: '看三角形ODB：OD是梯高3.6米，DB是0.75米，所以tan西塔等于4.8。这个西塔，就是地面作用力F与水平方向的夹角。',
      audio: '../assets/audio/ex3-3.mp3'
    },
    {
      label: '平衡方程',
      show: ['wall', 'ground', 'ladder', 'gv', 'n1v', 'Fv', 'tA', 'tB', 'tG', 'tN1', 'tF', 'info'],
      caption: 'ΣFx = 0 → N₁ = G/tanθ = 75 N；ΣFy = 0 → F = √(G²+N₁²) = 367.7 N。',
      narration: '列平衡方程：水平方向，N1等于F的水平分量；竖直方向，F的竖直分量等于G。解得N1等于75牛，F等于367.7牛。',
      audio: '../assets/audio/ex3-4.mp3'
    },
    {
      label: '力三角形',
      show: ['q1', 'q2', 'q3', 'tTri', 'info'],
      caption: 'G、N₁、F 首尾相接构成封闭三角形，F 与水平方向夹角即 θ。',
      narration: '把G、N1和F首尾相接，构成封闭的力三角形。答案就是：墙的作用力75牛，地面的作用力367.7牛。',
      audio: '../assets/audio/ex3-5.mp3'
    }
  ];

  new InteractiveCard({
    container: 'ggb-card-3',
    appId: 'ggbAppletEx3',
    width: 820,
    height: 500,
    commands: build,
    steps: STEPS,
    narration: {
      title: '例3 · 光滑墙上的梯子',
      epilogue: {
        text: '试一试改变梯脚的位置。梯子越陡，墙的作用力越小；但三个力始终共点，力三角形始终闭合。',
        audio: '../assets/audio/ex3-6.mp3',
        slider: 's', from: 0.8, to: 2.6, duration: 3200
      }
    },
    controls: [
      { name: 's', label: '梯脚距墙 s (m)', min: 0.8, max: 2.6, step: 0.05, value: 1.5, fmt: function (v) { return v.toFixed(2); } },
      { name: 'G', label: 'G (N)', min: 200, max: 500, step: 10, value: 360, fmt: function (v) { return v.toFixed(0); } }
    ],
    allObjects: ['wall', 'ground', 'ladder', 'gv', 'n1v', 'n2v', 'fv', 'Fv',
      'lnN1', 'lnG', 'lnF', 'triO', 'O', 'q1', 'q2', 'q3',
      'tA', 'tB', 'tC', 'tO', 'tD', 'tG', 'tN1', 'tN2', 'tf', 'tF', 'tTri', 'info'],
    exploreCaption: '拖动 s（梯脚距墙）与 G（梯重），观察共点 O 的位置、地面作用力 F 与墙支持力 N₁ 的实时变化。',
    onExplore: function (api) {
      GGB.show(api, ['wall', 'ground', 'ladder', 'gv', 'n1v', 'n2v', 'fv', 'Fv',
        'q1', 'q2', 'q3', 'tA', 'tB', 'tG', 'tN1', 'tN2', 'tf', 'tF', 'tTri', 'info']);
      GGB.hide(api, ['lnN1', 'lnG', 'lnF', 'triO', 'O', 'tO', 'tD']);
    }
  });
})();
