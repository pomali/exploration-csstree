import csstree from "css-tree";

test("inline style", () => {
  const ast = csstree.parse(
    "color:red,green; color:blue; position: absolute; asdfasf:33;",
    { context: "declarationList" }
  );

  expect(ast).toBeDefined();
});

test("parse + generate", () => {
  const input = "color:red,green; color:blue; position: absolute; asdfasf:33;";
  const ast = csstree.parse(input, { context: "declarationList" });
  const out = csstree.generate(ast);
  expect(out).toBe(input.replace(/ /g, "").replace(/;$/, ""));
});

test("prase unknown property", () => {
  const input = "asdfasdfadfa: red";
  csstree.parse(input, { context: "declarationList" });
});

test("prase unknown value", () => {
  const input = "color: 12431243-1241234";
  csstree.parse(input, { context: "declarationList" });
});

test("prase css variables", () => {
  const input = "color: 12431243-1241234";
  csstree.parse(input, { context: "declarationList" });
});

test("graceful error", () => {
  const input = "adsfjdsalkfjasldgj dad;gja;dl gjas;l";
  csstree.parse(input, { context: "declarationList" });
});

test("parse unknown property", () => {
  const input = "ufo: yes";
  csstree.parse(input, { context: "declarationList" });
});

// rozne typy commentov
