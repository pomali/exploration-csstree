import csstree, { CssNode } from "css-tree";

interface Comment {
  value: string;
  loc: csstree.CssLocation;
}
type Accumulator = Array<Comment>;

interface Loc {
  offset: number;
  line: number;
  column: number;
}

function createOnComment(): [
  Accumulator,
  (value: string, loc: csstree.CssLocation) => void
] {
  const accumulator: Accumulator = [];
  function onComment(value: string, loc: csstree.CssLocation): void {
    accumulator.push({ value: value.trim(), loc });
  }
  return [accumulator, onComment];
}

function matchCommentEnter(
  nodeLoc: csstree.CssLocation | undefined,
  commentLoc: csstree.CssLocation
) {
  return !!nodeLoc && (commentLoc.start.offset < nodeLoc.start.offset || commentLoc.start.line === nodeLoc.start.line);
}

function matchCommentLeave(
  nodeLoc: csstree.CssLocation | undefined,
  commentLoc: csstree.CssLocation
) {
  return !!nodeLoc && commentLoc.end.offset <= nodeLoc.end.offset;
}

function addComment(node: csstree.CssNode, commentValue: string) {
  if (!node.hasOwnProperty("comments")) {
    (node as any).comments = [commentValue];
  } else {
    (node as any).comments.push(commentValue);
  }
}

function createOnWalk(sortedComments: Accumulator) {
  let i = 0;
  const enter: csstree.EnterOrLeaveFn = function enter(node) {
    while (i < sortedComments.length) {
      const currentComment = sortedComments[i];
      const matched = matchCommentEnter(node.loc, currentComment.loc);
      if (matched) {
        addComment(node, currentComment.value);
        i += 1;
      } else {
        break;
      }
    }
  };

  const leave: csstree.EnterOrLeaveFn = function leave(node) {
    while (i < sortedComments.length) {
      const currentComment = sortedComments[i];
      const matched = matchCommentLeave(node.loc, currentComment.loc);
      if (matched) {
        addComment(node, currentComment.value);
        i += 1;
      } else {
        break;
      }
    }
  };

  return {
    enter,
    leave,
  };
}

export function parseWithComments(input: string, options: {} = {}): CssNode {
  const [acc, onComment] = createOnComment();
  const ast = csstree.parse(input, {
    ...options,
    ...{
      onComment,
      positions: true,
    },
  });

  const onWalk = createOnWalk(acc);
  csstree.walk(ast, onWalk);
  return ast;
}

export default parseWithComments;
