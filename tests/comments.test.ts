import { StyleSheet, generate } from "css-tree";
import parseWithComments from "../src/parse-with-comments";

describe('declaration comments', ()=>{

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


  test("should parse comments in line with declarations", () => {
    const css = 
  `selector {
      /* Lorem */
      display: none; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  test("should parse comments in line and in the middle of declarations", () => {
    const css = 
  `selector {
      /* Lorem */
      display/* dolor */: none; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem', 'dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  test("should parse comments in line and in the middle of declarations (multiline)", () => {
    const css = 
  `selector {
      /* Lorem */
      display/* dolor */: none; /* ipsum
      multiline */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem', 'dolor', 'ipsum\n    multiline']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  test("should parse comments before declarations (multiline)", () => {
    const css = 
  `selector {
      /* Lorem
      multiline */
      display/* dolor */: none; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem\n    multiline', 'dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments in line and in the middle of declarations (2)", () => {
    const css = 
  `selector {
      /* Lorem */
      display: /* dolor */none; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem', 'dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments in line and in the middle of declarations (3)", () => {
    const css = 
  `selector {
      /* Lorem */
      display: none/* dolor */; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem', 'dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments in line and before declarations", () => {
    const css = 
  `selector {
      border: 0;
      /* Lorem */
      /* before */ display: none; /* ipsum */
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toBeUndefined();  
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['Lorem', 'before', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 2 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments in line and in the middle of declarations (4)", () => {
    const css = 
  `selector {
      /* Lorem */
      display: none;
      border: 1px /* dolor */ solid /* ipsum */ white;
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 2 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments in between lines of one declaration", () => {
    const css = 
  `selector {
      display: 
      /* Lorem */
      none;
      border: 1px /* dolor */ solid /* ipsum */ white;
      margin: 1em;
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 2 }).comments ).toBeUndefined();  
  });

  xtest("should parse comments on the end of declaration block", () => {
    const css = 
  `selector {
      /* Lorem */
      display: none;
      margin: 1em;
      /* under */
  }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['under']);
    expect( getEntity(ast, {rule: 0, block: true }).comments ).toBeUndefined();  
    expect( getEntity(ast, {rule: 0 }).comments ).toBeUndefined();
  });

  xtest("should parse comments in one liner declaration", () => {
    const css = `selector { /* One liner */ display: none; border: 1px /* dolor */ solid /* ipsum */ white; margin: 1em; }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toEqual(['One liner']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toEqual(['dolor', 'ipsum']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 2 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, block: true }).comments ).toBeUndefined();  
    expect( getEntity(ast, {rule: 0 }).comments ).toBeUndefined();
  });

});


describe('selector comments', ()=>{

  xtest("should parse comments above selector", () => {
    const css = 
`/* Lorem */
selector {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toBeUndefined();
  });

    xtest("should parse comments before selector", () => {
    const css = 
`/* Before */ selector {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Before']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toBeUndefined();
  });

  xtest("should parse comments above selector (multiline)", () => {
    const css = 
`/* Lorem 
    multiline */
selector {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem\n    multiline']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toBeUndefined();
  });

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