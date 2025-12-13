export const MYSTICAL_MESSAGES = [
  "The universe aligns in your favor",
  "Trust your intuition today",
  "A new path opens before you",
  "Your energy attracts miracles",
  "The stars reveal hidden opportunities",
  "Destiny favors the brave",
  "Your manifestation is near",
  "The cosmos whispers success",
  "Fortune smiles upon you",
  "Your journey reaches a milestone",
]

export function getRandomMessage(): string {
  return MYSTICAL_MESSAGES[Math.floor(Math.random() * MYSTICAL_MESSAGES.length)]
}
