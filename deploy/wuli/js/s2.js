/* ============================================================
   s2.js — 第二节 绳索悬挂物平衡：例 1–8 GeoGebra 交互（oPhysics 先算后验）
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

  /* ================= 例1 双绳悬挂木杆 ================= */
  function build1(api) {
    GGB.run(api, [
      'P = 1', 'Q = 1', 'Gm = 1.5', 'k = 0.32',
      'alp = atan(sqrt(3) (2 Q + Gm) / (4 P + 3 Gm + 2 Q))',
      'L = 2.1',
      'O = (0, 2)',
      'A = O + L (-sin(alp), -cos(alp))',
      'B = O + L (sin(60° - alp), -cos(60° - alp))',
      'C = (A + B) / 2',
      'ropeA = Segment(O, A)',
      'ropeB = Segment(O, B)',
      'rodAB = Segment(A, B)',
      'pv = Vector(A, A + (0, -k P))',
      'qv = Vector(B, B + (0, -k Q))',
      'gv = Vector(C, C + (0, -k Gm))',
      'AE = L sin(alp)',
      'CF = sqrt(3) / 2 L sin(30° - alp)',
      'BD = L cos(30° + alp)',
      'barP = Segment((3.2, -1.2), (3.2 + 0.8 P AE, -1.2))',
      'barGQ = Segment((3.2, -1.8), (3.2 + 0.8 (Gm CF + Q BD), -1.8))',
      'tP = Text("P·AE", (3.2, -0.95))',
      'tGQ = Text("G·CF + Q·BD", (3.2, -1.55))',
      'info = Text("α = " + round(180 alp / pi, 1) + "°", (-3.8, 2.5))',
    ]);
    addMarks(api, [
      ['mk1', '△OAB 等边：三边长均为 L', '(-3.8, 2.05)'],
      ['mk2', '力矩平衡：P·AE = G·CF + Q·BD', '(2.6, -0.55)'],
    ]);
    ['ropeA', 'ropeB'].forEach(function (n) { GGB.thick(api, n, 2); GGB.color(api, n, 2); });
    GGB.thick(api, 'rodAB', 7); GGB.color(api, 'rodAB', 2);
    ['pv', 'gv'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    GGB.color(api, 'qv', 10); GGB.thick(api, 'qv', 4);
    GGB.color(api, 'barP', 13); GGB.thick(api, 'barP', 7);
    GGB.color(api, 'barGQ', 4); GGB.thick(api, 'barGQ', 7);
    ['A', 'B', 'C', 'O'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['P', 'Q', 'Gm', 'k', 'alp', 'L', 'AE', 'CF', 'BD']);
    GGB.view(api, -4.2, 6.2, -3.2, 3.1);
    try { api.setCoords('P', -4.1, 2.7); } catch (e) { }
  }

  /* ================= 例2 直角折绳 ================= */
  function build2(api) {
    GGB.run(api, [
      'Gm = 2', 'alp = 35',
      'Tm = Gm cos(alp°)',
      'O = (0, 0)',
      'A = O + 1.7 (-cos(alp°), sin(alp°))',
      'B = O + 1.7 (sin(alp°), cos(alp°))',
      'ropeA = Segment(O, A)',
      'ropeB = Segment(O, B)',
      'gv = Vector(O, O + (0, -0.55 Gm))',
      'Tv = Vector(O, O + 0.55 Tm (sin(alp°), cos(alp°)))',
      'barT = Segment((2.2, -1.6), (2.2 + 0.9 Tm, -1.6))',
      'barG = Segment((2.2, -2.2), (2.2 + 0.9 Gm cos(alp°), -2.2))',
      'tT = Text("T·OA", (2.2, -1.35))',
      'tG = Text("G·OA·cosα", (2.2, -1.95))',
      'info = Text("T = Gcosα = " + round(Tm, 2), (-2.6, -2.9))',
    ]);
    addMarks(api, [
      ['mk1', '∠AOB = 90°，OA 可当刚体', '(-2.6, 2.5)'],
      ['mk2', 'A 为转轴：T·OA = G·OA·cosα', '(1.4, -2.75)'],
    ]);
    ['ropeA', 'ropeB'].forEach(function (n) { GGB.thick(api, n, 2.4); GGB.color(api, n, 2); });
    GGB.color(api, 'gv', 10); GGB.thick(api, 'gv', 4);
    GGB.color(api, 'Tv', 4); GGB.thick(api, 'Tv', 4);
    GGB.color(api, 'barT', 13); GGB.thick(api, 'barT', 7);
    GGB.color(api, 'barG', 4); GGB.thick(api, 'barG', 7);
    ['A', 'B', 'O'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['Gm', 'Tm']);
    GGB.view(api, -3.2, 5.4, -3.3, 3.1);
    try { api.setCoords('alp', -3.1, 2.6); } catch (e) { }
  }

  /* ================= 例3 三段绳挂双物 ================= */
  function build3(api) {
    GGB.run(api, [
      'GB = 1', 'GC = 1', 'k = 0.5',
      'th = atan((1 + GB / GC) / (cot(30°) - (GB / GC) cot(60°)))',
      'A = (-2.2, 1.9)',
      'B = A + 1.4 (sin(30°), -cos(30°))',
      'C = B + 1.5 (sin(th), -cos(th))',
      'D = C + 1.3 (sin(60°), cos(60°))',
      'sAB = Segment(A, B)', 'sBC = Segment(B, C)', 'sCD = Segment(C, D)',
      'gvB = Vector(B, B + (0, -k GB))',
      'gvC = Vector(C, C + (0, -k GC))',
      'info = Text("θ = " + round(180 th / pi, 1) + "°", (-3.8, -2.6))',
    ]);
    addMarks(api, [
      ['mk1', 'AB 与铅直 30°，CD 与铅直 60°', '(-3.8, 2.7)'],
      ['mk2', 'B、C 两点各自平衡 => 解出 θ', '(-3.8, -2.15)'],
    ]);
    ['sAB', 'sCD'].forEach(function (n) { GGB.thick(api, n, 2); GGB.color(api, n, 2); });
    GGB.thick(api, 'sBC', 2.6); GGB.color(api, 'sBC', 2);
    ['gvB', 'gvC'].forEach(function (n) { GGB.color(api, n, 10); GGB.thick(api, n, 4); });
    ['A', 'B', 'C', 'D'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['GB', 'GC', 'k', 'th']);
    GGB.view(api, -4.2, 3.8, -3.2, 2.9);
    try { api.setCoords('GB', -4.1, 2.55); api.setCoords('GC', -4.1, 2.1); } catch (e) { }
  }

  /* ================= 例4 杆球系统 ================= */
  function build4(api) {
    GGB.run(api, [
      'rat = 1', 'rr = 0.32', 'k = 0.5',
      'sinalp = rat / (1 + rat) rr',
      'alp = asin(sinalp)',
      'u = 2.4',
      'r = rr u',
      'O = (0, 2.2)',
      'A = O + u (sin(alp), -cos(alp))',
      'D = A + (-r, 0)',
      'ball = Circumference(A, r)',
      'rodOA = Segment(O, A)',
      'strOD = Segment(O, D)',
      'strQ = Segment(D, D + (-0.2, -1.1))',
      'pv = Vector(A, A + (0, -k (1 + rat)))',
      'qv = Vector(D + (-0.2, -1.1), D + (-0.2, -1.1) + (0, -k rat))',
      'AH = u sin(alp)',
      'DH = r - AH',
      'barP = Segment((2.6, -1.3), (2.6 + 1.1 (1 + rat) AH, -1.3))',
      'barQ = Segment((2.6, -1.9), (2.6 + 1.1 rat DH, -1.9))',
      'tP = Text("P·AH", (2.6, -1.05))',
      'tQ = Text("Q·DH", (2.6, -1.65))',
      'info = Text("α = " + round(180 alp / pi, 1) + "°", (-3.4, -2.9))',
    ]);
    addMarks(api, [
      ['mk1', '绳 OD 可当刚体，△OAD 整体取矩', '(-3.4, 2.75)'],
      ['mk2', 'O 为转轴：P·AH = Q·DH', '(2.2, -2.65)'],
    ]);
    GGB.thick(api, 'rodOA', 5); GGB.color(api, 'rodOA', 2);
    GGB.thick(api, 'ball', 2); GGB.color(api, 'ball', 2);
    ['strOD', 'strQ'].forEach(function (n) { GGB.thick(api, n, 2); GGB.color(api, n, 2); });
    GGB.color(api, 'pv', 10); GGB.thick(api, 'pv', 4);
    GGB.color(api, 'qv', 10); GGB.thick(api, 'qv', 4);
    GGB.color(api, 'barP', 13); GGB.thick(api, 'barP', 7);
    GGB.color(api, 'barQ', 4); GGB.thick(api, 'barQ', 7);
    ['A', 'D', 'O'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['rat', 'rr', 'k', 'sinalp', 'alp', 'u', 'r', 'AH', 'DH']);
    GGB.view(api, -3.8, 5.6, -3.3, 3.1);
    try { api.setCoords('rat', -3.7, 2.7); api.setCoords('rr', -3.7, 2.2); } catch (e) { }
  }

  /* ================= 例5 吊杆加水平拉力 ================= */
  function build5(api) {
    GGB.run(api, [
      'Gm = 3', 'k = 0.3',
      'Fm = Gm / sqrt(3)',
      'll = 1.7', 'LL = 2.2',
      'A = (-1.6, 1.9)',
      'B = A + ll (cos(60°), -sin(60°))',
      'C = B + LL (cos(30°), -sin(30°))',
      'Gpt = B + LL / 3 (cos(30°), -sin(30°))',
      'O = (x(Gpt), y(C))',
      'rope = Segment(A, B)',
      'rod = Segment(B, C)',
      'Fv = Vector(C, C + (k Fm, 0))',
      'gv = Vector(Gpt, Gpt + (0, -k Gm))',
      'Tv = Vector(B, B + 0.6 (x(A) - x(B), y(A) - y(B)))',
      'barF = Segment((1.6, -1.7), (1.6 + 0.9 Fm LL sin(30°), -1.7))',
      'barG = Segment((1.6, -2.3), (1.6 + 0.9 Gm LL / 3 cos(30°), -2.3))',
      'tF = Text("F·Lsin30°", (1.6, -1.45))',
      'tG = Text("G·xcos30°", (1.6, -2.05))',
      'info = Text("F = √3/3 G = " + round(Fm, 2) + "，重心离 B 端 L/3", (-2.6, -2.95))',
    ]);
    addMarks(api, [
      ['mk1', '三力共点于 O：T、F、G', '(-2.6, 2.65)'],
      ['mk2', 'B 为转轴：F·Lsin30° = G·xcos30°', '(1.2, -2.75)'],
    ]);
    GGB.color(api, 'rope', 2); GGB.thick(api, 'rope', 2.2);
    GGB.color(api, 'rod', 2); GGB.thick(api, 'rod', 7);
    GGB.color(api, 'Fv', 4); GGB.thick(api, 'Fv', 4);
    GGB.color(api, 'Tv', 4); GGB.thick(api, 'Tv', 4);
    GGB.color(api, 'gv', 10); GGB.thick(api, 'gv', 4);
    GGB.color(api, 'barF', 13); GGB.thick(api, 'barF', 7);
    GGB.color(api, 'barG', 4); GGB.thick(api, 'barG', 7);
    ['A', 'B', 'C', 'O', 'Gpt'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['Gm', 'k', 'Fm', 'll', 'LL', 'Gpt']);
    GGB.view(api, -3.4, 5.2, -3.35, 2.7);
    try { api.setCoords('Gm', -3.3, 2.3); } catch (e) { }
  }

  /* ================= 例6 球靠光滑墙 ================= */
  function build6(api) {
    GGB.run(api, [
      'Gm = 3', 'LL = 1.9', 'RR = 1.0', 'k = 0.42',
      'ABB = sqrt((LL + RR)^2 - RR^2)',
      'Nm = Gm RR / ABB',
      'Tm = Gm (LL + RR) / ABB',
      'wallx = -2.4',
      'O = (wallx + RR, -0.2)',
      'A = (wallx, -0.2 + ABB)',
      'Cc = O + RR / (LL + RR) (x(A) - x(O), y(A) - y(O))',
      'ball = Circumference(O, RR)',
      'wall = Segment((wallx, -2.2), (wallx, 2.4))',
      'str = Segment(A, Cc)',
      'gv = Vector(O, O + (0, -k Gm))',
      'Nv = Vector(O, O + (-k Nm, 0))',
      'Tv = Vector(Cc, Cc + k Tm / (LL + RR) (x(A) - x(Cc), y(A) - y(Cc)))',
      'barGR = Segment((1.4, -1.7), (1.4 + 0.9 Gm RR, -1.7))',
      'barN = Segment((1.4, -2.3), (1.4 + 0.9 Nm ABB, -2.3))',
      'tGR = Text("G·R", (1.4, -1.45))',
      'tN = Text("N·AB", (1.4, -2.05))',
      'info = Text("T = " + round(Tm, 2) + "，N = " + round(Nm, 2), (0.6, 2.6))',
    ]);
    addMarks(api, [
      ['mk1', '墙光滑：N 水平向右', '(0.6, 2.15)'],
      ['mk2', 'A 为转轴：G·R = N·AB（验算）', '(1.0, -2.75)'],
    ]);
    GGB.color(api, 'wall', 2); GGB.thick(api, 'wall', 3);
    GGB.color(api, 'ball', 2); GGB.thick(api, 'ball', 2);
    GGB.color(api, 'str', 2); GGB.thick(api, 'str', 2.2);
    GGB.color(api, 'gv', 10); GGB.thick(api, 'gv', 4);
    ['Nv', 'Tv'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    GGB.color(api, 'barGR', 13); GGB.thick(api, 'barGR', 7);
    GGB.color(api, 'barN', 4); GGB.thick(api, 'barN', 7);
    ['A', 'O', 'Cc'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['Gm', 'LL', 'RR', 'k', 'ABB', 'Nm', 'Tm', 'wallx']);
    GGB.view(api, -3.6, 4.2, -3.2, 3.1);
    try { api.setCoords('LL', -3.5, 2.65); api.setCoords('RR', -3.5, 2.15); } catch (e) { }
  }

  /* ================= 例7 球放球面 ================= */
  function build7(api) {
    GGB.run(api, [
      'Gm = 3', 'LL = 1.5', 'dd = 0.7', 'RR = 1.2', 'k = 0.5',
      'u = RR + dd',
      'ang = acos((RR^2 + u^2 - LL^2) / (2 RR u))',
      'Tm = Gm LL / u',
      'Nm = Gm RR / u',
      'A = (0, 2.3)',
      'O = (0, 2.3 - u)',
      'B = O + RR (-sin(ang), cos(ang))',
      'big = Circumference(O, RR)',
      'small = Circumference(B, 0.3)',
      'str = Segment(A, B)',
      'lnOB = Segment(O, B)',
      'gv = Vector(B, B + (0, -k Gm))',
      'Nv = Vector(B, B + k Nm / RR (x(B) - x(O), y(B) - y(O)))',
      'Tv = Vector(B, B + k Tm / LL (x(A) - x(B), y(A) - y(B)))',
      'barN = Segment((1.9, -1.6), (1.9 + 0.9 Nm u, -1.6))',
      'barG = Segment((1.9, -2.2), (1.9 + 0.9 Gm RR, -2.2))',
      'tN = Text("N·(R+d)", (1.9, -1.35))',
      'tG = Text("G·R", (1.9, -1.95))',
      'info = Text("T = LG/(R+d) = " + round(Tm, 2) + "，N = RG/(R+d) = " + round(Nm, 2), (-2.6, -2.95))',
    ]);
    addMarks(api, [
      ['mk1', 'AB 与 OB 皆可当刚体', '(-2.6, 2.75)'],
      ['mk2', 'A 为转轴：N(R+d) = G·R（验算）', '(1.5, -2.75)'],
    ]);
    GGB.color(api, 'big', 2); GGB.thick(api, 'big', 2);
    GGB.color(api, 'small', 2); GGB.thick(api, 'small', 2);
    GGB.color(api, 'str', 2); GGB.thick(api, 'str', 2.2);
    GGB.color(api, 'lnOB', 8); GGB.thick(api, 'lnOB', 1);
    GGB.color(api, 'gv', 10); GGB.thick(api, 'gv', 4);
    ['Nv', 'Tv'].forEach(function (n) { GGB.color(api, n, 4); GGB.thick(api, n, 4); });
    GGB.color(api, 'barN', 13); GGB.thick(api, 'barN', 7);
    GGB.color(api, 'barG', 4); GGB.thick(api, 'barG', 7);
    ['A', 'O', 'B'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['Gm', 'LL', 'dd', 'RR', 'k', 'u', 'ang', 'Tm', 'Nm']);
    GGB.view(api, -3.4, 5.2, -3.35, 3.1);
    try { api.setCoords('LL', -3.3, 2.7); api.setCoords('dd', -3.3, 2.2); } catch (e) { }
  }

  /* ================= 例8 双球两绳 ================= */
  function build8(api) {
    GGB.run(api, [
      'P = 1', 'Q = 1', 'k = 0.5',
      'alp = atan(sqrt(3) Q / (2 P + Q))',
      'R2 = 2',
      'O = (0, 2.2)',
      'Bp = O + R2 (sin(alp), -cos(alp))',
      'Ap = O + R2 (-sin(60° - alp), -cos(60° - alp))',
      'ballA = Circumference(Ap, 0.55)',
      'ballB = Circumference(Bp, 0.55)',
      'sOC = Segment(O, Ap + (0, 0.55))',
      'sOD = Segment(O, Bp + (0, 0.55))',
      'qv = Vector(Ap, Ap + (0, -k Q))',
      'pv = Vector(Bp, Bp + (0, -k P))',
      'AE = R2 sin(60° - alp)',
      'BF = R2 sin(alp)',
      'barP = Segment((2.7, -1.5), (2.7 + 1.0 P BF, -1.5))',
      'barQ = Segment((2.7, -2.1), (2.7 + 1.0 Q AE, -2.1))',
      'tP = Text("P·BF", (2.7, -1.25))',
      'tQ = Text("Q·AE", (2.7, -1.85))',
      'info = Text("α = " + round(180 alp / pi, 1) + "°", (-3.2, -2.9))',
    ]);
    addMarks(api, [
      ['mk1', '△OAB 正三角形：OA=AB=OB=2R', '(-3.2, 2.75)'],
      ['mk2', 'O 为转轴：P·BF = Q·AE（验算）', '(2.3, -2.65)'],
    ]);
    ['sOC', 'sOD'].forEach(function (n) { GGB.thick(api, n, 2); GGB.color(api, n, 2); });
    GGB.color(api, 'ballA', 2); GGB.thick(api, 'ballA', 2);
    GGB.color(api, 'ballB', 2); GGB.thick(api, 'ballB', 2);
    GGB.color(api, 'qv', 10); GGB.thick(api, 'qv', 4);
    GGB.color(api, 'pv', 10); GGB.thick(api, 'pv', 4);
    GGB.color(api, 'barP', 13); GGB.thick(api, 'barP', 7);
    GGB.color(api, 'barQ', 4); GGB.thick(api, 'barQ', 7);
    ['Ap', 'Bp', 'O'].forEach(function (n) { try { api.setLabelVisible(n, true); } catch (e) { } });
    GGB.hide(api, ['P', 'Q', 'k', 'alp', 'R2', 'AE', 'BF']);
    GGB.view(api, -3.6, 5.4, -3.3, 3.1);
    try { api.setCoords('P', -3.5, 2.7); api.setCoords('Q', -3.5, 2.2); } catch (e) { }
  }

  /* ============================================================
     各例题的步骤 / 讲解 / 配置
     ============================================================ */

  function cfg(n, title, buildFn, steps, controls, allObj, explore, epilogue, opts) {
    opts = opts || {};
    return {
      container: 'ggb-card-s2-' + n,
      appId: 'ggbAppletS2' + n,
      width: 820,
      height: opts.height || 440,
      commands: buildFn,
      steps: steps,
      narration: { title: title, epilogue: epilogue },
      controls: controls,
      allObjects: allObj,
      exploreCaption: explore,
      onExplore: function (api) {
        GGB.show(api, allObj);
      }
    };
  }

  var S1_STEPS = [
    {
      label: '整体当刚体', show: ['ropeA', 'ropeB', 'rodAB', 'pv', 'qv', 'gv', 'tP', 'tGQ', 'mk1', 'info'],
      caption: '把绳 OA、OB 与杆 AB 整体当刚体，以 O 为转轴列力矩方程。',
      key: '整体当刚体，O 为转轴',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '把绳索OA、OB和木杆AB整体当作刚体，以O为转轴列力矩方程，一步就能求出夹角。',
      audio: '../assets/audio/s2ex1-1.mp3'
    },
    {
      label: '力矩方程', show: ['barP', 'barGQ', 'tP', 'tGQ', 'mk2', 'info'],
      caption: 'P·AE = G·CF + Q·BD，两根力矩条相等即平衡。',
      key: 'P·AE = G·CF + Q·BD',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '力矩平衡：P乘AE等于G乘CF加Q乘BD。图中两根力矩条等长，说明方程成立。',
      audio: '../assets/audio/s2ex1-2.mp3'
    },
    {
      label: '解出并验算', show: ['ropeA', 'ropeB', 'rodAB', 'pv', 'qv', 'gv', 'barP', 'barGQ', 'info', 'mk1', 'mk2'],
      caption: '解得 tanα = √3(2Q+G)/(4P+3G+2Q)。拖动 P、Q、G 验证读数与公式一致。',
      key: '解出 α，拖滑块验证公式',
      narration: '解得tan阿尔法等于根号三乘二Q加G，除以四P加三G加二Q。拖动滑块，读数始终与公式一致，这就是先算后验。',
      audio: '../assets/audio/s2ex1-3.mp3'
    }
  ];

  new InteractiveCard(cfg(1, '例1 · 双绳悬挂木杆', build1, S1_STEPS, [
    { name: 'P', label: 'P', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'Q', label: 'Q', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'Gm', label: 'G', min: 0.5, max: 3, step: 0.1, value: 1.5, fmt: function (v) { return v.toFixed(1); } }
  ], ['ropeA', 'ropeB', 'rodAB', 'pv', 'qv', 'gv', 'barP', 'barGQ', 'tP', 'tGQ', 'mk1', 'mk2', 'info'],
    '先算后验：用公式算出 α，再拖 P、Q、G 对照读数；两根力矩条始终等长。',
    { text: '普遍性：无论 P、Q、G 怎样搭配，整体刚体力矩法都适用，比逐点分析省去大量方程。', audio: '../assets/audio/s2ex1-4.mp3', slider: 'Q', from: 0.5, to: 3, duration: 3000 }));

  var S2_STEPS = [
    {
      label: '取绳 OA 当刚体', show: ['ropeA', 'ropeB', 'gv', 'Tv', 'info', 'mk1'],
      caption: '绳 OA 只受轴向拉力，可当刚体；以 A 为转轴。',
      key: '绳 OA 当刚体，A 为转轴',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '绳OA只受到沿轴线向外的拉力，可以当作刚体，以A为转轴列方程。',
      audio: '../assets/audio/s2ex2-1.mp3'
    },
    {
      label: '力矩方程求 T', show: ['barT', 'barG', 'tT', 'tG', 'mk2', 'info', 'gv', 'Tv'],
      caption: 'T·OA = G·OA·cosα ⇒ T = Gcosα。两根力矩条等长即验算通过。',
      key: 'T = Gcosα（力矩条等长）',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: 'T乘OA等于G乘OA乘cosine阿尔法，约掉OA，立刻得到T等于Gcosine阿尔法。两根力矩条等长，验算通过。',
      audio: '../assets/audio/s2ex2-2.mp3'
    }
  ];

  new InteractiveCard(cfg(2, '例2 · 直角折绳', build2, S2_STEPS, [
    { name: 'alp', label: 'α', min: 10, max: 80, step: 1, value: 35, fmt: function (v) { return v.toFixed(0) + '°'; } },
    { name: 'Gm', label: 'G', min: 1, max: 4, step: 0.1, value: 2, fmt: function (v) { return v.toFixed(1); } }
  ], ['ropeA', 'ropeB', 'gv', 'Tv', 'barT', 'barG', 'tT', 'tG', 'mk1', 'mk2', 'info'],
    '先算后验：T = Gcosα。拖 α 与 G 对照读数，力矩条始终等长。',
    { text: '普遍性：α 越大 OB 张力越小；α=0 时 T=G，折绳完全承重。', audio: '../assets/audio/s2ex2-3.mp3', slider: 'alp', from: 10, to: 80, duration: 3000 }, { height: 420 }));

  var S3_STEPS = [
    {
      label: '分析 B、C 两点', show: ['sAB', 'sBC', 'sCD', 'gvB', 'gvC', 'mk1', 'info'],
      caption: '三段绳张力 T₁、T₂、T₃，B、C 两点各自平衡，θ 为 BC 与铅直线夹角。',
      key: 'B、C 两点各自平衡',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '设三段绳张力分别为T一、T二、T三，BC与铅直线夹角为西塔，对B、C两点分别列平衡方程。',
      audio: '../assets/audio/s2ex3-1.mp3'
    },
    {
      label: '消元解 θ', show: ['sAB', 'sBC', 'sCD', 'gvB', 'gvC', 'info', 'mk2'],
      caption: 'tanθ = (1+k)/(cotα−k cotβ)（k=G_B/G_C）。等重时 θ = 60°。',
      key: '等重时 θ = 60°',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '联立消去张力，得到tan西塔等于一加k除以cot阿尔法减k乘cot贝塔。两物等重时，西塔恰好等于六十度。',
      audio: '../assets/audio/s2ex3-2.mp3'
    }
  ];

  new InteractiveCard(cfg(3, '例3 · 三段绳挂双物', build3, S3_STEPS, [
    { name: 'GB', label: 'G_B', min: 0.5, max: 2, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'GC', label: 'G_C', min: 0.5, max: 2, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } }
  ], ['sAB', 'sBC', 'sCD', 'gvB', 'gvC', 'mk1', 'mk2', 'info'],
    '先算后验：等重时 θ=60°。改变两物重量，θ 跟着公式走。',
    { text: '普遍性：θ 只由两物重量比和两端角度决定，与绳长无关。', audio: '../assets/audio/s2ex3-3.mp3', slider: 'GB', from: 0.5, to: 2, duration: 3000 }));

  var S4_STEPS = [
    {
      label: '杆球系统受力', show: ['ball', 'rodOA', 'strOD', 'strQ', 'pv', 'qv', 'mk1', 'info'],
      caption: 'P 球受杆拉力与绳压力，D 点受 Q 拉力与反作用力，N₁=N₂。',
      key: 'P 球与 D 点受力',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: 'P球受重力、杆的拉力和绳的压力，D点受Q的拉力和反作用力，两处压力大小相等。',
      audio: '../assets/audio/s2ex4-1.mp3'
    },
    {
      label: '△OAD 整体取矩', show: ['barP', 'barQ', 'tP', 'tQ', 'mk2', 'info', 'pv', 'qv'],
      caption: '绳 OD 可当刚体：以 O 为转轴，P·AH = Q·DH。',
      key: 'P·AH = Q·DH（刚体取矩）',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '绳OD同样可以当作刚体。以O为转轴，P乘AH等于Q乘DH，两根力矩条等长即平衡。',
      audio: '../assets/audio/s2ex4-2.mp3'
    },
    {
      label: '解出 α', show: ['ball', 'rodOA', 'strOD', 'strQ', 'pv', 'qv', 'barP', 'barQ', 'info', 'mk1', 'mk2'],
      caption: 'sinα = Qr/((P+Q)(L+r))。拖动质量比与半径比验证。',
      key: 'sinα = Qr/((P+Q)(L+r))',
      narration: '解得sin阿尔法等于Q乘r除以P加Q乘L加r。拖动滑块，几何与读数始终符合公式。',
      audio: '../assets/audio/s2ex4-3.mp3'
    }
  ];

  new InteractiveCard(cfg(4, '例4 · 杆球系统', build4, S4_STEPS, [
    { name: 'rat', label: 'Q/P', min: 0.2, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'rr', label: 'r/(L+r)', min: 0.15, max: 0.5, step: 0.01, value: 0.32, fmt: function (v) { return v.toFixed(2); } }
  ], ['ball', 'rodOA', 'strOD', 'strQ', 'pv', 'qv', 'barP', 'barQ', 'tP', 'tQ', 'mk1', 'mk2', 'info'],
    '先算后验：sinα = Qr/((P+Q)(L+r))。拖 Q/P 与半径比对照读数。',
    { text: '普遍性：杆绳系统只要绳只受轴向拉力，就可用同一套刚体取矩法。', audio: '../assets/audio/s2ex4-4.mp3', slider: 'rat', from: 0.2, to: 3, duration: 3000 }));

  var S5_STEPS = [
    {
      label: '三力共点', show: ['rope', 'rod', 'Fv', 'gv', 'Tv', 'O', 'mk1', 'info'],
      caption: '杆受 T、F、G 三力共点于 O：G 的作用线必过 T 与 F 的交点。',
      key: '三力共点于 O',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '木杆受绳张力、水平拉力和重力三个力，必定共点，重力作用线通过另两个力的交点O。',
      audio: '../assets/audio/s2ex5-1.mp3'
    },
    {
      label: '取矩求 F', show: ['barF', 'barG', 'tF', 'tG', 'mk2', 'info', 'Fv', 'gv', 'Tv'],
      caption: 'B 为转轴：F·Lsin30° = G·xcos30°，解得 F = √3/3 G，x = L/3。',
      key: 'F = √3/3 G，重心离 B 端 L/3',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '以B为转轴列力矩方程，解得F等于三分之根号三G，重心离B端三分之一杆长。力矩条等长即验算通过。',
      audio: '../assets/audio/s2ex5-2.mp3'
    }
  ];

  new InteractiveCard(cfg(5, '例5 · 吊杆加水平拉力', build5, S5_STEPS, [
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['rope', 'rod', 'Fv', 'gv', 'Tv', 'barF', 'barG', 'tF', 'tG', 'mk1', 'mk2', 'info', 'O', 'A', 'B', 'C'],
    '先算后验：F = √3/3·G ≈ 0.577G。拖 G 对照读数，力矩条始终等长。',
    { text: '普遍性：重心位置 x=L/3 与 G 无关——几何决定分配。', audio: '../assets/audio/s2ex5-3.mp3', slider: 'Gm', from: 1, to: 5, duration: 3000 }));

  var S6_STEPS = [
    {
      label: '三共点力', show: ['wall', 'ball', 'str', 'gv', 'Nv', 'Tv', 'mk1', 'info'],
      caption: '球受 G、N（水平）、T（沿绳）三力共点。',
      key: '球受三力：G、N、T',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '重球受重力、墙的水平弹力和绳的拉力，三个力共点于球心方向的交点。',
      audio: '../assets/audio/s2ex6-1.mp3'
    },
    {
      label: '刚体取矩求 N、T', show: ['barGR', 'barN', 'tGR', 'tN', 'mk2', 'info', 'gv', 'Nv', 'Tv'],
      caption: 'AO 取矩：G·R = N·AB ⇒ N = GR/√(L(L+2R))；BO 取矩得 T。',
      key: 'N = GR/√(L(L+2R))，T = G(L+R)/√(L(L+2R))',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '以A为转轴取矩得N，以B为转轴取矩得T。力矩条等长，验算通过。',
      audio: '../assets/audio/s2ex6-2.mp3'
    }
  ];

  new InteractiveCard(cfg(6, '例6 · 球靠光滑墙', build6, S6_STEPS, [
    { name: 'LL', label: 'L', min: 0.8, max: 3, step: 0.1, value: 1.9, fmt: function (v) { return v.toFixed(1); } },
    { name: 'RR', label: 'R', min: 0.5, max: 1.5, step: 0.05, value: 1.0, fmt: function (v) { return v.toFixed(2); } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['wall', 'ball', 'str', 'gv', 'Nv', 'Tv', 'barGR', 'barN', 'tGR', 'tN', 'mk1', 'mk2', 'info'],
    '先算后验：拖 L、R、G 对照 T、N 读数；G·R 与 N·AB 力矩条等长。',
    { text: '普遍性：绳越长（L 大），绳张力越接近 G，墙弹力越小。', audio: '../assets/audio/s2ex6-3.mp3', slider: 'LL', from: 0.8, to: 3, duration: 3000 }));

  var S7_STEPS = [
    {
      label: '两根"刚体"线段', show: ['big', 'small', 'str', 'lnOB', 'gv', 'Nv', 'Tv', 'mk1', 'info'],
      caption: '细线 AB 与几何线段 OB 均可当刚体，小球受 G、N、T。',
      key: 'AB 与 OB 都当刚体',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '小球平衡时，细线AB和几何线段OB都可以当作刚体，小球受重力、球面弹力和绳张力。',
      audio: '../assets/audio/s2ex7-1.mp3'
    },
    {
      label: '取矩得简洁结果', show: ['barN', 'barG', 'tN', 'tG', 'mk2', 'info', 'gv', 'Nv', 'Tv'],
      caption: 'A 为转轴：N(R+d) = G·R ⇒ N = RG/(R+d)，T = LG/(R+d)。',
      key: 'T = LG/(R+d)，N = RG/(R+d)',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '以A为转轴一取矩，弹力等于R除以R加d乘G，张力等于L除以R加d乘G，形式非常简洁。',
      audio: '../assets/audio/s2ex7-2.mp3'
    }
  ];

  new InteractiveCard(cfg(7, '例7 · 球放球面', build7, S7_STEPS, [
    { name: 'LL', label: 'L', min: 0.6, max: 2.2, step: 0.05, value: 1.5, fmt: function (v) { return v.toFixed(2); } },
    { name: 'dd', label: 'd', min: 0.2, max: 1.6, step: 0.05, value: 0.7, fmt: function (v) { return v.toFixed(2); } },
    { name: 'Gm', label: 'G', min: 1, max: 5, step: 0.1, value: 3, fmt: function (v) { return v.toFixed(1); } }
  ], ['big', 'small', 'str', 'lnOB', 'gv', 'Nv', 'Tv', 'barN', 'barG', 'tN', 'tG', 'mk1', 'mk2', 'info'],
    '先算后验：T = LG/(R+d)，N = RG/(R+d)。拖 L、d 对照读数。',
    { text: '普遍性：T:N = L:R，与 G 无关——几何比例决定力的分配。', audio: '../assets/audio/s2ex7-3.mp3', slider: 'dd', from: 0.2, to: 1.6, duration: 3000 }));

  var S8_STEPS = [
    {
      label: '正三角形结构', show: ['ballA', 'ballB', 'sOC', 'sOD', 'qv', 'pv', 'mk1', 'info'],
      caption: 'OA = AB = OB = 2R，△OAB 为正三角形，α+β = 60°。',
      key: '△OAB 是正三角形',
      marks: [{ name: 'mk1', delay: 600 }],
      narration: '因为OA等于AB等于OB，三角形OAB是正三角形，所以两个绳角之和恰好六十度。',
      audio: '../assets/audio/s2ex8-1.mp3'
    },
    {
      label: '整体取矩', show: ['barP', 'barQ', 'tP', 'tQ', 'mk2', 'info', 'qv', 'pv'],
      caption: '△OAB 整体当刚体，O 为转轴：P·BF = Q·AE。',
      key: 'P·BF = Q·AE（整体取矩）',
      marks: [{ name: 'mk2', delay: 600 }],
      narration: '把三角形OAB整体当作刚体，以O为转轴，P乘BF等于Q乘AE，两根力矩条等长。',
      audio: '../assets/audio/s2ex8-2.mp3'
    },
    {
      label: '解出 α', show: ['ballA', 'ballB', 'sOC', 'sOD', 'qv', 'pv', 'barP', 'barQ', 'info', 'mk1', 'mk2'],
      caption: 'tanα = √3Q/(2P+Q)。拖动两球重量验证几何与读数。',
      key: 'tanα = √3Q/(2P+Q)',
      narration: '解得tan阿尔法等于根号三Q除以二P加Q。拖动两球重量，几何与读数始终吻合公式。',
      audio: '../assets/audio/s2ex8-3.mp3'
    }
  ];

  new InteractiveCard(cfg(8, '例8 · 双球两绳', build8, S8_STEPS, [
    { name: 'P', label: 'P', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
    { name: 'Q', label: 'Q', min: 0.5, max: 3, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } }
  ], ['ballA', 'ballB', 'sOC', 'sOD', 'qv', 'pv', 'barP', 'barQ', 'tP', 'tQ', 'mk1', 'mk2', 'info'],
    '先算后验：tanα = √3Q/(2P+Q)。拖 P、Q 对照读数。',
    { text: '普遍性：P 远大于 Q 时 α→0，两绳并拢；Q 增大则 OD 甩开——重量比决定几何。', audio: '../assets/audio/s2ex8-4.mp3', slider: 'Q', from: 0.5, to: 3, duration: 3000 }));
})();
