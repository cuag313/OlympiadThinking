/* ============================================================
   ex5.js — 例5：两棒铰接（∠ABC=90°，C 在 A 正下方），C 端加外力 F
   探究：拖 m₁/m₂，实时解出平衡角 θ 与 F 大小，方向范围可视化
   演示：方向范围 → 共点收紧 tanβ≤1/2 → 两个转轴方程 → 联立求解
   ============================================================ */

(function () {
  'use strict';

  function build(api) {
    /* ---------- 参数 ---------- */
    GGB.run(api, [
      'm1 = 1',                     // AB 棒质量
      'm2 = 2',                     // BC 棒质量
      'g = 10',
      'k = 0.032',                  // 力的显示比例
      'th = atan((m1 + m2) / (m1 + 3 m2))',        // 平衡角 θ（F 与 AC 的夹角）
      'Fm = (m1 + m2) g / (4 sin(th))',            // 外力大小
      'betam = atan(1 / 2)',        // F 方向角上限
    ]);
    try {
      api.setSliderMin('m1', 0.5); api.setSliderMax('m1', 3); api.setSliderStep('m1', 0.1);
      api.setSliderMin('m2', 0.5); api.setSliderMax('m2', 3); api.setSliderStep('m2', 0.1);
    } catch (e) { }

    /* ---------- 几何：A 上铰，AB⊥BC，C 在 A 正下方（l=1） ---------- */
    GGB.run(api, [
      'A = (0, 0)',
      'B = (1 / sqrt(2), -1 / sqrt(2))',
      'Cc = (0, -sqrt(2))',
      'rodAB = Segment(A, B)',
      'rodBC = Segment(B, Cc)',
      'vline = Segment(A, Cc)',
      'O1 = (A + B) / 2',
      'O2 = (B + Cc) / 2',
    ]);

    /* ---------- 力：G₁、G₂ 与外力 F ---------- */
    GGB.run(api, [
      'G1v = Vector(O1, O1 + (0, -k m1 g))',
      'G2v = Vector(O2, O2 + (0, -k m2 g))',
      'Fv = Vector(Cc, Cc + k Fm (sin(th), cos(th)))',   // F：与竖直 AC 成 θ，指向右上
    ]);

    /* ---------- 方向范围：∠ACB 扇形（0~45°）与收紧界（tanβ≤1/2） ---------- */
    GGB.run(api, [
      'r0 = 1.15',
      'rayCA = Segment(Cc, Cc + (0, r0))',
      'rayCB = Segment(Cc, Cc + r0 (1 / sqrt(2), 1 / sqrt(2)))',
      'rayLim = Segment(Cc, Cc + r0 (sin(betam), cos(betam)))',
    ]);

    /* ---------- 力三角形（右侧） ---------- */
    GGB.run(api, [
      'Q0 = (1.75, -0.42)',
      'Q1 = Q0 + (0, -k (m1 + m2) g)',
      'Q2 = Q1 + k Fm (sin(th), cos(th))',
      'q1 = Vector(Q0, Q1)',
      'q2 = Vector(Q1, Q2)',
      'q3 = Vector(Q2, Q0)',
    ]);

    /* ---------- 标注 ---------- */
    GGB.run(api, [
      'tA = Text("A", A + (-0.22, 0.06))',
      'tB = Text("B", B + (0.08, 0.08))',
      'tC = Text("C", Cc + (-0.22, -0.08))',
      'tO1 = Text("G₁", O1 + (0.08, -k m1 g - 0.08))',
      'tO2 = Text("G₂", O2 + (0.08, -k m2 g - 0.08))',
      'tF = Text("F", Cc + k Fm (sin(th), cos(th)) + (0.06, 0.06))',
      'tTri = Text("力三角形", Q0 + (-0.2, 0.3))',
      'info = Text("θ = " + round(180 th / pi, 1) + "°   F = " + round(Fm, 1) + " N", (1.25, 0.28))',
    ]);

    /* ---------- 样式 ---------- */
    ['rodAB', 'rodBC'].forEach(function (n) { GGB.thick(api, n, 7); GGB.color(api, n, 2); });
    GGB.thick(api, 'vline', 1); GGB.color(api, 'vline', 8);
    ['G1v', 'G2v', 'q1'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    ['Fv', 'q2', 'q3'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    ['rayCA', 'rayCB'].forEach(function (n) { GGB.color(api, n, 8); GGB.thick(api, n, 1); });
    GGB.color(api, 'rayLim', 13); GGB.thick(api, 'rayLim', 2);
    ['A', 'B', 'Cc', 'O1', 'O2', 'Q0', 'Q1', 'Q2'].forEach(function (n) {
      try { api.setLabelVisible(n, false); } catch (e) { }
    });
    GGB.hide(api, ['m1', 'm2', 'g', 'k', 'th', 'Fm', 'betam', 'r0', 'Q0', 'Q1', 'Q2', 'O1', 'O2']);

    GGB.view(api, -0.9, 3.1, -1.95, 0.65);
    try {
      api.setCoords('m1', -0.85, 0.45);
      api.setCoords('m2', -0.85, 0.18);
    } catch (e) { }
  }

  var STEPS = [
    {
      label: '方向范围 ∠ACB',
      show: ['rodAB', 'rodBC', 'vline', 'rayCA', 'rayCB', 'Fv', 'tA', 'tB', 'tC', 'tF'],
      caption: '以整体为对象：F 不可能指向 AC 左侧或 BC 右下方，故 F 的方向只能在 ∠ACB 内（0°<θ<45°）。',
      narration: '以ABC整体为对象，不计摩擦，外力F的方向不可能指向AC左侧，也不能在BC右下方。所以F的方向只能在角ACB的范围内，也就是零到四十五度之间。',
      audio: '../assets/audio/ex5-1.mp3'
    },
    {
      label: '共点收紧范围',
      show: ['rodAB', 'rodBC', 'rayCA', 'rayCB', 'rayLim', 'Fv', 'tA', 'tB', 'tC', 'tF', 'info'],
      caption: '整体受 F、G₁+G₂、F_A 三力必共点 → F 作用线过 O₁O₂ 连线上某点；作 CO₁ 得 tanβ ≤ 1/2。',
      narration: '整体受三个力：F，系统重力，A处的作用力。三力必须共点，所以F的作用线要通过两棒重心连线上的某一点。作CO1连线，得到F方向的上限：tan贝塔小于二分之一。',
      audio: '../assets/audio/ex5-2.mp3'
    },
    {
      label: '转轴 A 方程',
      show: ['rodAB', 'rodBC', 'G1v', 'G2v', 'Fv', 'tA', 'tB', 'tC', 'tO1', 'tO2', 'tF'],
      caption: '以 A 为转轴：(m₁+m₂)g·(l/2)cos45° = F·√2·l·sinθ，即 (m₁+m₂)gl = 4Fl·sinθ  ①',
      narration: '以A为转轴列方程。两棒总重的力矩，等于F对A的力矩，得到方程一：(m1加m2)gl等于4Fl乘sine西塔。',
      audio: '../assets/audio/ex5-3.mp3'
    },
    {
      label: '转轴 B 方程（BC 杆）',
      show: ['rodAB', 'rodBC', 'G1v', 'G2v', 'Fv', 'tA', 'tB', 'tC', 'tO1', 'tO2', 'tF'],
      caption: '以 B 为转轴看 BC 杆：m₂g·(l/2)sin45° = Fl·sin(45°−θ)，即 √2·m₂gl = 4Fl·sin(45°−θ)  ②',
      narration: '再以B为转轴，只看BC棒：BC重力的力矩等于F对B的力矩，得到方程二。两式相除，消去F和l。',
      audio: '../assets/audio/ex5-4.mp3'
    },
    {
      label: '联立求解',
      show: ['rodAB', 'rodBC', 'G1v', 'G2v', 'Fv', 'q1', 'q2', 'q3', 'tTri', 'tO1', 'tO2', 'tF', 'info'],
      caption: '①÷② 联立：tanθ = (m₁+m₂)/(m₁+3m₂)。代入 m₁=1、m₂=2：θ≈23°，F = (m₁+m₂)g/(4sinθ) ≈ 19 N。',
      narration: '代入m1等于1公斤、m2等于2公斤，解得tan西塔等于七分之三，西塔约等于二十三度。再代回方程一，F等于十九牛顿。',
      audio: '../assets/audio/ex5-5.mp3'
    }
  ];

  new InteractiveCard({
    container: 'ggb-card-5',
    appId: 'ggbAppletEx5',
    width: 820,
    height: 480,
    commands: build,
    steps: STEPS,
    narration: {
      title: '例5 · 双棒铰接的平衡与外力范围',
      epilogue: {
        text: '改变两棒的质量比，外力的大小和方向会跟着变，但平衡角始终满足 tanθ = (m₁+m₂)/(m₁+3m₂)。规律是普适的。',
        audio: '../assets/audio/ex5-6.mp3',
        slider: 'm2', from: 0.5, to: 3, duration: 3200
      }
    },
    controls: [
      { name: 'm1', label: 'm₁ (kg)', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
      { name: 'm2', label: 'm₂ (kg)', min: 0.5, max: 3, step: 0.1, value: 2, fmt: function (v) { return v.toFixed(1); } }
    ],
    allObjects: ['rodAB', 'rodBC', 'vline', 'G1v', 'G2v', 'Fv', 'rayCA', 'rayCB', 'rayLim',
      'q1', 'q2', 'q3', 'tA', 'tB', 'tC', 'tO1', 'tO2', 'tF', 'tTri', 'info'],
    exploreCaption: '拖动 m₁、m₂：平衡角 θ = arctan[(m₁+m₂)/(m₁+3m₂)]，外力 F = (m₁+m₂)g/(4sinθ)。橙色射线是 tanβ=1/2 的方向上限。',
    onExplore: function (api) {
      GGB.show(api, ['rodAB', 'rodBC', 'vline', 'G1v', 'G2v', 'Fv', 'rayCA', 'rayCB', 'rayLim',
        'q1', 'q2', 'q3', 'tA', 'tB', 'tC', 'tO1', 'tO2', 'tF', 'tTri', 'info']);
    }
  });
})();
