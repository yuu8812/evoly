export const justifyJson = (text: string) => {
  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim()
  return cleanedText
}
