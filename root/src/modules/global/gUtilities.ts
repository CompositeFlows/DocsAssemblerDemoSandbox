

const gUtilities = {

    roundUpToNearestTen: (value: number) => {

        const floor = Math.floor(value / 10);

        return (floor + 1) * 10;
    },

    roundDownToNearestTen: (value: number) => {

        const floor = Math.floor(value / 10);

        return floor * 10;
    },

    convertMmToFeetInches: (mm: number): string => {

        const inches = mm * 0.03937;

        return gUtilities.convertInchesToFeetInches(inches);
    },

    indexOfAny: (
        input: string,
        chars: string[],
        startIndex = 0
    ): number => {

        for (let i = startIndex; i < input.length; i++) {

            if (chars.includes(input[i]) === true) {

                return i;
            }
        }

        return -1;
    },

    getDirectory: (filePath: string): string => {

        var matches = filePath.match(/(.*)[\/\\]/);

        if (matches
            && matches.length > 0
        ) {
            return matches[1];
        }

        return '';
    },

    countCharacter: (
        input: string,
        character: string) => {

        let length = input.length;
        let count = 0;

        for (let i = 0; i < length; i++) {

            if (input[i] === character) {
                count++;
            }
        }

        return count;
    },

    convertInchesToFeetInches: (inches: number): string => {

        const feet = Math.floor(inches / 12);
        const inchesReamining = inches % 12;
        const inchesReaminingRounded = Math.round(inchesReamining * 10) / 10; // 1 decimal places

        let result: string = "";

        if (feet > 0) {

            result = `${feet}' `;
        }

        if (inchesReaminingRounded > 0) {

            result = `${result}${inchesReaminingRounded}"`;
        }

        return result;
    },

    isNullOrWhiteSpace: (input: string | null | undefined): boolean => {

        if (input === null
            || input === undefined) {

            return true;
        }

        input = `${input}`;

        return input.match(/^\s*$/) !== null;
    },

    checkArraysEqual: (a: string[], b: string[]): boolean => {

        if (a === b) {

            return true;
        }

        if (a === null
            || b === null) {

            return false;
        }

        if (a.length !== b.length) {

            return false;
        }

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        const x: string[] = [...a];
        const y: string[] = [...b];

        x.sort();
        y.sort();

        for (let i = 0; i < x.length; i++) {

            if (x[i] !== y[i]) {

                return false;
            }
        }

        return true;
    },

    shuffle(array: Array<any>): Array<any> {

        let currentIndex = array.length;
        let temporaryValue: any
        let randomIndex: number;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    isNumeric: (input: any): boolean => {

        if (gUtilities.isNullOrWhiteSpace(input) === true) {

            return false;
        }

        return !isNaN(input);
    },

    isNegativeNumeric: (input: any): boolean => {

        if (!gUtilities.isNumeric(input)) {

            return false;
        }

        return +input < 0; // + converts a string to a number if it consists only of digits.
    },

    hasDuplicates: <T>(input: Array<T>): boolean => {

        if (new Set(input).size !== input.length) {

            return true;
        }

        return false;
    },

    extend: <T>(array1: Array<T>, array2: Array<T>): void => {

        array2.forEach((item: T) => {

            array1.push(item);
        });
    },

    prettyPrintJsonFromString: (input: string | null): string => {

        if (!input) {

            return "";
        }

        return gUtilities.prettyPrintJsonFromObject(JSON.parse(input));
    },

    prettyPrintJsonFromObject: (input: object | null): string => {

        if (!input) {

            return "";
        }

        return JSON.stringify(
            input,
            null,
            4 // indented 4 spaces
        );
    },

    isPositiveNumeric: (input: any): boolean => {

        if (!gUtilities.isNumeric(input)) {

            return false;
        }

        return Number(input) >= 0;
    },

    getTime: (): string => {

        const now: Date = new Date(Date.now());
        const time: string = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}::${now.getMilliseconds().toString().padStart(3, '0')}:`;

        return time;
    },

    splitByNewLine: (input: string): Array<string> => {

        if (gUtilities.isNullOrWhiteSpace(input) === true) {

            return [];
        }

        const results = input.split(/[\r\n]+/);
        const cleaned: Array<string> = [];

        results.forEach((value: string) => {

            if (!gUtilities.isNullOrWhiteSpace(value)) {

                cleaned.push(value.trim());
            }
        });

        return cleaned;
    },

    splitByPipe: (input: string): Array<string> => {

        if (gUtilities.isNullOrWhiteSpace(input) === true) {

            return [];
        }

        const results = input.split('|');
        const cleaned: Array<string> = [];

        results.forEach((value: string) => {

            if (!gUtilities.isNullOrWhiteSpace(value)) {

                cleaned.push(value.trim());
            }
        });

        return cleaned;
    },

    splitByNewLineAndOrder: (input: string): Array<string> => {

        return gUtilities
            .splitByNewLine(input)
            .sort();
    },

    joinByNewLine: (input: Array<string>): string => {

        if (!input
            || input.length === 0) {

            return '';
        }

        return input.join('\n');
    },

    removeAllChildren: (parent: Element): void => {

        if (parent !== null) {

            while (parent.firstChild) {

                parent.removeChild(parent.firstChild);
            }
        }
    },

    isOdd: (x: number): boolean => {

        return x % 2 === 1;
    },

    shortPrintText: (
        input: string,
        maxLength: number = 100): string => {

        if (gUtilities.isNullOrWhiteSpace(input) === true) {

            return '';
        }

        const firstNewLineIndex: number = gUtilities.getFirstNewLineIndex(input);

        if (firstNewLineIndex > 0
            && firstNewLineIndex <= maxLength) {

            const output = input.substr(0, firstNewLineIndex - 1);

            return gUtilities.trimAndAddEllipsis(output);
        }

        if (input.length <= maxLength) {

            return input;
        }

        const output = input.substr(0, maxLength);

        return gUtilities.trimAndAddEllipsis(output);
    },

    trimAndAddEllipsis: (input: string): string => {

        let output: string = input.trim();
        let punctuationRegex: RegExp = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
        let spaceRegex: RegExp = /\W+/g;
        let lastCharacter: string = output[output.length - 1];

        let lastCharacterIsPunctuation: boolean =
            punctuationRegex.test(lastCharacter)
            || spaceRegex.test(lastCharacter);


        while (lastCharacterIsPunctuation === true) {

            output = output.substr(0, output.length - 1);
            lastCharacter = output[output.length - 1];

            lastCharacterIsPunctuation =
                punctuationRegex.test(lastCharacter)
                || spaceRegex.test(lastCharacter);
        }

        return `${output}...`;
    },

    getFirstNewLineIndex: (input: string): number => {

        let character: string;

        for (let i = 0; i < input.length; i++) {

            character = input[i];

            if (character === '\n'
                || character === '\r') {

                return i;
            }
        }

        return -1;
    },

    upperCaseFirstLetter: (input: string): string => {

        return input.charAt(0).toUpperCase() + input.slice(1);
    },

    generateGuid: (useHypens: boolean = false): string => {

        let d = new Date().getTime();

        let d2 = (performance
            && performance.now
            && (performance.now() * 1000)) || 0;

        let pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        if (!useHypens) {
            pattern = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
        }

        const guid = pattern
            .replace(
                /[xy]/g,
                function (c) {

                    let r = Math.random() * 16;

                    if (d > 0) {

                        r = (d + r) % 16 | 0;
                        d = Math.floor(d / 16);
                    }
                    else {

                        r = (d2 + r) % 16 | 0;
                        d2 = Math.floor(d2 / 16);
                    }

                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                }
            );

        return guid;
    },

    checkIfChrome: (): boolean => {

        // please note, 
        // that IE11 now returns undefined again for window.chrome
        // and new Opera 30 outputs true for window.chrome
        // but needs to check if window.opr is not undefined
        // and new IE Edge outputs to true now for window.chrome
        // and if not iOS Chrome check
        // so use the below updated condition

        let tsWindow: any = window as any;
        let isChromium = tsWindow.chrome;
        let winNav = window.navigator;
        let vendorName = winNav.vendor;
        let isOpera = typeof tsWindow.opr !== "undefined";
        let isIEedge = winNav.userAgent.indexOf("Edge") > -1;
        let isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
            // is Google Chrome on IOS
            return true;
        }
        else if (isChromium !== null
            && typeof isChromium !== "undefined"
            && vendorName === "Google Inc."
            && isOpera === false
            && isIEedge === false) {
            // is Google Chrome
            return true;
        }

        return false;
    }
};

export default gUtilities;