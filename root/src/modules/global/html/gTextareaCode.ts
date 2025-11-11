import IState from "../../interfaces/state/IState";


const gTextareaCode = {

    setTextAreaHeight: (textArea: HTMLTextAreaElement): void => {

        if (textArea.value === "") {

            textArea.style.height = textArea.style.minHeight;

            return;
        }

        textArea.style.height = ""; // Get scroll height after setting height to nothing
        let scrollHeight = textArea.scrollHeight;
        let newHeight = scrollHeight + 3;
        textArea.style.height = newHeight + 'px';
    },

    onTextAreaInput: (
        state: IState,
        event: any): IState => {

        gTextareaCode.setTextAreaHeight(event.target);

        return state;
    },

    setAllTextAreaHeights: (): void => {

        const textareas: NodeListOf<HTMLTextAreaElement> = document.querySelectorAll(`#lens textarea`) as NodeListOf<HTMLTextAreaElement>;

        textareas.forEach((textarea) => {
            gTextareaCode.setTextAreaHeight(textarea)
        });
    }
};

export default gTextareaCode;

