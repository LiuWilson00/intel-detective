import { AdventureTags } from "./costants/game.constans";
import { OccupationsList } from "./costants/occupations.costants";
import { Occupation } from "./interfaces/occupations.interface";
const base = 1.1;
export function getRandomOccupations(count: number): Occupation[] {
  const totalStars = OccupationsList.reduce(
    (sum, occupation) => sum + occupation.stars,
    0
  );

  const exponentOccupations = OccupationsList.map((occupation) => {
    const weight = Math.pow(base, totalStars - occupation.stars);
    return { ...occupation, weight };
  });

  const totalWeight = exponentOccupations.reduce(
    (sum, occupation) => sum + occupation.weight,
    0
  );

  const weightedOccupations = exponentOccupations.map(
    (occupation, index, array) => {
      const start = array
        .slice(0, index)
        .reduce((sum, item) => sum + item.weight, 0);
      const end = start + occupation.weight;
      return { ...occupation, range: [start, end] };
    }
  );

  const randomOccupations: Occupation[] = Array.from({ length: count }).map(
    () => {
      const randomNumber = Math.random() * totalWeight;
      const selectedOccupation = weightedOccupations.find(
        (occupation) =>
          randomNumber >= occupation.range[0] &&
          randomNumber < occupation.range[1]
      );
      return selectedOccupation;
    }
  );

  return randomOccupations;
}

export function generateRandomTags(count: number): string[] {
  const shuffledTags = [...AdventureTags].sort(() => Math.random() - 0.5);
  return shuffledTags.slice(0, count);
}
