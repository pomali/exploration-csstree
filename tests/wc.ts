import parseWithComments from "../src/parse-with-comments";

const input = `
/* comment above */
.red {
    color: red;
    /* this is comment */
}`;

const ast = parseWithComments(input);
console.log(JSON.stringify(ast, null, 2));
