

const gSession = {

    // Focus
    getFocusFilter: (): string => {
      
        const filter: string | null = sessionStorage.getItem('focusFilter');

        if (!filter) {
            return '';
        }

        return filter
    },

    setFocusFilter: (value: string): void => {

        sessionStorage.setItem('focusFilter', value);
    },

    clearAllFocusFilters: (): void => {

        sessionStorage.removeItem('focusFilter');
    },

    removeFocusFilter: (filter: string): void => {

        const currentFilter = gSession.getFocusFilter();

        if (filter === currentFilter) {
            gSession.clearAllFocusFilters();
        }
    }
};

export default gSession;