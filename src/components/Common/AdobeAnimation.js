import useScript from '@hooks/useScript';

const AnimationScript = ({ fileName }) => {
    useScript(`./animations/${fileName}`);
}

export default AnimationScript;