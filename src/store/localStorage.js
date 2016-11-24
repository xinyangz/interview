export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    const serializedTime = localStorage.getItem('time');
    const saveTime = JSON.parse(serializedTime);
    // timeout 300
    if (Date.now() - saveTime > 300 * 1000) {
      return undefined;
    }
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    const serializedTime = JSON.stringify(Date.now());
    localStorage.setItem('state', serializedState);
    localStorage.setItem('time', serializedTime);
  } catch (error) {
    // ignore error
  }
};