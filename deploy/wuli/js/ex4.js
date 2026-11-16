/* ============================================================
   ex4.js — 例4：三铰拱 ABC，C 点受水平力 F，求支座 A、B 的作用力
   探究：拖动 F，观察 N_A/N_B 与矢量三角形；分半分析显示 BC 二力件
   演示：整体受力 → 方向范围 → 分半定共点 C → 对称求解 → 力三角形
   ============================================================ */

(function () {
  'use strict';

  function build(api) {
    /* ---------- 参数 ---------- */
    GGB.run(api, [
      'Fm = 2',                 // F 大小（绘图单位）
      'k = 0.55',               // 力的显示比例
      'Nm = Fm / sqrt(2)',      // N_A = N_B = √2/2 F
    ]);
    try {
      api.setSliderMin('Fm', 0.8); api.setSliderMax('Fm', 3.2); api.setSliderStep('Fm', 0.1);
    } catch (e) { }

    /* ---------- 几何：半圆拱（跨 2、高 1） ---------- */
    GGB.run(api, [
      'A = (-1, 0)',
      'B = (1, 0)',
      'C = (0, 1)',
      'arch = Semicircle(A, B)',              // 上半圆弧 A—C—B（有向线段左侧）
      'base = Segment(A, B)',                 // 基线
    ]);

    /* ---------- 三力与作用线 ---------- */
    GGB.run(api, [
      'Fv = Vector(C, C + (k Fm, 0))',                          // F 水平向右
      'NAv = Vector(A, A + k Nm (-1 / sqrt(2), -1 / sqrt(2)))', // N_A 左下 45°（拉力）
      'NBv = Vector(B, B + k Nm (-1 / sqrt(2), 1 / sqrt(2)))',  // N_B 左上 45°（支持力）
      'lnA = Line(A, C)',                     // N_A 作用线沿 CA
      'lnB = Line(B, C)',                     // N_B 作用线沿 CB
      'lnF = Line(C, C + (1, 0))',            // F 作用线（水平）
    ]);

    /* ---------- 分半分析：BC 为二力件 ---------- */
    GGB.run(api, [
      'halfBC = Polyline((0.06, 0.94), (0.94, 0.06))',   // BC 连线（高亮）
    ]);

    /* ---------- 力三角形（右侧） ---------- */
    GGB.run(api, [
      'Q0 = (2.15, 1.1)',
      'Q1 = Q0 + (k Fm, 0)',
      'Q2 = Q1 + k Nm (-1 / sqrt(2), 1 / sqrt(2))',
      'q1 = Vector(Q0, Q1)',
      'q2 = Vector(Q1, Q2)',
      'q3 = Vector(Q2, Q0)',
    ]);

    /* ---------- 标注 ---------- */
    GGB.run(api, [
      'tA = Text("A", A + (-0.22, -0.12))',
      'tB = Text("B", B + (0.1, -0.12))',
      'tC = Text("C", C + (-0.22, 0.08))',
      'tF = Text("F", C + (k Fm + 0.08, 0.12))',
      'tNA = Text("N_A", A + k Nm (-1 / sqrt(2), -1 / sqrt(2)) + (-0.28, -0.05))',
      'tNB = Text("N_B", B + k Nm (-1 / sqrt(2), 1 / sqrt(2)) + (-0.34, 0.1))',
      'tTri = Text("力三角形", Q0 + (0.15, 0.35))',
      'info = Text("N_A = N_B = √2/2 F = " + round(Nm, 2), (2.05, 0.55))',
    ]);

    /* ---------- 样式 ---------- */
    GGB.thick(api, 'arch', 6); GGB.color(api, 'arch', 2);
    GGB.thick(api, 'base', 1); GGB.color(api, 'base', 8);
    GGB.color(api, 'Fv', 10); GGB.thick(api, 'Fv', 4);
    ['NAv', 'NBv', 'q2', 'q3'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    GGB.color(api, 'q1', 10); GGB.thick(api, 'q1', 4);
    ['lnA', 'lnB', 'lnF'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    GGB.color(api, 'halfBC', 13); GGB.thick(api, 'halfBC', 5);
    ['A', 'B', 'C', 'Q0', 'Q1', 'Q2'].forEach(function (n) {
      try { api.setLabelVisible(n, false); } catch (e) { }
    });
    GGB.hide(api, ['Fm', 'Nm', 'k', 'Q0', 'Q1', 'Q2', 'base']);

    /* ---------- 画布要点标注（讲解时按时间出现） ---------- */
    GGB.run(api, [
      'mk1 = Text("三力：F、N_A、N_B", (-1.95, 1.5))',
      'mk2 = Text("方向范围 90°", (-1.95, -1.05))',
      'mk3 = Text("BC 二力件 => 共点 C", (0.75, 1.5))',
      'mk4 = Text("2N_A·cos45° = F", (1.0, -1.05))',
      'mk5 = Text("N = √2/2 F", (1.15, 0.3))',
    ]);
    ['mk1', 'mk2', 'mk3', 'mk4', 'mk5'].forEach(function (n) {
      GGB.color(api, n, 13);
      try { api.setVisible(n, false); } catch (e) { }
      try { api.setLabelVisible(n, false); } catch (e) { }
      try { api.setFontSize(n, 14); } catch (e) { }
    });

    GGB.view(api, -2.0, 3.6, -1.15, 1.8);
    try {
      api.setCoords('Fm', -1.55, 1.55);
    } catch (e) { }
  }

  var STEPS = [
    {
      label: '整体受力',
      show: ['arch', 'Fv', 'NAv', 'NBv', 'tA', 'tB', 'tC', 'tF', 'tNA', 'tNB'],
      caption: '拱的重量不计，整体只受三个力：C 点的水平力 F、A 处支座作用力、B 处支座作用力。',
      narration: '由于拱的重量不计，整体只受三个力：C点的水平力F，A处支座的作用力，B处支座的作用力。三力平衡，必定共点。',
      audio: '../assets/audio/ex4-1.mp3',
      key: '整体受三个力',
      marks: [{ name: 'mk1', delay: 700 }],
    },
    {
      label: '方向范围',
      show: ['arch', 'Fv', 'NAv', 'NBv', 'lnA', 'lnB', 'lnF', 'tA', 'tB', 'tC', 'tF'],
      caption: 'B 处受力只能向左上方（90° 范围），A 处只能向左下方——三力共点必在 F 的作用线上。',
      narration: '先判断方向范围：B处的力指向左上方，A处的力指向左下方。三个力的公共点，一定在F的作用线上。',
      audio: '../assets/audio/ex4-2.mp3',
      key: '判断方向范围',
      marks: [{ name: 'mk2', delay: 700 }],
    },
    {
      label: '分半定共点',
      show: ['arch', 'halfBC', 'Fv', 'NAv', 'NBv', 'lnA', 'lnB', 'tA', 'tB', 'tC', 'tF', 'tNA', 'tNB'],
      caption: '右半 BC 只在两端受力，是二力件——B 处作用线必沿 BC；于是 N_A 的作用线也过 C，三力共点于 C。',
      narration: '把拱分成左右两半。右半BC只在B、C两点受力，是二力杆，B处的作用线必沿BC。于是左边AC上，A处的作用线也必须过C点，三力共点就在C。',
      audio: '../assets/audio/ex4-3.mp3',
      key: '分半分析定共点 C',
      marks: [{ name: 'mk3', delay: 700 }],
    },
    {
      label: '对称求解',
      show: ['arch', 'Fv', 'NAv', 'NBv', 'tA', 'tB', 'tC', 'tF', 'tNA', 'tNB', 'info'],
      caption: '由对称性 N_A = N_B，把三力移到 C 点：2N_A·cos45° = F，故 N_A = N_B = √2/2·F。',
      narration: '由对称性，A、B两处的力大小相等。把三力移到C点，竖直方向抵消，水平方向：二倍的N乘cosine四十五度等于F。',
      audio: '../assets/audio/ex4-4.mp3',
      key: '对称求解',
      marks: [{ name: 'mk4', delay: 700 }],
        anim: { slider: 'Fm', from: 1, to: 3, duration: 2400 },
    },
    {
      label: '力三角形',
      show: ['q1', 'q2', 'q3', 'tTri', 'info'],
      caption: 'F、N_A、N_B 首尾相接构成封闭三角形：A 处拉力沿左下 45°，B 处支持力沿左上 45°。',
      narration: '解得NA等于NB等于二分之根号二F。A处是拉力，沿左下四十五度；B处是支持力，沿左上四十五度。矢量三角形正好闭合。',
      audio: '../assets/audio/ex4-5.mp3',
      key: '力三角形闭合',
      marks: [{ name: 'mk5', delay: 700 }],
    }
  ];

  new InteractiveCard({
    container: 'ggb-card-4',
    appId: 'ggbAppletEx4',
    width: 820,
    height: 440,
    commands: build,
    steps: STEPS,
    narration: {
      title: '例4 · 三铰拱的支座作用力',
      epilogue: {
        text: '最后看普遍性。无论水平力 F 多大，支座的作用力总是它的二分之根号二倍，方向也不变——这就是对称性的力量。',
        audio: '../assets/audio/ex4-6.mp3',
        slider: 'Fm', from: 0.8, to: 3.2, duration: 3200
      }
    },
    controls: [
      { name: 'Fm', label: 'F', min: 0.8, max: 3.2, step: 0.1, value: 2, fmt: function (v) { return v.toFixed(1); } }
    ],
    allObjects: ['arch', 'Fv', 'NAv', 'NBv', 'lnA', 'lnB', 'lnF', 'halfBC',
      'q1', 'q2', 'q3', 'tA', 'tB', 'tC', 'tF', 'tNA', 'tNB', 'tTri', 'info'],
    exploreCaption: '拖动 F 观察支座作用力的变化：无论 F 多大，N_A = N_B = √2/2·F，方向分别沿左下、左上 45°。',
    onExplore: function (api) {
      GGB.show(api, ['arch', 'Fv', 'NAv', 'NBv', 'q1', 'q2', 'q3',
        'tA', 'tB', 'tC', 'tF', 'tNA', 'tNB', 'tTri', 'info']);
      GGB.hide(api, ['lnA', 'lnB', 'lnF', 'halfBC']);
    }
  });
})();
