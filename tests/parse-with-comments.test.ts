import parseWithComments from "../src/parse-with-comments";
import csstree from "css-tree";

test("prase comments block after", () => {
  const input = `.red {
            color: red;
            /* this is comment */
        }`;
  const out = parseWithComments(input);
  const o = csstree.toPlainObject(out);
  expect(o).toMatchObject({
    children: [{ block: { comments: ["this is comment"] } }],
  });
});

test("should parse comments in line and in the middle of declarations turbo", () => {
  const css = `selector {
      /* Lorem */
      display: none;
      border: 1px /* dolor */ solid /* ipsum */ white; /* 
      turbo
    */ margin: 1em;
  }`;
  const ast = parseWithComments(css) as StyleSheet;
  expect(
    getEntity(ast, { rule: 0, block: true, declaration: 0 }).comments
  ).toEqual(["Lorem"]);
  expect(
    getEntity(ast, { rule: 0, block: true, declaration: 1 }).comments
  ).toEqual(["dolor", "ipsum", "turbo"]);
  expect(
    getEntity(ast, { rule: 0, block: true, declaration: 2 }).comments
  ).toBeUndefined();
});

interface EntityIndexes {
  rule: number;

  selectorList?: boolean;
  selector?: number;

  // or

  block?: boolean;
  declaration?: number;
}

/**
 *
 * @example getEntity(ast, {rule: 0 })
 * @example getEntity(ast, {rule: 0, selectorList: true })
 * @example getEntity(ast, {rule: 0, selectorList: true, selector: 1 })
 * @example getEntity(ast, {rule: 0, block: true })
 * @example getEntity(ast, {rule: 0, block: true, declaration: 0 })
 */
function getEntity(ast: StyleSheet, which: EntityIndexes) {
  if (
    which.selector !== undefined &&
    which.selectorList == true &&
    which.rule !== undefined
  ) {
    return ast.children.toArray()[which.rule].prelude.children.toArray()[
      which.selector
    ];
  }

  if (
    which.declaration !== undefined &&
    which.block == true &&
    which.rule !== undefined
  ) {
    return ast.children.toArray()[which.rule].block.children.toArray()[
      which.declaration
    ];
  }

  if (which.selectorList == true && which.rule !== undefined) {
    return ast.children.toArray()[which.rule].prelude;
  }

  if (which.block == true && which.rule !== undefined) {
    return ast.children.toArray()[which.rule].block;
  }

  if (which.rule !== undefined) {
    return ast.children.toArray()[which.rule];
  }
}
