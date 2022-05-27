import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import { DataListProps } from "../Dashboard";
import { VictoryPie } from "victory-native";
import {
    Container,
    Content,
    Header,
    Title,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";


interface CategoryData {
    name: string,
    total: number,
    totalFormatted: string,
    color: string,
    key: string,
    percent: string
}

export function Resume() {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const theme = useTheme();
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const handleDateChange = (action: 'next' | 'prev') => {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    const loadData = async () => {
        setIsLoading(true);
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted: DataListProps[] = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter(expensive =>
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives.reduce((acumullator: number, expensive: DataListProps) => {
            return acumullator + Number(expensive.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach(expensive => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            })

            const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

            categorySum && totalByCategory.push({
                name: category.name,
                color: category.color,
                key: category.key,
                totalFormatted: categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                total: categorySum,
                percent
            })
        })
        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    }
    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer> :
                    <Content
                    contentContainerStyle={{
                        padding: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                        <Month>{format(selectedDate, 'MMMM, yyy', { locale: ptBR })}</Month>
                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>
                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: {
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={80}
                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    {
                        totalByCategories.map(item => (
                            <HistoryCard
                                title={item.name}
                                amount={item.totalFormatted}
                                key={item.key}
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            }
            
        </Container>
    )
}