import produce, {enableES5} from 'immer';

export default (...args) => {
    enableES5();

    return produce(...args);
}