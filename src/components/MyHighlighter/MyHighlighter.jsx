import React from 'react';
import Highlighter from 'react-highlight-words';

const MyHighlighter = ({ searchWords, textToHighlight }) => {
  return (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={searchWords}
      autoEscape={true}
      textToHighlight={textToHighlight}
    />
  );
};

export default MyHighlighter;
