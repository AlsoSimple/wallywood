export default function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readData(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function test(){
  console.log('test');
}