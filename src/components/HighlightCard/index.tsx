import React from "react";
import { 
    Container, 
    Header, 
    Title,
    Icon,
    Footer,
    Ammount,
    LastTransaction
} from "./styles";

interface Props {
    type: 'up' | 'down' | 'total';
    title: string;
    amount: string;
    lastTransaction: string;
}
const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
    total: 'dollar-sign',
}

export function HighlightCard({
    type,
    title, 
    amount, 
    lastTransaction
}: Props) {
    return (
        <Container type={type}>
            <Header>
                <Title type={type}>{title}</Title>
                <Icon name={icon[type]} type={type}/>
            </Header>
            <Footer>
                <Ammount type={type}>{amount}</Ammount>
                <LastTransaction type={type}>{lastTransaction}</LastTransaction>
            </Footer>
        </Container>
    )
}