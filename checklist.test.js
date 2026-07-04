const fs = require("fs");
const assert = require("assert");

const html = fs.readFileSync("checklist.html", "utf8");
const signalHtml = fs.readFileSync("stock-signal.html", "utf8");
const homeHtml = fs.readFileSync("home.html", "utf8");
const historyHtml = fs.readFileSync("check_history.html", "utf8");

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
assert.strictEqual(count(/data-price-field="stopLoss"/g), 2, "renders stop loss price inputs");
assert.strictEqual(count(/data-price-field="takeProfit"/g), 2, "renders take profit price inputs");
assert.strictEqual(count(/data-price-field="entryPrice"/g), 2, "renders entry price inputs");
assert(html.includes("tradeChecklistEvaluations"), "saves evaluation history to localStorage");
assert(html.includes("saveEvaluation(type, score)"), "has evaluation save function");
assert(html.includes("checkedItems"), "saved evaluation includes checked items");
assert(html.includes("prices: getPriceData(type)"), "saved evaluation includes prices");
assert(html.includes("id=\"confirmEvaluation\""), "renders confirm button");
assert(html.includes("id=\"clearForm\""), "renders bottom clear button");
assert(!/function update\(type\) \{[\s\S]*?saveEvaluation\(type, score\);[\s\S]*?\}/.test(html), "update does not save automatically");
assert(/document\.getElementById\("confirmEvaluation"\)[\s\S]*?saveEvaluation\(activeType, score\)/.test(html), "confirm button saves active checklist");
assert(/document\.getElementById\("clearForm"\)[\s\S]*?clearAllTypes\(\)/.test(html), "bottom clear button clears all inputs");

assert(homeHtml.includes("href=\"stock-signal.html\""), "home links to stock signal page");
assert(homeHtml.includes("href=\"checklist.html\""), "home links to checklist page");
assert(homeHtml.includes("href=\"check_history.html\""), "home links to checklist history page");
assert(html.includes("href=\"home.html\""), "checklist links back to home");
assert(signalHtml.includes("href=\"home.html\""), "stock signal links back to home");
assert(!html.includes("href=\"stock-signal.html\""), "checklist no longer links directly to stock signal page");
assert(!signalHtml.includes("href=\"checklist.html\""), "stock signal no longer links directly to checklist page");

assert(historyHtml.includes("href=\"home.html\""), "history links back to home");
assert(historyHtml.includes("tradeChecklistEvaluations"), "history reads checklist evaluation storage");
assert(historyHtml.includes("id=\"startDate\""), "history has start date input");
assert(historyHtml.includes("id=\"endDate\""), "history has end date input");
assert(historyHtml.includes("id=\"search\""), "history has search button");
assert(historyHtml.includes("id=\"deleteSelected\""), "history has selected delete button");
assert(historyHtml.includes("id=\"exportCsv\""), "history has CSV export button");
assert(historyHtml.includes("function getFilteredRecords()"), "history filters displayed records");
assert(historyHtml.includes("function exportCsv()"), "history exports displayed records to CSV");
assert(historyHtml.includes("text/csv;charset=utf-8"), "history exports CSV with charset");
assert(historyHtml.includes("id=\"selectAllRecords\""), "history has select all checkbox");
assert(historyHtml.includes("data-record-key"), "history row checkboxes carry record keys");
assert(historyHtml.includes("record-select"), "history renders per-record checkboxes");
assert(historyHtml.includes("function getRecordKey(record)"), "history can identify records for deletion");
assert(historyHtml.includes("function deleteSelectedRecords()"), "history deletes selected records");
assert(/localStorage\.setItem\(evaluationStorageKey, JSON\.stringify\(remainingRecords\)\)/.test(historyHtml), "history writes remaining records after delete");
assert(historyHtml.includes("const pageSize = 20"), "history limits each page to 20 records");
assert(historyHtml.includes("let currentPage = 1"), "history tracks current page");
assert(historyHtml.includes("id=\"prevPage\""), "history has previous page button");
assert(historyHtml.includes("id=\"nextPage\""), "history has next page button");
assert(historyHtml.includes("id=\"pageInfo\""), "history shows page info");
assert(historyHtml.includes("function getPageRecords()"), "history slices current page records");
assert(historyHtml.includes("function renderPagination()"), "history renders pagination controls");
assert(historyHtml.includes("toCsv(currentRecords)"), "history CSV exports all filtered records");
assert(historyHtml.includes("<th>买入价</th>"), "history renders entry price column");
assert(historyHtml.includes("record.prices?.entryPrice"), "history reads entry price from saved records");
assert(historyHtml.includes("\"买入价\""), "history exports entry price header to CSV");

console.log("checklist structure tests passed");
