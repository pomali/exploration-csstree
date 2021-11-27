import csstree from "css-tree";

type Accumulator = Array<{ value: string; loc: csstree.CssLocation }>;

function createOnComment(): [
  Accumulator,
  (value: string, loc: csstree.CssLocation) => void
] {
  const accumulator: Accumulator = [];
  function onComment(value: string, loc: csstree.CssLocation): void {
    accumulator.push({ value, loc });
    console.log(loc);
  }
  return [accumulator, onComment];
}



export function parseWithComments(input: string, options: {}) {
  const [acc, onComment] = createOnComment();
  const ast = csstree.parse(input, {...options, ...{
    onComment,
    positions: true,
  }});

  console.log('Comments', acc);
}

export default parseWithComments;
