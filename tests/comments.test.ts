import { StyleSheet, generate } from "css-tree";
import parseWithComments from "../src/parse-with-comments";


test("should parse comments before declarations", () => {
  const css = 
`selector1, div > selector2::after {
    /* Lorem */
    display: none;
    /* ipsum */
    margin: 1em;
}`;
  const ast = parseWithComments(css) as StyleSheet;
  expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem']);
  expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['ipsum']);  
});


test("prase comments block after", () => {
  const input = `.red {
          color: red;
          /* this is comment */
      }`;
  const out = parseWithComments(input);
});

// test("prase comments block after", () => {
//   const input = `.red {
//           color: red;
//           /* this is comment */
//       }`;
//   parseWithComments(input);
// });

// test("prase comments block after in line 1", () => {
//   const input = `.red {
//             color: red; /* this is comment */
//         }`;
//   parseWithComments(input);
// });

// test("prase comments block after in line 2", () => {
//   const input = `.red {
//             color: /* this is comment */ red; 
//         }`;
//   parseWithComments(input);
// });

// test("prase comments block after in line 3", () => {
//   const input = `.red {
//               color/* this is comment */:  red; 
//           }`;
//   parseWithComments(input);
// });

// test("prase comments block after in line 4", () => {
//   const input = `.red {
//           /* this is comment */color:  red; 
//           }`;
//   parseWithComments(input);
// });

// test("prase comments block before", () => {
//   const input = `.red {
//       /* this is comment */
//             color: red;
//         }`;
//   parseWithComments(input);
// });

// test("prase comments selector 1", () => {
//   const input = `.red /* this is comment */ {
//               color: red;
//           }`;
//   parseWithComments(input);
// });

// test("prase comments selector 2", () => {
//   const input = `/* this is comment */.red  {
//               color: red;
//           }`;
//   parseWithComments(input);
// });

// test("prase comments before", () => {
//   const input = `/* this is comment */
//       .red  {
//               color: red;
//           }`;
//   parseWithComments(input);
// });


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
  if (which.selector!==undefined && which.selectorList==true && which.rule!==undefined) {
    return ast.children.toArray()[which.rule].prelude.children.toArray()[which.selector];
  }
  
  if (which.declaration!==undefined && which.block==true && which.rule!==undefined) {
    return ast.children.toArray()[which.rule].block.children.toArray()[which.declaration];
  }

  if (which.selectorList==true && which.rule!==undefined) {
    return ast.children.toArray()[which.rule].prelude;
  }

  if (which.block==true && which.rule!==undefined) {
    return ast.children.toArray()[which.rule].block;
  }

  if (which.rule!==undefined) {
    return ast.children.toArray()[which.rule];
  }
}