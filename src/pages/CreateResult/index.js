/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import {
  Container,
  QuestionCard,
  Card,
  Button,
  QuestionTitleInput,
  OptionInput,
  OptionInputContainer,
  I,
  QuestionTitleInputContainer,
  Body,
  OptionAction,
} from "./styles";
import Header from "../../components/Header";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  URL_ROOT,
  URL_SURVEYS,
  IDLE,
  CANCEL
} from "../../utils/constants";


export default function CreateResult ({ history }) {

  const [description, setDescription] = useState([]);
  const [scores, setScores] = useState([]);
  const [links, setLinks] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");

  const handleOptionsChange = (e, index) => {
    const { value } = e.target;
    const newOptions = [...description];
    newOptions[index] = value;
    setDescription(newOptions);
  };
  const handleScoreChange = (e, index) => {
    const { value } = e.target;
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };
  const handleLinkChange = (e, index) => {
    const { value } = e.target;
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleQuestionTitleChange = e => {
    const { value } = e.target;
    setQuestionTitle(value);
  };

  const addNewOption = () => {
    if (description.length >= 10) {
      toast.error("You can only add a maximum of 10 options");
      return;
    }
    const newOptions = [...description, ""];
    const newScores = [...scores, ""];
    const newLinks = [...links, ""];
    setDescription(newOptions);
    setScores(newScores)
    setLinks(newLinks)
  };
  const deleteOption = index => {
    if (description.length === 1) {
      toast.error("You need at least one option");
      return;
    }
    const newOptions = [...description];
    const newScores = [...scores];
    const newLinks = [...links];
    newOptions.splice(index, 1);
    newScores.splice(index, 1);
    newLinks.splice(index, 1);
    setDescription(newOptions);
    setScores(newScores);
    setLinks(newLinks);
  };


  const saveResult = () => {
    const requestBody = {
      title: questionTitle,
      options: description.map((des, idx)=> ({
        description: des,
        score: scores[idx],
        link: links[idx]
      })),
    };
    console.log(requestBody)
    if (questionTitle === "") {
      toast.error("Error: untitled");
      return;
    }

    if (description.some(o => !o)) {
      toast.error("Error: Some description(s) are empty!");
      return;
    }
    if (scores.some(o => !o)) {
      toast.error("Error: Some scores(s) are empty!");
      return;
    }
    if (links.some(o => !o)) {
      toast.error("Error: Some links(s) are empty!");
      return;
    }

    api
      .post("result", requestBody)
      .then(() => {
        toast.success("☑ Result created successfuly!");
        history.push(URL_ROOT);
      })
      .catch(err => {
        toast.error(
          "Error creating result: " + err?.response?.data?.message ||
            err?.response?.data
        );
      });
  };

  return (
    <Container>
      <Header
        createSurvey={false}
        leftButtons={[
          <Button
            key={`${CANCEL}-BUTTON`}
            color="danger"
            onClick={() => history.push(URL_SURVEYS)}
          >
            Cancel
          </Button>,
          <Button
            key={`${IDLE}-BUTTON`}
            color="purple"
            onClick={() => saveResult()}
          >
            Save
          </Button>
        ]}
      />
      <Body>
        <QuestionCard>
          <Card>
            <QuestionTitleInputContainer>
              <QuestionTitleInput
                onChange={handleQuestionTitleChange}
                value={questionTitle}
                placeholder="Result Title"
                maxLength="250"
              ></QuestionTitleInput>
            </QuestionTitleInputContainer>
            {description.map((op, index) => {
              return (
                <OptionInputContainer key={index}>
                  <I className="material-icons left">menu</I>
                  <OptionInput
                    placeholder="Description"
                    value={op}a
                    onChange={e => handleOptionsChange(e, index)}
                    maxLength="250"
                  ></OptionInput>
                  <OptionInput
                    placeholder="Score"
                    value={scores[index]}
                    onChange={e => handleScoreChange(e, index)}
                    maxLength="250"
                  ></OptionInput>
                  <OptionInput
                    placeholder="Link"
                    value={links[index]}
                    onChange={e => handleLinkChange(e, index)}
                    maxLength="250"
                  ></OptionInput>

                  <OptionAction onClick={() => deleteOption(index)}>
                    <I className="material-icons left">cancel</I>
                  </OptionAction>
                </OptionInputContainer>
              );
            })}
            <Button color="green" rightIcon="add" onClick={addNewOption}>
              Add
            </Button>
          </Card>
        </QuestionCard>
      </Body>
    </Container>
  );
}
