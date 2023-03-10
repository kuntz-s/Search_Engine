import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeArea } from "../../components/utility/SafeAreaComponent";
import { Searchbar, Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";
import { Spacer } from "../../components/utility/SpacerComponent";
import { SearchContext } from "../../services/SearchContext";
import { colors } from "../../infrastructure/theme/colors";
import { fonts, fontSizes } from "../../infrastructure/theme/fonts";
import styled from "styled-components";

const Wrapper = styled(View)`
  flex: 1;
  padding: ${(props) => props.theme.space[2]};
`;

const LanguageWrapper = styled(View)`
  flex-direction: row-reverse;
`;

const LanguageText = styled(Text)`
  padding-left: ${(props) => props.theme.space[3]};
  font-size: 18px;
  font-family: ${(props) => props.theme.fonts.body};
  color:${(props) =>
    props.selected ? props.theme.colors.brand.primary : "black"}
  text-decoration:${(props) => (props.selected ? "underline " : "none")};
`;

const SearchWrapper = styled(View)`
  flex: 1;
  align-items: center;
`;

const ImageIllustration = styled(Image)`
  height: 250px;
  width: 320px;
  resize-mode: contain;
`;

const Search = styled(Searchbar)`
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: ${(props) => (props.suggestions ? "0px" : "24px")};
  border-bottom-right-radius: ${(props) =>
    props.suggestions ? "0px" : "24px"};
  background-color: white;
`;
const SearchButton = styled(Button).attrs({
  buttonColor: colors.brand.primary,
  labelStyle: {
    fontSize: 18,
    fontFamily: fonts.body,
  },
})``;

const SuggestionsWrapper = styled(View)`
  padding-vertical: ${(props) => props.theme.space[2]};
  padding-horizontal: ${(props) => props.theme.space[3]};
  min-height: 55px;
  width: 100%;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const HistoryTitle = styled(Text)`
  font-size: 18px;
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => (!props.touchable ? "#4D4D4D" : "black")};
`;

const SuggestionButton = styled(Button).attrs({
  contentStyle: {
    justifyContent: "flex-start",
  },
  labelStyle: {
    fontSize: 20,
    fontFamily: fonts.body,
  },
  textColor: "#4D4D4D",
})`
  margin-vertical: ${(props) => props.theme.space[1]};
`;

export const SearchHomePageScreen = () => {
  const {
    changeLanguage,
    language,
    questionsList,
    handleSearch,
    insertData,
    searchHistory,
    apiLoaded,
  } = useContext(SearchContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState(false);
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  useEffect(() => {
    if (!netInfo.isConnected) {
      navigation.navigate("LossInternet");
    }
  }, [netInfo]);

  const handleRedirect = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
      insertData(searchQuery);
      navigation.navigate("Result", { searchQuery });
      setSearchQuery("");
    }
  };

  return (
    <SafeArea>
      <Wrapper>
        <LanguageWrapper>
          <TouchableOpacity
            onPress={() =>
              changeLanguage({ ...language, english: true, french: false })
            }
          >
            <LanguageText selected={language.french ? false : true}>
              {language.french ? "Anglais" : "English"}
            </LanguageText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              changeLanguage({ ...language, english: false, french: true })
            }
          >
            <LanguageText selected={!language.french ? false : true}>
              {language.french ? "Fran??ais" : "French"}
            </LanguageText>
          </TouchableOpacity>
        </LanguageWrapper>
        <SearchWrapper>
          <ImageIllustration source={require(`../../image/searchIcon1.png`)} />

          {/**on affiche lorsque les donn??es ont ??t?? charg?? des api */}
          {!apiLoaded.questions && !apiLoaded.answers && (
            <Search
              suggestions={suggestions}
              elevation={2}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onPressIn={() => setSuggestions(true)}
              onEndEditing={() => setSuggestions(false)}
            />
          )}
          {!suggestions && !apiLoaded.questions && !apiLoaded.answers && (
            <Spacer position="top" size="large" style={{ display: "none" }}>
              <SearchButton
                icon="arrow-right"
                mode="contained"
                onPress={handleRedirect}
              >
                {language.french ? "Rechercher" : "Search"}
              </SearchButton>
            </Spacer>
          )}

          {/**on affiche lorsque les donn??es sont en pr??chargement */}
          {apiLoaded.questions && apiLoaded.answers && (
            <View>
              <ActivityIndicator
                animating={true}
                color={colors.brand.primary}
                size="large"
              />
              <Spacer position="top" size="medium">
                <Text style={{ fontSize: 18 }}>
                  Chagement des donn??es veuillez patienter ...
                </Text>
              </Spacer>
            </View>
          )}

          {suggestions && (
            <SuggestionsWrapper elevation={1}>
              <View
                style={{
                  flexDirection: "row",
                  display: searchQuery ? "none" : "flex",
                }}
              >
                <HistoryTitle touchable={false}>
                  {language.french ? "Historique r??cent " : "Recent history"}
                </HistoryTitle>
              </View>
              {/** liste des historiques  */}
              <View
                style={{
                  minHeight: 80,
                  display: searchQuery ? "none" : "flex",
                }}
              >
                {searchHistory.slice(0, 4).map((history) => {
                  return (
                    <SuggestionButton
                      key={history.id}
                      icon="clock-outline"
                      mode="text"
                      onPress={() => {
                        setSearchQuery(history.searchText);
                        setSuggestions(false);
                      }}
                    >
                      {history.searchText}
                    </SuggestionButton>
                  );
                })}
              </View>
              {/** on affiche la liste des suggestions lorsque l'utilisateur entre une recherche */}
              <View
                style={{
                  display: !searchQuery ? "none" : "flex",
                }}
              >
                {questionsList
                  .filter((elt) =>
                    elt.question
                      .toUpperCase()
                      .includes(searchQuery.toUpperCase())
                  )
                  .slice(0, 4)
                  .map((elt, id) => {
                    return (
                      <SuggestionButton
                        key={id}
                        icon="magnify"
                        mode="text"
                        onPress={() => {
                          setSearchQuery(elt.question);
                          setSuggestions(false);
                        }}
                        compact={true}
                      >
                        {elt.question}
                      </SuggestionButton>
                    );
                  })}
              </View>
            </SuggestionsWrapper>
          )}
        </SearchWrapper>
      </Wrapper>
    </SafeArea>
  );
};

// <ImageIllustration source={ require(`../../../image/foodImage1.png`)} />
