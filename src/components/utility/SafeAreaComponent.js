import styled from "styled-components";
import { StatusBar, SafeAreaView } from "react-native";

export const SafeArea = styled(SafeAreaView)`
    flex:1;
    background-color:white;
    ${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`}
`