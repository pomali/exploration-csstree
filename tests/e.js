const csstree = require("css-tree");
const input = `.red {
    color: red; /* this is comment */
}`;

csstree.parse(input, {
  onComment: (value, loc) => {
    console.log(value, loc);
  },
  
});
