/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import {
  Container,
  SideBar,
  SideBarItem,
  QuestionCard,
  QuestionItemContainer,
  QuestionTitle,
  QuestionAction,
  Card,
  Button,
  QuestionTitleInput,
  OptionInput,
  OptionInputContainer,
  I,
  QuestionTitleInputContainer,
  Body,
  OptionAction,
  SurveyName,
  SurveyInput
} from "./styles";
import SizedBox from "../../components/SizedBox";
import Header from "../../components/Header";
import { debounce, uniqBy } from "lodash";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  URL_ROOT,
  URL_SURVEYS,
  ACTIVE,
  IDLE,
  CANCEL
} from "../../utils/constants";

const defaultValue = {
  title: "",
  link: "",
  options: [""],
  scores: [""]
};

export default function CreateSurvey({ history }) {
  const [questions, setQuestions] = useState([{ ...defaultValue }]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [description, setDescription] = useState([]);
  const [resScores, setResScores] = useState([]);
  const [links, setLinks] = useState([]);
  const [ResultTitle, setResultTitle] = useState("");

  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");
  const [surveyTitle, setSurveyTitle] = useState("");


  const handleDescriptionChange = (e, index) => {
    const { value } = e.target;
    const newOptions = [...description];
    newOptions[index] = value;
    setDescription(newOptions);
  };
  const handleResScoreChange = (e, index) => {
    const { value } = e.target;
    const newScores = [...resScores];
    newScores[index] = value;
    setResScores(newScores);
  };
  const handleLinkChange = (e, index) => {
    const { value } = e.target;
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleResultTitleChange = e => {
    const { value } = e.target;
    setResultTitle(value);
  };
  const addResultOption = () => {
    const newOptions = [...description, ""];
    const newScores = [...resScores, ""];
    const newLinks = [...links, ""];
    setDescription(newOptions);
    setResScores(newScores)
    setLinks(newLinks)
  };
  const deleteResult = index => {
    if (description.length === 1) {
      toast.error("You need at least one result");
      return;
    }
    const newOptions = [...description];
    const newScores = [...resScores];
    const newLinks = [...links];
    newOptions.splice(index, 1);
    newScores.splice(index, 1);
    newLinks.splice(index, 1);
    setDescription(newOptions);
    setResScores(newScores);
    setLinks(newLinks);
  };

  useEffect(() => {
    setOptions(questions[selectedQuestion]?.options || []);
    setScores(questions[selectedQuestion]?.scores || []);
  }, [selectedQuestion]);
  // console.log(questions)

  useEffect(() => {
    setQuestionTitle(questions[selectedQuestion]?.title || "");
    setQuestionLink(questions[selectedQuestion]?.link || "");
  }, [selectedQuestion]);

  const createNewQuestion = () => {
    setQuestions([...questions, { ...defaultValue }]);
  };

  const handleSelected = i => {
    setSelectedQuestion(i);
  };

  const updateOptions = (index, newOptions) => {
    const newQuestions = [...questions];
    newQuestions[index].options = newOptions || options;
    setQuestions(newQuestions);
  };
  const updateScores = (index, newScores) => {
    const newQuestions = [...questions];
    newQuestions[index].scores = newScores || scores;
    setQuestions(newQuestions);
  };

  const updateQuestionTitle = (index, newTitle) => {
    // console.log('test1')
    const newQuestions = [...questions];
    newQuestions[index].title = newTitle || questionTitle;
    setQuestions(newQuestions);
  };
  const updateQuestionLink = (index, newLink) => {
    // console.log('test')
    const newQuestions = [...questions];
    newQuestions[index].link = newLink || questionLink;
    setQuestions(newQuestions);
  };

  const handleOptionsChange = (e, index) => {
    const { value } = e.target;
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const handleScoreChange = (e, index) => {
    const { value } = e.target;
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const handleQuestionTitleChange = e => {
    const { value } = e.target;
    setQuestionTitle(value);
  };
  const handleQuestionLinkChange = e => {
    const { value } = e.target;
    setQuestionLink(value);
  };


  const addNewOption = () => {
    if (options.length >= 10) {
      toast.error("You can only add a maximum of 10 options");
      return;
    }
    const newOptions = [...options, ""];
    const newScores = [...scores, ""];
    setOptions(newOptions);
    setScores(newScores)
  };
  const deleteOption = index => {
    if (options.length === 1) {
      toast.error("You need at least one option");
      return;
    }
    const newOptions = [...options];
    const newScores = [...scores];
    newOptions.splice(index, 1);
    newScores.splice(index, 1);
    setOptions(newOptions);
    setScores(newScores);
  };
  

  const deleteQuestion = index => {
    if (questions.length === 1) {
      toast.error("You need at least one question");
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setSelectedQuestion(0);
  };

  useEffect(() => {
    const doDebounce = debounce(
      () => updateOptions(selectedQuestion, options),updateScores(selectedQuestion,scores),
      100
    );
    doDebounce();
  }, [options, scores]);

  useEffect(() => {
    const doDebounce = debounce(
      () => updateQuestionTitle(selectedQuestion, questionTitle),
      100
    );
    doDebounce();
  }, [questionTitle]);
  useEffect(() => {
    const doDebounce = debounce(
      () => updateQuestionLink(selectedQuestion, questionLink),
      100
    );
    doDebounce();
  }, [questionLink]);

  const saveSurvey = (status = IDLE) => {
    const requestBody = {
      title: surveyTitle,
      description: ResultTitle,
      questions: questions.map(q => ({
        ...q,
        options: uniqBy(q.options, a => a),
        createdAt: uniqBy(q.scores, a => a)
      })),
      options: description.map((des, idx)=> ({
        description: des,
        score: resScores[idx],
        link: links[idx]
      })),
      status
    };
    // console.log(requestBody)
    if (description.some(o => !o)) {
      toast.error("Error: Some description(s) are empty!");
      return;
    }
    if (resScores.some(o => !o)) {
      toast.error("Error: Some scores(s) are empty!");
      return;
    }
    if (links.some(o => !o)) {
      toast.error("Error: Some links(s) are empty!");
      return;
    }

    if (questions.some(q => !q.title)) {
      toast.error("Error: Some question(s) are untitled");
      return;
    }

    if (questions.some(q => q.options.some(o => !o))) {
      toast.error("Error: Some options(s) are empty!");
      return;
    }

    api
      .post("/surveys", requestBody)
      .then(() => {
        toast.success("??? Survey created successfuly!");
        history.push(URL_ROOT);
      })
      .catch(err => {
        toast.error(
          "Error creating survey: " + err?.response?.data?.message ||
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
            key={`${ACTIVE}-BUTTON`}
            color="green"
            onClick={() => saveSurvey(ACTIVE)}
          >
            Save And Publish
          </Button>,
          <Button
            key={`${IDLE}-BUTTON`}
            color="purple"
            onClick={() => saveSurvey(IDLE)}
          >
            Save
          </Button>
        ]}
      />

      <SurveyName>
        <SurveyInput
          placeholder="Survey Title"
          value={surveyTitle}
          onChange={e => setSurveyTitle(e.target.value)}
        />
      </SurveyName>
      <Card>
            <QuestionTitleInputContainer>
              <QuestionTitleInput
                onChange={handleResultTitleChange}
                value={ResultTitle}
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
                    onChange={e => handleDescriptionChange(e, index)}
                    maxLength="250"
                  ></OptionInput>
                  <OptionInput
                    placeholder="Score"
                    value={resScores[index]}
                    onChange={e => handleResScoreChange(e, index)}
                    maxLength="250"
                  ></OptionInput>
                  <OptionInput
                    placeholder="Link"
                    value={links[index]}
                    onChange={e => handleLinkChange(e, index)}
                    maxLength="250"
                  ></OptionInput>

                  <OptionAction onClick={() => deleteResult(index)}>
                    <I className="material-icons left">cancel</I>
                  </OptionAction>
                </OptionInputContainer>
              );
            })}
            <Button color="green" rightIcon="add" onClick={addResultOption}>
              Add
            </Button>
          </Card>
      <Body>
        
        <SideBar>
          <Button color="green" rightIcon="add" onClick={createNewQuestion}>
            New Question
          </Button>
          {questions?.map((question, i) => (
            <SideBarItem
              key={i}
              selected={selectedQuestion === i}
              onClick={() => handleSelected(i)}
            >
              <QuestionItemContainer>
                <QuestionTitle>{question.title || "Untitled"}</QuestionTitle>
              </QuestionItemContainer>
            </SideBarItem>
          ))}
          <SizedBox height="10px;"></SizedBox>
        </SideBar>

        <QuestionCard>
          <Card>
            <QuestionTitleInputContainer>
              <QuestionTitleInput
                onChange={handleQuestionTitleChange}
                value={questionTitle}
                placeholder="Question Title"
                maxLength="250"
              ></QuestionTitleInput>
              <QuestionAction>
                <Button
                  color="danger"
                  onClick={() => deleteQuestion(selectedQuestion)}
                >
                  <I className="material-icons left">cancel</I>
                  Delete Question
                </Button>
              </QuestionAction>
            </QuestionTitleInputContainer>
            <QuestionTitleInput
                onChange={handleQuestionLinkChange}
                value={questionLink}
                placeholder="Question Link"
                maxLength="250"
              ></QuestionTitleInput>
            {options.map((op, index) => {
              return (
                <OptionInputContainer key={index}>
                  <I className="material-icons left">menu</I>
                  <OptionInput
                    placeholder="Option"
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
