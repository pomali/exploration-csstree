import { StyleSheet, generate } from "css-tree";
import parseWithComments from "../src/parse-with-comments";


interface EntityIndexes {
  rule: number;
  selectorList?: boolean;
  selector?: number;
}

function getEntity(ast: StyleSheet, which: EntityIndexes) {
  if (which.selector!==undefined && which.selectorList==true && which.rule!==undefined) {
    return ast.children.toArray()[which.rule].prelude.children.toArray()[which.selector];
    // return ast.children.toArray()[which.rule].prelude.children.toArray()[which.selector];
  }
}

test("shoud parse comments block after", () => {
  const css = 
`selector1, div > selector2::after {
    /* Lorem */
    display: none;
    /* ipsum */
    margin: 1em;
}`;
  const ast = parseWithComments(css) as StyleSheet;

  // type: 'StyleSheet',
  // start: { offset: 0, line: 1, column: 1 },
  // end: { offset: 91, line: 6, column: 2 }
  const stylesheet = ast;
  
    // type: 'Rule',
    // start: { offset: 0, line: 1, column: 1 },
    // end: { offset: 91, line: 6, column: 2 }
    const firstRule = stylesheet.children.first(); // ast.children.first()
    
      // type: 'SelectorList',
      // start: { offset: 0, line: 1, column: 1 },
      // end: { offset: 19, line: 1, column: 20 }
      const selectorList = firstRule.prelude; // ast.children.first().prelude

        // type: 'Selector',
        // start: { offset: 0, line: 1, column: 1 },
        // end: { offset: 8, line: 1, column: 9 }
        const list = selectorList.children.first(); // ast.children.first().prelude.children.first()

        // ----------------------------------------------------------------------------------------------

          // type: 'TypeSelector',
          // name: 'selector'
          // start: { offset: 0, line: 1, column: 1 },
          // end: { offset: 8, line: 1, column: 9 }
          const selector = list.children.first(); // ast.children.first().prelude.children.first().children.first()


  console.log('XXXX: ', selectorList.children.first(), selectorList.children.getSize());
  console.log('YYYY: ', selectorList.children.first().children.first(), selectorList.children.last().children.first());
  console.log('ZZZZ: ', generate(selectorList.children.last()));
  console.log('####: ', getEntity(ast, {rule: 0, selectorList: true, selector: 1}));
  console.log('####: ', generate(getEntity(ast, {rule: 0, selectorList: true, selector: 1})));
  // console.log('XXXX: ', ast.children.first().prelude.children.first());
  // start: { offset: 0, line: 1, column: 1 },
  // end: { offset: 80, line: 6, column: 2 }

  // start: { offset: 0, line: 1, column: 1 },
  // end: { offset: 8, line: 1, column: 9 }


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
