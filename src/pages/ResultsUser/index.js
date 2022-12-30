import React, { useState, useEffect } from "react";

import { Container, Title, Description,DescriptionOne, Card, Question } from "./styles";
import axiosInstance from "../../services/api";
import ReactPlayer from 'react-player'

import Header from "../../components/Header";

import AnswerItem from "../../components/AnswerItem";

import PropTypes from "prop-types";

const YoutubeEmbed = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

const list = ['9OpA013KxAs']

export default function Survey({ history, match }) {
  const [data, setData] = useState();
  const mount = data =>
    data?.questions?.map(question => {
      const total = question.result.reduce((acc, cur) => cur + acc, 0);

      return (
        <Card key={question.id}>
          <Question>{"Question: " + question.title}</Question>
          {console.log(question)}
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
              resultPercent={total ? question.result[i] / total : 0}
              score={question?.createdAt[i]}
            />
          ))}
        </Card>
      );
    });

  useEffect(() => {
    axiosInstance
      .get(`/surveys/${match.params.id}/${match.params.sur}/person`)
      .then(response => {
        setData(response?.data);
      })
      .catch();
  }, [match.params.id]);
  console.log(data)
  const res = data?.options?.filter(d => parseInt(d.score) >= parseInt(data.Res) )
  return (
    <Container>
      <Header />
      {data && (
        <>
          <Title><Title>{data.title.split('.').length > 1  ? data.title.split('.')[1] : data.title}</Title></Title>
          <Description>{`Your score: ${data.Res}`}</Description>
          <Description>{`${data.description}`}</Description>
          {res && 
            (
            <>
            {(<DescriptionOne>{res[0]?.description}</DescriptionOne>)}
            <ReactPlayer url={res[0]?.link} />
            </>
          )}
          {mount(data)}
        </>
      )}
    </Container>
  );
}
