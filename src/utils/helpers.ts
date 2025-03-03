import { Coordinates } from '~models';

export function getAllPermutations<T>(arr: T[]): T[][] {
    if (arr.length <= 1) return [arr];

    let permutations: T[][] = [];
    arr.forEach((item, index) => {
        let remaining = arr.slice(0, index).concat(arr.slice(index + 1));
        let subPermutations = getAllPermutations(remaining);
        subPermutations.forEach((perm) => permutations.push([item, ...perm]));
    });

    return permutations;
}

export function getDistance(a: Coordinates, b: Coordinates): number {
    return Math.sqrt(Math.pow(a.latitude - b.latitude, 2) + Math.pow(a.longitude - b.longitude, 2));
}
