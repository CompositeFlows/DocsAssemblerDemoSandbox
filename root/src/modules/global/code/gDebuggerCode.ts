import IReport from "../../interfaces/state/debug/IReport";
import IState from "../../interfaces/state/IState";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";


const pad = '    ';

const logProperties = (
    node: IRenderFragment,
    report: IReport,
    padding: string
): void => {

    let output = `
${padding}i=${node.id}
${padding}o=${node.option ?? 'NULL'}
${padding}v=${node.value ?? 'NULL'}`;

    report.output = `${report.output}${output}`;

};

const logNode = (
    node: IRenderFragment,
    report: IReport,
    padding: string
): void => {

    logProperties(
        node,
        report,
        padding
    );

    if (node.link) {

        report.output = `${report.output}
${padding}LINK:`;

        if (node.link.root) {

            logNode(
                node.link.root,
                report,
                `${padding}${pad}`
            );
        }
    }

    if (node.options?.length > 0) {

        report.output = `${report.output}
${padding}OPTIONS:`;

        for (const option of node.options) {

            logProperties(
                option,
                report,
                `${padding}${pad}`
            );

            report.output = `${report.output}
`;
        }
    }

    if (node.selected) {

        report.output = `${report.output}
${padding}SELECTED:`;

        logNode(
            node.selected,
            report,
            `${padding}${pad}`
        );
    }
};

const gDebuggerCode = {

    stringifyWithoutCircular: (obj: any): any => {

        const seen = new WeakSet();

        return JSON.stringify(obj, (_key, value) => {

            if (typeof value === 'object' && value !== null) {

                if (seen.has(value)) {

                    if (value.id) {

                        return `[Circular] - ${value.id}`;
                    }

                    return '[Circular]';
                }

                seen.add(value);
            }

            return value;
        });
    },
    
    logRoot: (state: IState): void => {

        // const report: IReport = {
        //     output: ""
        // };

        // const root = state.renderState.displayGuide?.root;

        // if (!root) {
        //     return;
        // }

        // if (!root.selected?.selected) {

        //     console.log('');
        // }

        // logNode(
        //     root,
        //     report,
        //     ''
        // );

        const json = gDebuggerCode.stringifyWithoutCircular(state.renderState.displayGuide?.root);

        console.log(json);
    },
};

export default gDebuggerCode;

