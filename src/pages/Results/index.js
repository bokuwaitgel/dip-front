import React, { useState, useEffect } from "react";

import { Container, Title, Description, Card, Question } from "./styles";
import axiosInstance from "../../services/api";

import Header from "../../components/Header";

import AnswerItem from "../../components/AnswerItem";

export default function Survey({ history, match }) {
  const [data, setData] = useState();
  const mount = data =>
    data?.questions?.map(question => {
      const total = question.result.reduce((acc, cur) => cur + acc, 0);

      return (
        <Card key={question.id}>
          <Question>{"Question: " + question.title}</Question>
          {question?.link && (
                <img className="center" src={question?.link} />
              )}
          {question?.options?.map((option, i) => (
            <AnswerItem
              key={i}
              questionId={question.id}
              answerId={option}
              text={option}
              showResults
              showPresentage={true}
              resultPercent={total ? question.result[i] / total : 0}
            />
          ))}
        </Card>
      );
    });

  useEffect(() => {
    axiosInstance
      .get(`/surveys/${match.params.id}/result`)
      .then(response => {
        setData(response?.data);
      })
      .catch();
  }, [match.params.id]);
  // console.log(data)
  return (
    <Container>
      <Header />
      {data && (
        <>
          <Title><Title>{data.title.split('.').length > 1  ? data.title.split('.')[1] : data.title}</Title></Title>
          {/* <Description>{data.description}</Description> */}
          {mount(data)}
        </>
      )}
    </Container>
  );
}