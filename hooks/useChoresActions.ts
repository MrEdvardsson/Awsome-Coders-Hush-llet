import { deleteChore, markChoreCompleted } from "@/src/data/chores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useChoresActions(
  householdId: string,
  userProfile: { id: string; profileName: string; selectedAvatar: string } | undefined
) {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async (choreId: string) => {
      if (!userProfile?.id)
        throw new Error("Ingen profil hittades för hushållet");
      await markChoreCompleted(householdId, choreId, userProfile.id);
      return choreId;
    },
    onMutate: async (choreId: string) => {
      await queryClient.cancelQueries({ queryKey: ["chores", householdId] });

      const previousChores = queryClient.getQueryData(["chores", householdId]);

      if (userProfile) {
        queryClient.setQueryData(["chores", householdId], (old: any) => {
          if (!old) return old;
          return old.map((chore: any) => {
            if (chore.id === choreId) {
              const newCompletion = {
                profile_id: userProfile.id,
                profileName: userProfile.profileName,
                selectedAvatar: userProfile.selectedAvatar,
                completedAt: new Date(),
              };
              return {
                ...chore,
                completedByProfiles: [
                  ...(chore.completedByProfiles || []),
                  newCompletion,
                ],
                daysSinceCompleted: 0,
                lastCompletedAt: new Date(),
              };
            }
            return chore;
          });
        });
      }

      return { previousChores };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["chores", householdId],
      });
      Alert.alert("Bra jobbat!", "Sysslan är markerad som klar!");
    },
    onError: (error: any, choreId, context: any) => {
      if (context?.previousChores) {
        queryClient.setQueryData(
          ["chores", householdId],
          context.previousChores
        );
      }
      console.error(error);
      const errorMessage =
        error?.message || "Kunde inte markera sysslan som klar.";
      Alert.alert("Fel", errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chores", householdId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (choreId: string) => {
      await deleteChore(householdId, choreId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores", householdId] });
      Alert.alert("Borttagen", "Sysslan har tagits bort.");
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Fel", "Kunde inte ta bort sysslan.");
    },
  });

  const handleDelete = (choreId: string, choreTitle: string) => {
    Alert.alert(
      "Ta bort syssla",
      `Är du säker på att du vill ta bort "${choreTitle}"?`,
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: () => deleteMutation.mutate(choreId),
        },
      ]
    );
  };

  return {
    completeMutation,
    deleteMutation,
    handleDelete,
  };
}
