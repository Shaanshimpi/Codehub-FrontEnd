import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, language }) => {
  return (
    <SyntaxHighlighter language={language} style={okaidia} showLineNumbers>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
