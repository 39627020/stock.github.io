const fs = require("fs");
const assert = require("assert");

const html = fs.readFileSync("checklist.html", "utf8");
const signalHtml = fs.readFileSync("stock-signal.html", "utf8");

function count(pattern) {
  return (html.match(pattern) || []).length;
}

assert.strictEqual(count(/data-checklist="/g), 4, "renders four checklist panels");

["buy", "add", "sell", "rebuy"].forEach(type => {
  assert(html.includes(`data-tab="${type}"`), `has ${type} tab`);
  assert(html.includes(`data-checklist="${type}"`), `has ${type} panel`);
  assert(html.includes(`id="${type}Score"`), `has ${type} score`);
  assert(html.includes(`id="${type}Verdict"`), `has ${type} verdict`);
});

[
  "卖出后未满5个交易日",
  "因为卖出价下方变便宜而想买回",
  "当前交易带有FOMO或报复性交易",
  "未提前写下止损价和目标价",
  "亏损持仓仍想摊低成本"
].forEach(rule => {
  assert(html.includes(rule), `has hard block rule: ${rule}`);
});

assert(html.includes("data-block=\"true\""), "hard block inputs are marked");
assert(html.includes("getBlockedReasons(type)"), "script checks hard blocks");
assert(html.includes("blockedReasons.length > 0"), "verdict uses hard blocks");

assert(html.includes("href=\"stock-signal.html\""), "checklist links to stock signal page");
assert(signalHtml.includes("href=\"checklist.html\""), "stock signal links to checklist page");

console.log("checklist structure tests passed");
