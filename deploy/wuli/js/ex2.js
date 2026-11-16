/* ============================================================
   ex2.js — 例2：不均匀木板双绳悬挂（∠AOB=90°，AO 与水平成 15°）
   左侧：状态1（无 m，倾斜 15°）—— 三力共点定出重心 D，CD=√3L/6
   右侧：状态2（距 A 端 L/4 加 m，木板水平）—— 力矩平衡求 M
   探究：拖动 m、M、重物位置 p，实时比较两侧力矩
   ============================================================ */

(function () {
  'use strict';

  function build(api) {
    var L = 3;

    /* ---------- 状态1：倾斜悬挂（几何定 CD） ---------- */
    GGB.run(api, [
      'd1 = ' + (L / Math.sqrt(2)).toFixed(4),            // 绳长 OA=OB
      'O1 = (-2.6, 2.2)',                                 // 悬点
      'A1 = O1 + d1 (-cos(15°), -sin(15°))',
      'B1 = O1 + d1 (cos(75°), -sin(75°))',
      'C1 = (A1 + B1) / 2',                               // AB 中点（O1 到杆垂足）
      'D1 = Intersect(Line(A1, B1), Line(O1, O1 + (0, -1)))',   // 重心（O1 正下方）
      'plank1 = Segment(A1, B1)',
      'str1a = Segment(O1, A1)',
      'str1b = Segment(O1, B1)',
      'oc1 = Segment(O1, C1)',                            // OC = L/2
      'cd1 = Segment(C1, D1)',                            // CD = √3L/6
    ]);

    /* 状态1 的三力（汇交于 O1） */
    GGB.run(api, [
      'F1 = Vector(A1, A1 + 0.55 (O1 - A1))',
      'F2 = Vector(B1, B1 + 0.55 (O1 - B1))',
      'G1 = Vector(D1, D1 + (0, -1.35))',
    ]);

    /* ---------- 状态2：水平 + 加 m，力矩平衡 ---------- */
    GGB.run(api, [
      'p = 0.75',                     // 重物距 A 端（L/4 = 0.75）
      'mm = 1',                       // 重物质量 m
      'MM = 0.866',                   // 木板质量 M（√3/2 ≈ 0.866）
      'A2 = (0.6, 0.8)',
      'B2 = (3.6, 0.8)',
      'C2 = (2.1, 0.8)',              // 中点，正对 O2
      'O2 = (2.1, 2.3)',              // OC = L/2 = 1.5
      'D2 = (2.1 + 0.866, 0.8)',      // 重心：CD = √3L/6 ≈ 0.866（偏向 B 侧）
      'S = (0.6 + p, 0.8)',           // 重物位置
      'plank2 = Segment(A2, B2)',
      'str2a = Segment(O2, A2)',
      'str2b = Segment(O2, B2)',
      'mgv = Vector(S, S + (0, -0.55 mm))',
      'Mgv = Vector(D2, D2 + (0, -0.55 MM))',
      'Fc = Vector(C2, C2 + (0, -0.55 (mm + MM)))',       // 平行力合力 F
    ]);

    /* 力矩可视化：以 O2 为轴，两侧力矩画成条形（画在右侧状态2下方） */
    GGB.run(api, [
      'mArm = abs(x(C2) - x(S))',                           // mg 的力臂 |L/2 - p|
      'MArm = abs(x(C2) - x(D2))',                          // Mg 的力臂 CD
      'mMg = MM MArm',                                      // Mg·CD
      'mmg = mm mArm',                                      // mg·力臂
      'barM = Segment((1.1, -0.95), (1.1 + 1.2 mMg, -0.95))', // 木板重力矩条
      'barm = Segment((1.1, -1.45), (1.1 + 1.2 mmg, -1.45))', // 重物力矩条
      'tbarM = Text("M·CD", (1.1, -0.75))',
      'tbarm = Text("m·力臂", (1.1, -1.25))',
    ]);

    /* ---------- 标注 ---------- */
    GGB.run(api, [
      'tO1 = Text("O", O1 + (0.1, 0.12))',
      'tA1 = Text("A", A1 + (-0.28, 0.1))',
      'tB1 = Text("B", B1 + (0.12, -0.05))',
      'tC1 = Text("C", C1 + (-0.05, -0.3))',
      'tD1 = Text("D", D1 + (0.1, -0.28))',
      'tO2 = Text("O", O2 + (0.1, 0.12))',
      'tS = Text("m", S + (0.1, 0.55 mm + 0.05))',
      'tD2 = Text("Mg", D2 + (0.1, -0.55 MM - 0.15))',
      'tC2 = Text("C", C2 + (-0.28, 0.1))',
      'info = Text("状态1：∠COD = 30°，CD = √3L/6　　状态2 平衡条件：M·CD = m·|L/2 − p|", (-4.9, -2.6))',
      'bal = Text("M·CD = " + round(mMg, 2) + "　m·力臂 = " + round(mmg, 2) + "　" + If(abs(mMg - mmg) < 0.02, "✓ 平衡", "✗ 不平衡"), (1.1, -2.1))',
    ]);

    /* ---------- 样式 ---------- */
    ['plank1', 'plank2'].forEach(function (n) { GGB.color(api, n, 2); GGB.thick(api, n, 7); });
    ['str1a', 'str1b', 'str2a', 'str2b'].forEach(function (n) { GGB.color(api, n, 2); GGB.thick(api, n, 2); });
    ['F1', 'F2'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    ['G1', 'Mgv'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    GGB.color(api, 'mgv', 10); GGB.thick(api, 'mgv', 4);
    GGB.color(api, 'Fc', 13); GGB.thick(api, 'Fc', 4);
    ['oc1', 'cd1'].forEach(function (n) { GGB.color(api, n, 13); GGB.thick(api, n, 2); });
    GGB.color(api, 'barM', 10); GGB.color(api, 'barm', 13); GGB.thick(api, 'barM', 6); GGB.thick(api, 'barm', 6);
    ['A1', 'B1', 'O1', 'C1', 'D1', 'A2', 'B2', 'O2', 'C2', 'D2', 'S'].forEach(function (n) {
      try { api.setLabelVisible(n, false); } catch (e) { }
    });

    /* 滑块 */
    try {
      api.setSliderMin('p', 0.1); api.setSliderMax('p', 2.9); api.setSliderStep('p', 0.05);
      api.setSliderMin('mm', 0.2); api.setSliderMax('mm', 3); api.setSliderStep('mm', 0.05);
      api.setSliderMin('MM', 0.2); api.setSliderMax('MM', 3); api.setSliderStep('MM', 0.05);
    } catch (e) { }

    /* 初始隐藏计算量与 GeoGebra 自带滑块（改用 HTML 控制条） */
    GGB.hide(api, ['d1', 'mArm', 'MArm', 'mMg', 'mmg', 'A1', 'B1', 'C1', 'D1', 'O1',
      'A2', 'B2', 'C2', 'D2', 'O2', 'S', 'p', 'mm', 'MM']);

    /* ---------- 画布要点标注（讲解时按时间出现） ---------- */
    GGB.run(api, [
      'mk1 = Text("三力共点：F₁、F₂、Mg", (-5.05, 2.5))',
      'mk2 = Text("OC = L/2，CD = √3L/6", (-5.05, -0.35))',
      'mk3 = Text("平行力合成 F 过 O", (1.35, 2.5))',
      'mk4 = Text("M·CD = m·(L/4)", (-5.05, -3.5))',
    ]);
    ['mk1', 'mk2', 'mk3', 'mk4'].forEach(function (n) {
      GGB.color(api, n, 13);
      try { api.setVisible(n, false); } catch (e) { }
      try { api.setLabelVisible(n, false); } catch (e) { }
      try { api.setFontSize(n, 14); } catch (e) { }
    });

    GGB.view(api, -5.2, 5.4, -3.9, 2.9);
    try {
      api.setCoords('p', -5.05, -0.85);
      api.setCoords('mm', -5.05, -1.45);
      api.setCoords('MM', -5.05, -2.05);
    } catch (e) { }
  }

  var STEPS = [
    {
      label: '状态1：三力共点',
      show: ['plank1', 'str1a', 'str1b', 'F1', 'F2', 'G1', 'tO1', 'tA1', 'tB1', 'tD1'],
      caption: '无 m 时木板受 F₁、F₂、Mg 三力，必汇交于悬点 O——重力作用线通过 O，重心 D 在 O 正下方的杆上。',
      narration: '不放重物时，木板受两根绳的拉力和自身重力，三个力必汇交于悬点O。所以重力的作用线通过O，重心D就在O正下方的板上。',
      audio: '../assets/audio/ex2-1.mp3',
      key: '三力汇交于悬点 O',
      marks: [{ name: 'mk1', delay: 700 }],
    },
    {
      label: '几何关系求 CD',
      show: ['plank1', 'str1a', 'str1b', 'oc1', 'cd1', 'tO1', 'tA1', 'tB1', 'tC1', 'tD1', 'G1'],
      caption: '△OAC 为等腰直角三角形 → OC = L/2；∠COD = 30° → CD = OC·tan30° = √3L/6。',
      narration: '过O作木板的垂线，垂足C是AB的中点。三角形OAC是等腰直角三角形，所以OC等于二分之L。角COD等于30度，于是CD等于六分之根号三L。',
      audio: '../assets/audio/ex2-2.mp3',
      key: '几何定出 CD = √3L/6',
      marks: [{ name: 'mk2', delay: 700 }],
    },
    {
      label: '状态2：平行力合成',
      show: ['plank2', 'str2a', 'str2b', 'mgv', 'Mgv', 'Fc', 'tO2', 'tS', 'tD2', 'tC2'],
      caption: '放 m 后木板水平：mg 与 Mg 是同向平行力，合力 F = (m+M)g 的作用线必过 O，作用点在 C 处。',
      narration: '放上质量m的物体后，木板恰好水平。mg和Mg是同向平行力，它们的合力F，作用线必定过O点，作用点就在C处。',
      audio: '../assets/audio/ex2-3.mp3',
      key: '合成 F 的作用点在 C',
      marks: [{ name: 'mk3', delay: 700 }],
    },
    {
      label: '力矩平衡求 M',
      show: ['plank2', 'str2a', 'str2b', 'mgv', 'Mgv', 'barM', 'barm', 'tbarM', 'tbarm', 'bal', 'info', 'tO2', 'tS', 'tD2'],
      caption: '以 O 为转轴：F₁、F₂ 力矩为零，Mg·CD = mg·(L/4)。两根力矩条等长时平衡，得 M = √3/2·m。',
      narration: '以O为转轴列力矩方程。两根绳的拉力通过O点，力矩为零。所以Mg乘CD等于mg乘四分之L。代入CD，解得M等于二分之根号三m。',
      audio: '../assets/audio/ex2-4.mp3',
      key: '力矩平衡 => M = √3/2·m',
      marks: [{ name: 'mk4', delay: 700 }],
        anim: { slider: 'MM', from: 0.5, to: 0.866, duration: 2400 },
    }
  ];

  new InteractiveCard({
    container: 'ggb-card-2',
    appId: 'ggbAppletEx2',
    width: 820,
    height: 520,
    commands: build,
    steps: STEPS,
    narration: {
      title: '例2 · 不均匀木板的双绳悬挂',
      epilogue: {
        text: '最后拖动重物的位置看看：力矩平衡随之被打破。无论重物在哪里，平衡条件都是同一个——M·CD 等于 m·力臂。',
        audio: '../assets/audio/ex2-6.mp3',
        slider: 'p', from: 0.15, to: 2.85, duration: 3200
      }
    },
    controls: [
      { name: 'p', label: 'p（重物距 A）', min: 0.1, max: 2.9, step: 0.05, value: 0.75, fmt: function (v) { return v.toFixed(2); } },
      { name: 'mm', label: 'm', min: 0.2, max: 3, step: 0.05, value: 1, fmt: function (v) { return v.toFixed(2); } },
      { name: 'MM', label: 'M', min: 0.2, max: 3, step: 0.05, value: 0.866, fmt: function (v) { return v.toFixed(2); } }
    ],
    allObjects: ['plank1', 'str1a', 'str1b', 'F1', 'F2', 'G1', 'oc1', 'cd1',
      'plank2', 'str2a', 'str2b', 'mgv', 'Mgv', 'Fc', 'barM', 'barm', 'tbarM', 'tbarm',
      'tO1', 'tA1', 'tB1', 'tC1', 'tD1', 'tO2', 'tS', 'tD2', 'tC2', 'info', 'bal'],
    exploreCaption: '拖动 m、M、p 滑块：右侧木板下方两根力矩条（M·CD 与 m·力臂）等长时恰好平衡。p = L/4、M = √3/2·m 为书中原解。',
    onExplore: function (api) {
      GGB.show(api, ['plank1', 'str1a', 'str1b', 'F1', 'F2', 'G1', 'oc1', 'cd1',
        'plank2', 'str2a', 'str2b', 'mgv', 'Mgv', 'Fc', 'barM', 'barm', 'tbarM', 'tbarm',
        'tO1', 'tA1', 'tB1', 'tC1', 'tD1', 'tO2', 'tS', 'tD2', 'tC2', 'info', 'bal']);
    }
  });
})();
