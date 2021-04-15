import { ParsedRequest } from './../types';

type Template = { [key: string]: (req: ParsedRequest) => string };

const templates: Template = {
    default: require('./default').getHtml,
    article: require('./article').getHtml,
    devto: require('./devto').getHtml,
};

export default templates;
