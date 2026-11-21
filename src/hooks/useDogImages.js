import { useCallback, useEffect, useState } from 'react';
import { parseDogImageResponse } from '../data/petcareValidation';

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random/6';

export default function useDogImages() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestNumber, setRequestNumber] = useState(0);
  const retry = useCallback(() => setRequestNumber((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    async function loadImages() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(DOG_API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Dog CEO respondió con HTTP ${response.status}.`);
        }

        const validImages = parseDogImageResponse(await response.json());

        if (isCurrent) setImages(validImages);
      } catch (requestError) {
        if (!isCurrent) return;
        console.error('No se pudieron cargar las imágenes de Dog CEO.', requestError);
        setImages([]);
        setError('No se pudieron cargar las imágenes. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        clearTimeout(timeoutId);
        if (isCurrent) setIsLoading(false);
      }
    }

    loadImages();
    return () => {
      isCurrent = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [requestNumber]);

  return { images, isLoading, error, retry };
}
