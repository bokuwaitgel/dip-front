import React from "react";

import {
  Container,
  AnswerText,
  AnswerTextContainer,
  I,
  ResultPercentage
} from "./styles";

export default function AnswerItem({
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  answerId,
  questionId,
  selected = false,
  score=0,
  selections,
  onSelect = () => {},
  id,
  showResults = false,
  resultPercent
}) {
  const handleSelect = () => {
    onSelect({
      ...selections,
      [questionId]: {"answerId":answerId,'score':score}
    });
  };

  return (
    <Container
      selected={selected}
      onClick={handleSelect}
      percentage={resultPercent}
    >
      <AnswerTextContainer>
        <AnswerText>{text}</AnswerText>
      </AnswerTextContainer>
      {showResults ? (
        <ResultPercentage>{`${parseInt(
          score
        )}`}</ResultPercentage>
      ) : (
        <I className="material-icons" selected={selected}>
          {selected ? "check_box" : "check_box_outline_blank"}
        </I>
      )}
    </Container>
  );
}
