import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeArea } from "../../components/utility/SafeAreaComponent";
import { useNetInfo } from "@react-native-community/netinfo";
import styled from "styled-components";

const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.space[2]};
`;

const ImageIllustration = styled(Image)`
  height: 250px;
  width: 320px;
  resize-mode: contain;
`;

const TextNotFound = styled(Text)`
  font-size: 18px;
  font-family: ${(props) => props.theme.fonts.body};
  color: black;
  text-align: center;
`;

export const LossInternetScreen = () => {
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      navigation.navigate("HomePage");
    }
  }, [netInfo]);

  return (
    <SafeArea>
      <Wrapper>
        <ImageIllustration source={require(`../../image/page-not-found.png`)} />
        <TextNotFound>
          Aucune connexion internet, veuillez vous connecter
        </TextNotFound>
      </Wrapper>
    </SafeArea>
  );
};
