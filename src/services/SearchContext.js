import React, { createContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { createSearchHistory } from "../database/queries";

let actual = new Date();
const db = SQLite.openDatabase("db.db");

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const today = `${actual.getDate()}-${
    actual.getMonth() + 1
  }-${actual.getFullYear()}`;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const [searchHistory, setSearchHistory] = useState([]);

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
    getSearchHistory();
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

  return (
    <SearchContext.Provider
      value={{
        isLoading,
        isError,
        searchHistory
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
