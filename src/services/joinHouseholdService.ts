export function validateJoinHousehold(
  profileName: string,
  selectedAvatar: string
): string | null {
  if (!profileName.trim()) return "Måste ha ett profilnamn";
  if (!selectedAvatar) return "Måste välja en Avatar";
  return null;
}

export function validateInvitationCode(invitationcode: string): string | null {
  if (!invitationcode) return "Ange en kod";
  return null;
}
