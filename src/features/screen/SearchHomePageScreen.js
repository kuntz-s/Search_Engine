import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeArea } from "../../components/utility/SafeAreaComponent";
import { Searchbar, Button } from "react-native-paper";
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
  contentStyle:{
    justifyContent:"flex-start"
  },
  labelStyle: {
    fontSize: 20,
    fontFamily: fonts.body,
  },
  textColor:"#4D4D4D"
})`
  margin-vertical:${(props) => props.theme.space[1]}
`;

const historyConst = [
  "mon nom est stephane",
  "quel est ton nom ? ",
  "quel est notre nom ?",
];

export const SearchHomePageScreen = () => {
  const { changeLanguage, language, searchHistory } = useContext(SearchContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState(false);

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
              {language.french ? "Français" : "French"}
            </LanguageText>
          </TouchableOpacity>
        </LanguageWrapper>
        <SearchWrapper>
          <ImageIllustration source={require(`../../image/searchIcon1.png`)} />
          <Search
            suggestions={suggestions}
            elevation={2}
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            onPressIn={() => setSuggestions(true)}
            onEndEditing={() => setSuggestions(false)}
          />
          {!suggestions && (
            <Spacer position="top" size="large">
              <SearchButton
                icon="arrow-right"
                mode="contained"
                onPress={() => console.log("Pressed")}
              >
                {language.french ? "Rechercher" : "Search"}
              </SearchButton>
            </Spacer>
          )}
          {suggestions && (
            <SuggestionsWrapper elevation={1}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <HistoryTitle touchable={false}>Récents</HistoryTitle>
                <TouchableOpacity>
                  <HistoryTitle touchable={true}>Voir tout</HistoryTitle>
                </TouchableOpacity>
              </View>
              {/** liste des historiques  */}
              {historyConst.slice(0,4).map((history, id) => {
                return (
                    <SuggestionButton key={id} icon="clock-outline" mode="text" onPress = {() => {setSearchQuery(history); setSuggestions(false)}}>{history}</SuggestionButton>
                );
              })}
            </SuggestionsWrapper>
          )}
        </SearchWrapper>
      </Wrapper>
    </SafeArea>
  );
};

// <ImageIllustration source={ require(`../../../image/foodImage1.png`)} />