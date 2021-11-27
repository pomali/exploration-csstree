

[
    { context: 'stylesheet',
      css: [

// property comments ----------------------------------------------------------------------
`selector {
    /* Lorem */
    display: none;
    /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display: none; /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display/* dolor */: none; /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem
    multiline */
    display/* dolor */: none; /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display: /* dolor */none; /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display: none/* dolor */; /* ipsum */
    margin: 1em;
}`,

`selector {
    border: 0;
    /* Lorem */
    /* before */ display: none; /* ipsum */
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display: none;
    border: 1px /* dolor */ solid /* ipsum */ white;
    margin: 1em;
}`,

`selector {
    display: 
    /* Lorem */
    none;
    border: 1px /* dolor */ solid /* ipsum */ white;
    margin: 1em;
}`,

`selector {
    /* Lorem */
    display: none;
    margin: 1em;
    /* under */
}`,

`selector { /* One liner */ display: none; border: 1px /* dolor */ solid /* ipsum */ white; margin: 1em; }`,


// selector comments ----------------------------------------------------------------------

`/* Lorem */
selector {    
    display: none;
    margin: 1em;
}`,

`/* Before */ selector {    
    display: none;
    margin: 1em;
}`,

`/* Lorem 
    multiline */
selector {    
    display: none;
    margin: 1em;
}`,

`/* Lorem 
    multiline */
/* One */ /* Two */
/* Three */
selector {    
    display: none;
    margin: 1em;
}`,

`/* Lorem */
selector1, /* ipsum */
selector2, 
selector3 {    
    display: none;
    margin: 1em;
}`,

`/* Lorem */
selector1/* ipsum */, /* dolor */
selector2, 
/* above */
/* before */ selector3 {    
    display: none;
    margin: 1em;
}`,

`/* Lorem */
selector1,
selector2, 
selector3 
/* under */ {    
    display: none;
    margin: 1em;
}`,

`/* One liner */ selector1/* ipsum */, /* dolor */ selector2, /* before */ selector3 { display: none; margin: 1em; }`,


// at-rule comments ----------------------------------------------------------------------

`/* Lorem */
@media all and (min-width: 500px) {
    selector {    
        display: none;
        margin: 1em;
    }
}`,

`/* Lorem */
@media all and /* ipsum */ (min-width: 500px) {
    selector {    
        display: none;
        margin: 1em;
    }
}`,

`/* Lorem */
@media all and (min-width: 500px) 
/* below */
{
    selector {    
        display: none;
        margin: 1em;
    }
}`,

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
}`,

`/* Lorem */
@media screen /* 1 */ and (min-width: 30em) /* 2 */ and (orientation: landscape) /* 3 */
{
    selector {    
        display: none;
        margin: 1em;
    }
}`,

`/* Lorem */
@media (min-height: 680px), /* ipsum */ screen and (orientation: portrait) /* dolor */ {
    selector {    
        display: none;
        margin: 1em;
    }
}`,

`/* Lorem */
@media (prefers-color-scheme) /* ipsum */ {
    /* Dolor */
    @supports /* igitum */ (-webkit-touch-callout: none) {
        video {
            -webkit-tap-highlight-color: transparent;
        }
    }
}`


      ]
    },

    // inline style ----------------------------------------------------------------------
    { context: 'declarationList',
      css: [
`/* Lorem */display: /*ipsum*/ none; margin: 1em;`,

`display: none; /* Lorem */background: /* dolor */ red, /* ipsum */green, /* before */ blue /* after */!important /* end */; margin: 1em;`

`display: none; margin: 1em /* after */`
      ]
    },
]