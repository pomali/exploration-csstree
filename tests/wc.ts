import parseWithComments from "../src/parse-with-comments";

const input = `.red {
    color: red;
    /* this is comment */
}`;

const ast = parseWithComments(input);
console.log(ast);
