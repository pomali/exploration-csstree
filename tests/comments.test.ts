import parseWithComments from "../src/parse-with-comments";

test("prase comments block after", () => {
  const input = `.red {
          color: red;
          /* this is comment */
      }`;
  const out = parseWithComments(input);
});

test("prase comments block after in line 1", () => {
  const input = `.red {
            color: red; /* this is comment */
        }`;
  parseWithComments(input);
});

test("prase comments block after in line 2", () => {
  const input = `.red {
            color: /* this is comment */ red; 
        }`;
  parseWithComments(input);
});

test("prase comments block after in line 3", () => {
  const input = `.red {
              color/* this is comment */:  red; 
          }`;
  parseWithComments(input);
});

test("prase comments block after in line 4", () => {
  const input = `.red {
          /* this is comment */color:  red; 
          }`;
  parseWithComments(input);
});

test("prase comments block before", () => {
  const input = `.red {
      /* this is comment */
            color: red;
        }`;
  parseWithComments(input);
});

test("prase comments selector 1", () => {
  const input = `.red /* this is comment */ {
              color: red;
          }`;
  parseWithComments(input);
});

test("prase comments selector 2", () => {
  const input = `/* this is comment */.red  {
              color: red;
          }`;
  parseWithComments(input);
});

test("prase comments before", () => {
  const input = `/* this is comment */
      .red  {
              color: red;
          }`;
  parseWithComments(input);
});
