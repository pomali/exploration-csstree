import csstree, { CssNode } from "css-tree";

/* Types that are not parsed and their children are ignored too */
const CUTOFF_TYPES = ['TypeSelector', 'Identifier']
/* Types that can get comments attached */
const ENABLED_TYPES = ['Rule', 'SelectorList', 'Selector', 'Block', 'Declaration']

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
  return (
    !!nodeLoc &&
    (commentLoc.start.offset < nodeLoc.start.offset ||
      commentLoc.start.line === nodeLoc.start.line)
  );
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


function createOnWalk(sortedComments: Accumulator): csstree.WalkOptions {
  let i = 0;
  const enter: csstree.EnterOrLeaveFn = function enter(node) {
    if (node.type in CUTOFF_TYPES ){
      return csstree.walk.skip;
    };

    // if (!(node.type in ENABLED_TYPES)){
    //   return
    // }

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
    if (node.type in CUTOFF_TYPES ){
      return csstree.walk.skip;
    };

    // if (!(node.type in ENABLED_TYPES)){
    //   return
    // }

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
