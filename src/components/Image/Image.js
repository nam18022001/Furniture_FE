import { useState, forwardRef } from 'react';

import images from '~/assets/images';

const Image = forwardRef(({ src, alt, className, fallback: customFallback = images.noImage, ...props }, ref) => {
  const [fallback, setFallBack] = useState();

  const hanldError = () => {
    setFallBack(customFallback);
  };

  return <img ref={ref} className={className} src={fallback || src} {...props} alt={alt} onError={hanldError} />;
});

export default Image;
