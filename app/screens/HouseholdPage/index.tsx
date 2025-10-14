import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "@/constants/app-theme";
import { Card } from "react-native-paper";

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
    }
];

export default function HouseholdPage() {
    const theme = useAppTheme();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    color: theme.colors.onSurface,
                    textAlign: 'center',
                }}
            >
                Här är när man gått in i ett hushåll och ska se lista över chores osv
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: theme.colors.onSurface,
                    opacity: 0.7,
                    textAlign: 'center',
                    marginTop: 20,
                }}
            >
                Denna sida kommer att utvecklas senare.
            </Text>
        </View>
    );
}