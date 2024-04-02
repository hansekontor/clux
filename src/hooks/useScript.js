import { useEffect } from 'react';

const useScript = url => {
    useEffect(() => {
        const script = document.createElement('script');

        script.url = url;
        script.async = true;
        script.type = "text/javascript";

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
}

export default useScript;