import parseWithComments from "../src/parse-with-comments";
import csstree from "css-tree";

test.only("prase comments block after", () => {
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
