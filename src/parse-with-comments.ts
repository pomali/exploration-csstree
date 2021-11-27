import csstree from "css-tree";

interface Comment {
  value: string;
  loc: csstree.CssLocation;
}
type Accumulator = Array<Comment>;

function createOnComment(): [
  Accumulator,
  (value: string, loc: csstree.CssLocation) => void
] {
  const accumulator: Accumulator = [];
  function onComment(value: string, loc: csstree.CssLocation): void {
    accumulator.push({ value, loc });
  }
  return [accumulator, onComment];
}

function createOnWalk(sortedComments: Accumulator) {
  let i = 0;
  return function onWalk(node) {
    console.log(node);
  };
}

export function parseWithComments(input: string) {
  const [acc, onComment] = createOnComment();
  const ast = csstree.parse(input, {
    onComment,
    positions: true,
  });

  csstree.walk(ast, onWalk);
  return ast;
}

export default parseWithComments;
