import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { getType } from "../components/Constants";
import { createSearchHistory } from "../database/queries";

let actual = new Date();
const db = SQLite.openDatabase("db.db");

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const today = `${actual.getDate()}-${
    actual.getMonth() + 1
  }-${actual.getFullYear()}`;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [language, setLanguage] = useState({ english: true, french: false });
  const [questionsList, setQuestionsList] = useState([]);
  const [answersList, setAnswersList] = useState([]);
  const [resultQuery, setResultQuery] = useState([]);

  useEffect(() => {
    createTables();
    const getSearchHistory = () => {
      setIsLoading(true);
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM searchHistory ORDER BY id DESC`,
          [],
          (sqlTxn, res) => {
            console.log(res.rows._array);
            setSearchHistory(res.rows._array);
          },
          (error) => {
            setIsError(error.message);
            setIsLoading(false);
          }
        );
      });
    };

    const getApiCall = async () => {
      const questions = await axios.get(
        "https://dev-a39wny19cs68266.api.raw-labs.com/search-engine"
      );
      const answers = await axios.get(
        "https://dev-a39wny19cs68266.api.raw-labs.com/database-answers"
      );
      if (questions.status === 200) {
        setQuestionsList(questions.data);
      }

      if (answers.status === 200) {
        setAnswersList(answers.data);
      }
    };
    getSearchHistory();
    getApiCall();
  }, []);

  const createTables = () => {
    db.transaction((txn) => {
      txn.executeSql(
        createSearchHistory,
        [],
        (sqlTxn, res) => {
          console.log("search history table create successfuly");
        },
        (error) => {
          console.log(
            "an error occured when creating the table" + error.message
          );
        }
      );
    });
  };

  const handleSearch = (searchQuery) => {
    setIsLoading(true);
    let finalResult = [];
    //on vérifie si la question existe parmi la liste des questions
    const questionFound = questionsList.find((elt) =>
      elt.question.toUpperCase().includes(searchQuery.toUpperCase())
    );
    if (questionFound) {
      let result = [];
      //on parcours la liste des réponses et on vérifie si une entité de la question est un mot clé des réponses
      for (let questionElement of questionFound.entity) {
        for (let answer of answersList) {
          const answerFound = answer.keywords.find((elt) =>
            elt.toUpperCase().includes(questionElement.toUpperCase())
          );
          if (answerFound) {
            result.push(answer);
          }
        }
      }
      const searchType = getType(searchQuery);
      //on filtre les résultats en fonction du type de recherche
      if (searchType) {
        for (let res of result) {
          const temp = res.keywords.find((elt) =>
            elt.toLowerCase().includes(searchType.toLowerCase())
          );
          if (temp) {
            finalResult.push(res);
          }
        }
      } else {
        finalResult = result;
      }

      // console.log(result);
    } else {
      let result = [];
      //on parcours la liste des réponses et on vérifie si leurs mots clés font partie de phrase
      for (let answer of answersList) {
        for (let key of answer.keywords) {
          const answerFound = searchQuery
            .toUpperCase()
            .includes(key.toUpperCase());
          if (answerFound) {
            result.push(answer);
          }
        }
      }
      const searchType = getType(searchQuery);
      //on filtre les résultats en fonction du type de recherche
      if (searchType) {
        for (let res of result) {
          const temp = res.keywords.find((elt) =>
            elt.toLowerCase().includes(searchType.toLowerCase())
          );
          if (temp) {
            finalResult.push(res);
          }
        }
      } else {
        finalResult = result;
      }
    }
    setTimeout(() => {
      setIsLoading(false);
      console.log(finalResult);
      setResultQuery(finalResult);
    }, 2000);
  };

  const changeLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <SearchContext.Provider
      value={{
        isLoading,
        isError,
        searchHistory,
        language,
        questionsList,
        answersList,
        resultQuery,
        changeLanguage,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
