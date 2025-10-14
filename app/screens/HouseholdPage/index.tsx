import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "@/constants/app-theme";
import { Card } from "react-native-paper";
import { router } from "expo-router";

type mockChore = {
    id: string;
    title: string; 
    description: string;
    frequencyDats: number;
    weight: number;
    imageUrl?: string;
    audioUrl?: string;
    isArchived: boolean;
    assignedTo: string; // Profile
};

const mockChores: mockChore[] = [
    {
        id: "1",
        title: "Damma av",
        description: "Damma av alla ytor i vardagsrummet.",
        frequencyDats: 7,
        weight: 3,
        isArchived: false,
        assignedTo: "user1",
    },
    {
        id: "2",
        title: "Dammsuga",
        description: "Dammsuga hela huset.",
        frequencyDats: 10,
        weight: 5,
        isArchived: false,
        assignedTo: "user2",
    },
    {
        id: "3",
        title: "Moppa golven",
        description: "Moppa alla golv i huset.",
        frequencyDats: 14,
        weight: 20,
        isArchived: false,
        assignedTo: "user3",
    },
];

export default function HouseholdPage() {
    const theme = useAppTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 20 }}>
            <FlatList data = {mockChores} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                <Card style={{ margin: 10, borderRadius: 15 }} onPress={() => router.push("/screens/householdpage/choreDetails")}>
                    <Card.Title title={item.title}/>
                </Card>
            )}>
            </FlatList>
        </View>
        
    );
}