const { fathom } = window as any;

const EVENTS = {
    copyImageUrl: 'QIRAPKU6',
    downloadImage: 'TIGSZB4E',
    fields_selectNoImage: 'K7K0U6WF',
    fields_selectCustomTheme: 'FTLQFX1M',
};

function trackEvent(event: keyof typeof EVENTS, centValue?: number) {
    fathom.trackGoal(EVENTS[event], centValue);
}

export default trackEvent;
