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

  xtest("should parse more comments above selector (multiline)", () => {
    const css = 
`/* Lorem 
    multiline */
/* One */ /* Two */
/* Three */
selector {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem\n    multiline', 'One', 'Two', 'Three']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toBeUndefined();
  });

  xtest("should parse more comments above selector (2)", () => {
    const css = 
`/* Lorem */
selector1, /* ipsum */
selector2, 
selector3 {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toEqual(['ipsum']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 1 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 2 }).comments ).toBeUndefined();
  });

  xtest("should parse more comments above selector (3)", () => {
    const css = 
`/* Lorem */
selector1/* ipsum */, /* dolor */
selector2, 
/* above */
/* before */ selector3 {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toEqual(['ipsum', 'dolor']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 1 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 2 }).comments ).toEqual(['above', 'before']);
  });

  xtest("should parse comment under the selector", () => {
    const css = 
`/* Lorem */
selector1,
selector2, 
selector3 
/* under */ {    
    display: none;
    margin: 1em;
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, selectorList: true }).comments ).toEqual(['Lorem']);
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 0 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 1 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, selectorList: true, selector: 2 }).comments ).toEqual(['under']);
  });

  xtest("should parse comments in one liner selector", () => {
    const css = `/* One liner */ selector1/* ipsum */, /* dolor */ selector2, /* before */ selector3 { display: none; margin: 1em; }`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0, block: true }).comments ).toEqual(['One liner', 'ipsum', 'dolor', 'before']);
    expect( getEntity(ast, {rule: 0, block: true, declaration: 0 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, block: true, declaration: 1 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0, block: true, declaration: 2 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 0 }).comments ).toBeUndefined();
  });

});


describe('at-rules comments', ()=>{

  test("should parse comment before media query", () => {
    const css = 
`/* Lorem */
@media all and (min-width: 500px) {
    selector {    
        display: none;
        margin: 1em;
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem']);
  }); 

  test("should parse comment before and inside the media query", () => {
    const css = 
`/* Lorem */
@media all and /* ipsum */ (min-width: 500px) {
    selector {    
        display: none;
        margin: 1em;
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', 'ipsum']);
  }); 

  test("should parse comment before and below the media query", () => {
    const css = 
`/* Lorem */
@media all and (min-width: 500px) 
/* below */
{
    selector {    
        display: none;
        margin: 1em;
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', 'below']);
  }); 

  test("should parse comment in nested media queries", () => {
    const css = 
`/* Lorem */
@media all and (min-width: 500px) 
{
    /* ipsum */
    @media only screen and (min-width: 600px) { /* dolor */
        selector {    
            display: none;
            margin: 1em;
        }
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem']);
    expect( getEntity(getEntity(ast, {rule: 0 }), {rule: 0 }).comments ).toEqual(['ipsum', 'dolor']);
  }); 

  test("should parse comment before and inside the media query (2)", () => {
    const css = 
`/* Lorem */
@media screen /* 1 */ and (min-width: 30em) /* 2 */ and (orientation: landscape) /* 3 */
{
    selector {    
        display: none;
        margin: 1em;
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', '1', '2', '3']);
  }); 

  test("should parse comment before and inside the media query (3)", () => {
    const css = 
`/* Lorem */
@media (min-height: 680px), /* ipsum */ screen and (orientation: portrait) /* dolor */ {
    selector {    
        display: none;
        margin: 1em;
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', 'ipsum', 'dolor']);
  }); 

  test("should parse comment in nested media queries (2)", () => {
    const css = 
`/* Lorem */
@media (prefers-color-scheme) /* ipsum */ {
    /* Dolor */
    @supports /* igitum */ (-webkit-touch-callout: none) {
        video {
            -webkit-tap-highlight-color: transparent;
        }
    }
}`;
    const ast = parseWithComments(css) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', 'ipsum']);
    expect( getEntity(getEntity(ast, {rule: 0 }), {rule: 0 }).comments ).toEqual(['Dolor', 'igitum']);
  }); 

});

describe('inline style comments', ()=>{

  test("should parse comment in inline style", () => {
    const css = `/* Lorem */display: /*ipsum*/ none; margin: 1em;`;
    const ast = parseWithComments(css, { context: 'declarationList' }) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toEqual(['Lorem', 'ipsum']);
    expect( getEntity(ast, {rule: 1 }).comments ).toBeUndefined();
  }); 

  test("should parse comment in inline style", () => {
    const css = `display: none; /* Lorem */background: /* dolor */ red, /* ipsum */green, /* before */ blue /* after */!important /* end */; margin: 1em;`;
    const ast = parseWithComments(css, { context: 'declarationList' }) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 1 }).comments ).toEqual(['Lorem', 'dolor', 'ipsum', 'before', 'after', 'end']);
    expect( getEntity(ast, {rule: 2 }).comments ).toBeUndefined();
  }); 

  test("should parse comment in inline style without semicolon", () => {
    const css = `display: none; margin: 1em /* after */`;
    const ast = parseWithComments(css, { context: 'declarationList' }) as StyleSheet;
    expect( getEntity(ast, {rule: 0 }).comments ).toBeUndefined();
    expect( getEntity(ast, {rule: 1 }).comments ).toEqual(['after']);
  }); 

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

  return ast;
}