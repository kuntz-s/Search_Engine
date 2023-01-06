import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { SafeArea } from "../../components/utility/SafeAreaComponent";
import { Spacer } from "../../components/utility/SpacerComponent";
import { colors } from "../../infrastructure/theme/colors";
import { fonts, fontSizes } from "../../infrastructure/theme/fonts";
import { SearchContext } from "../../services/SearchContext";
import { getRandomQuestions } from "../../components/Constants";
import styled from "styled-components";

const Wrapper = styled(ScrollView)`
  flex: 1;
  padding: ${(props) => props.theme.space[2]};
  background-color: white;
`;

const ImageIllustration = styled(Image)`
  height: 90px;
  width: 250px;
  resize-mode: contain;
`;

const SearchWrapper = styled(View)`
  flex: 1;
  padding-vertical: 12px;
  align-items: center;
`;

const Search = styled(Searchbar).attrs({
  iconColor: colors.brand.primary,
})`
  border-radius: 24px;
  background-color: white;
`;

const AnimationWrapper = styled(View)`
  flex: 1;
  align-items: center;
`;

const LottieAnimation = styled(LottieView)`
  width: 300px;
  height: 300px;
`;

const ResultWrapper = styled(View)`
  padding: ${(props) => props.theme.space[2]};
`;
const ResultNumber = styled(Text)`
  font-size: 18px;
  font-family: ${(props) => props.theme.fonts.heading};
  color: gray;
  text-align: center;
`;

const ResultTextWrapper = styled(View)`
  padding: ${(props) => props.theme.space[3]};
  border-radius: 15px;
  border: 2px solid ${(props) => props.theme.colors.brand.gray};
`;
const ResultText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-family: ${(props) => props.theme.fonts.body};
  font-weight: bold;
  text-align: center;
`;

const SuggestionWrapper = styled(View)`
  padding-vertical: ${(props) => props.theme.space[4]};
`;

const SuggestionText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-family: ${(props) => props.theme.fonts.body};
  color:gray;
  text-align:center;
`;

const SuggestionButton = styled(Button).attrs({
  buttonColor: colors.brand.secondary,
  labelStyle: {
    fontSize: 15,
    fontFamily: fonts.body,
  },
})``;

export const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { searchQuery } = route.params;
  const [search, setSearch] = useState(searchQuery);
  const { isLoading, resultQuery, questionsList, handleSearch } = useContext(SearchContext);
  const [suggestionQuestions, setSuggestionQuestions] = useState([]);

  useEffect(() => {
    setSuggestionQuestions(getRandomQuestions(questionsList, searchQuery));
  }, []);

  const handlePress=(text) => {
    setSearch(text);
    handleSearch(text);
  }

  return (
    <SafeArea>
      <Wrapper showsVerticalScrollIndicator={false}>
        <SearchWrapper>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ImageIllustration
              source={require(`../../image/searchIcon1.png`)}
            />
          </TouchableOpacity>
          <Spacer elevation={4} position="top" size="medium" />
          <Search
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="recherche"
            onIconPress={() => console.log("steph ")}
          />
        </SearchWrapper>
        {isLoading && (
          <AnimationWrapper>
            <LottieAnimation
              key="animation"
              autoPlay
              loop
              resizeMode="cover"
              source={require("../../image/searchAnimation.json")}
            />
          </AnimationWrapper>
        )}
        {!isLoading && (
          <ResultWrapper>
            <Spacer position="top" size="small">
              <ResultNumber>
                Nous avons trouvé {resultQuery.length} résulats correspondant à
                votre recherche
              </ResultNumber>
            </Spacer>
            <Spacer position="top" size="large">
              {resultQuery.length === 0 && (
                <ResultTextWrapper>
                  <ResultText>Aucun résultat trouvé </ResultText>
                </ResultTextWrapper>
              )}
              {resultQuery.length > 0 &&
                resultQuery.map((elt) => {
                  return (
                    <Spacer position="bottom" size="medium" key={elt.id}>
                      <ResultTextWrapper>
                        <ResultText>{elt.answer} </ResultText>
                      </ResultTextWrapper>
                    </Spacer>
                  );
                })}
            </Spacer>
            <SuggestionWrapper>
              <Spacer position="bottom" size="medium">
                <SuggestionText>Quelques Suggestions</SuggestionText>
              </Spacer>
              {suggestionQuestions.map((elt,id) => {
                return (
                  <Spacer position="bottom" size="medium" key={id}>
                    <SuggestionButton
                      mode="contained"
                      onPress={() => {
                        handlePress(elt.question);
                      }}
                    >
                      {elt.question}
                    </SuggestionButton>
                  </Spacer>
                );
              })}
            </SuggestionWrapper>
          </ResultWrapper>
        )}
      </Wrapper>
    </SafeArea>
  );
};
