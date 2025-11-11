import IState from "../src/modules/interfaces/state/IState";
import gStateCode from "../src/modules/global/code/gStateCode";
import IRenderFragment from "../src/modules/interfaces/state/render/IRenderFragment";
import IHookRegistry from "../src/modules/interfaces/window/IHookRegistry";
import HookRegistry from "./HookRegistry"
import IDisplayChart from "../src/modules/interfaces/state/display/IDisplayChart";
import IStringOutput from "./IStringOutput";
import gUtilities from "../src/modules/global/gUtilities";


declare global {

    interface Window {

        HookRegistry: IHookRegistry
    }
}

const registerStepHook = (): void => {

    if (!window.HookRegistry) {

        window.HookRegistry = new HookRegistry();
        window.HookRegistry.registerStepHook(stepHook.processStep);
    }
};

const PROCESS_STEP = '<p>PROCESS_STEP</p>';

const runProcessStep = (step: IRenderFragment): boolean => {

    let stepText = step.value;
    let firstlineEndIndex = stepText.indexOf('\n');
    let firstLine = '';

    if (firstlineEndIndex === -1) {

        firstLine = stepText;
        stepText = ''
    }
    else {
        firstLine = stepText.substring(0, firstlineEndIndex);
        stepText = stepText.substring(firstlineEndIndex + 1);
    }

    if (firstLine.trim() === PROCESS_STEP) {

        step.value = stepText;

        return true;
    }

    return false;
};

const printStepVariables = (
    step: IRenderFragment,
    stringOutput: IStringOutput
): string | null => {

    if (!step.variable
        || step.variable.length === 0
    ) {
        return null;
    }

    const stepVariables = step.variable;
    const openVariables = stringOutput.openVariables;
    let variableOutput = '';
    let output = '';
    let start = '';
    let end = '';
    let variableName = '';

    const ulVariables = [
        "towerLocation",
        "growEasy",
        "frameCount",
        "frame",
        "moduleType",
        "moduleModel",
        "twin",
        "herbBay",
        "cropCategory"
    ]

    const resetVariables = [
        "demoEnd"
    ]

    for (const variable of stepVariables) {

        start = '<li>';
        end = '</li>';

        if (variable.length === 1) {

            variableName = variable[0].trim()
            variableOutput = `${variableName} = ${step.selected?.option.trim() ?? 'no option selected'}`;
        }
        else {
            variableName = variable[0].trim()
            variableOutput = `${variableName} = ${variable[1].trim()}`;
        }

        if (stringOutput.nestingLevel === 0) {

            stringOutput.nestingLevel++;
            start = `<ul>${start}`;
        }

        if (resetVariables.includes(variableName) === true) {

            for (let k = 0; k < openVariables.length; k++) {

                start = `</ul>${start}`;
            }

            openVariables.length = 0;
            stringOutput.nestingLevel = 1;
        }
        else {
            let counter = 0;

            for (let i = openVariables.length - 1; i >= 0; i--) {

                counter++;

                if (openVariables[i] === variableName) {

                    for (let j = 0; j < counter; j++) {

                        start = `</ul>${start}`;
                        stringOutput.nestingLevel--;
                    }

                    openVariables.length = i;

                    break;
                }
            }

            if (ulVariables.includes(variableName) === true) {

                // Next variable will be within the ul for ths variableName
                end = `${end}<ul>`;
                stringOutput.openVariables.push(variableName);
                stringOutput.nestingLevel++;
            }
        }

        variableOutput = `${start}${variableOutput}${end}`;
        output = `${output}${variableOutput}
`
    }

    return variableOutput;
};

const printChainStepVariables = (
    state: IState,
    step: IRenderFragment | null | undefined,
    stringOutput: IStringOutput
): void => {

    if (!step) {
        return;
    }

    const stepVariable = printStepVariables(
        step,
        stringOutput
    );

    if (stepVariable) {

        stringOutput.output = `${stringOutput.output}
${stepVariable}`
    }

    printChainStepVariables(
        state,
        step.link?.root,
        stringOutput
    );

    printChainStepVariables(
        state,
        step.selected,
        stringOutput
    );
}

const printChainVariables = (
    state: IState,
    step: IRenderFragment
): void => {

    const root = state.renderState.displayGuide?.root;

    if (!root) {
        return;
    }

    let stringOutput: IStringOutput = {
        output: '',
        nestingLevel: 0,
        openVariables: []
    };

    printChainStepVariables(
        state,
        root,
        stringOutput
    );

    for (let i = 0; i < stringOutput.nestingLevel; i++) {

        stringOutput.output = `${stringOutput.output}</ul>`;
    }

    step.value = `${step.value}
${stringOutput.output}`
}


const stepHook = {

    processStep: (
        state: IState,
        step: IRenderFragment,
    ): void => {

        try {
            const runProcess: boolean = runProcessStep(step);

            if (!runProcess) {
                return;
            }

            printChainVariables(
                state,
                step
            );
        }
        catch (exp) {
            console.log(exp);
        }
    },
};

export default stepHook;


registerStepHook();

