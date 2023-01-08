import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { getType } from "../components/Constants";
import { createSearchHistory } from "../database/queries";
import {useNetInfo} from "@react-native-community/netinfo";

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [apiLoaded, SetApiLoaded]= useState({questions:false, answers:false});
  const netInfo = useNetInfo();


  useEffect(() => {
    createTables();
  }, []);

  useEffect(() => {
    if(questionsList.length === 0 && answersList.length === 0){
      SetApiLoaded({questions:true, answers:true})
     
      console.log("before", apiLoaded);
     const getApiCall = async () => {
       const questions = await axios.get(
         "https://dev-a39wny19cs68266.api.raw-labs.com/search-engine"
       );
       const answers = await axios.get(
         "https://dev-a39wny19cs68266.api.raw-labs.com/database-answers"
       );
       if (questions.status === 200) {
         console.log("questions loaded successfuly");
         SetApiLoaded((prev)=> ({questions:false,answers:prev.answers}))
         setQuestionsList(questions.data);
       }
 
       if (answers.status === 200) {
         console.log("answers loaded successfully");
         SetApiLoaded((prev)=> ({questions:prev.questions,answers:false}))
         setAnswersList(answers.data);
       }
       console.log("after", apiLoaded);
     };
     getApiCall();
    }
  },[netInfo.isConnected, questionsList, answersList])

  
  useEffect(() => {
    const getSearchHistory = () => {
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

    getSearchHistory();

  },[searchLoading])

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

  
  const insertData = (searchQuery) => {
    
    setSearchLoading(true);
    db.transaction((txn) => {
      txn.executeSql(
        `INSERT INTO searchHistory (jour, searchText) VALUES(?,?)`,
        [today, searchQuery],
        (sqlTxn, res) => {
          console.log( `history inserted successfuly`);
          
    
    setSearchLoading(false);
        },
        (error) => {
          console.log(
            "une erreur survenue lors de l'insertion de la table searchHistory" + error.message
          );}
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
      //Etape 1 : on parcours et on trie la liste des réponses en fonction du type de réponse recherché
      const questionType = getType(questionFound.question);
      let matching = null;
      for(let answer of answersList){
        matching = answer.keywords.find(elt => elt.toUpperCase() === questionType.toUpperCase());
        if(matching){
          result.push(answer);
        }
      }

      //on vérifie si il n'ya eu aucun matching du tout dans ce cas on met le resultat à toute la BD de réponses
      if(result.length === 0){
        result = answersList;
      }

      //Etape 2 : on parcours la liste des réponses et on vérifie si sa relation existe dans le tableau
      let newResult = []; 
      matching = null;
      for(let elt of result){
        for(let relation of questionFound.relation){
          matching = elt.keywords.find(elt => elt.toUpperCase().includes(relation.toUpperCase()));
          if(matching){
            newResult.push(elt);
          }
          break;
        }
      }

      //on vérifie si le newResult est vide si c'est le cas on remet la valeur de result 
      if(newResult.length ===0){
        newResult = result;
      }

      //Etape 3: on parcours la liste des entités de question pour voir une équivalence
      matching = null;
      for(let final of newResult ){
        for(let entity of questionFound.entity){
          const matching = final.keywords.find((elt) => elt.toUpperCase().includes(entity.toUpperCase()));
          if(matching){
            finalResult.push(final);
          }
        }
      }

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
        apiLoaded,
        insertData,
        changeLanguage,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
