import styled, { css } from "styled-components/native";
import Icons from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps  {
    type: 'up' | 'down';
}
interface ContainerProps {
    isActive: boolean;
    type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
    flex: 1;

    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1.5px solid ${({theme}) => theme.colors.text};

    ${({isActive, type}) => isActive === true && type === 'down' && css`
        background-color: ${({theme}) => theme.colors.attention_light};
        border: 0;
    `}

    ${({isActive, type}) => isActive === true && type === 'up' && css`
        background-color: ${({theme}) => theme.colors.success_light};
        border: 0;
    `}

    border-radius: 5px;

    padding: 16px;
`
export const Icon = styled(Icons)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;
    color: ${({theme, type}) => 
        type === 'up' ? theme.colors.success : theme.colors.attention
    };
`
export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;


`