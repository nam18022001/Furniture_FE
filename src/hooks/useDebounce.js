import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  return debounce;
}

export default useDebounce;
