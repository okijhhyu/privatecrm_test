export function quickSort(arr, compareFunction) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    const compareResult = compareFunction(arr[i], pivot);
    if (compareResult < 0) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left, compareFunction), pivot, ...quickSort(right, compareFunction)];
}
