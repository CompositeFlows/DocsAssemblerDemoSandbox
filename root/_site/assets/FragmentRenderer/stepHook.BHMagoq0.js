var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class HookRegistry {
  constructor() {
    __publicField(this, "stepHook", null);
  }
  registerStepHook(hook) {
    this.stepHook = hook;
  }
  executeStepHook(state, step) {
    if (this.stepHook) {
      this.stepHook(
        state,
        step
      );
    }
  }
}
const registerStepHook = () => {
  if (!window.HookRegistry) {
    window.HookRegistry = new HookRegistry();
    window.HookRegistry.registerStepHook(stepHook.processStep);
  }
};
const PROCESS_STEP = "<p>PROCESS_STEP</p>";
const runProcessStep = (step) => {
  let stepText = step.value;
  let firstlineEndIndex = stepText.indexOf("\n");
  let firstLine = "";
  if (firstlineEndIndex === -1) {
    firstLine = stepText;
    stepText = "";
  } else {
    firstLine = stepText.substring(0, firstlineEndIndex);
    stepText = stepText.substring(firstlineEndIndex + 1);
  }
  if (firstLine.trim() === PROCESS_STEP) {
    step.value = stepText;
    return true;
  }
  return false;
};
const printStepVariables = (step, stringOutput) => {
  var _a;
  if (!step.variable || step.variable.length === 0) {
    return null;
  }
  const stepVariables = step.variable;
  const openVariables = stringOutput.openVariables;
  let variableOutput = "";
  let start = "";
  let end = "";
  let variableName = "";
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
  ];
  const resetVariables = [
    "demoEnd"
  ];
  for (const variable of stepVariables) {
    start = "<li>";
    end = "</li>";
    if (variable.length === 1) {
      variableName = variable[0].trim();
      variableOutput = `${variableName} = ${((_a = step.selected) == null ? void 0 : _a.option.trim()) ?? "no option selected"}`;
    } else {
      variableName = variable[0].trim();
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
    } else {
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
        end = `${end}<ul>`;
        stringOutput.openVariables.push(variableName);
        stringOutput.nestingLevel++;
      }
    }
    variableOutput = `${start}${variableOutput}${end}`;
  }
  return variableOutput;
};
const printChainStepVariables = (state, step, stringOutput) => {
  var _a;
  if (!step) {
    return;
  }
  const stepVariable = printStepVariables(
    step,
    stringOutput
  );
  if (stepVariable) {
    stringOutput.output = `${stringOutput.output}
${stepVariable}`;
  }
  printChainStepVariables(
    state,
    (_a = step.link) == null ? void 0 : _a.root,
    stringOutput
  );
  printChainStepVariables(
    state,
    step.selected,
    stringOutput
  );
};
const printChainVariables = (state, step) => {
  var _a;
  const root = (_a = state.renderState.displayGuide) == null ? void 0 : _a.root;
  if (!root) {
    return;
  }
  let stringOutput = {
    output: "",
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
${stringOutput.output}`;
};
const stepHook = {
  processStep: (state, step) => {
    try {
      const runProcess = runProcessStep(step);
      if (!runProcess) {
        return;
      }
      printChainVariables(
        state,
        step
      );
    } catch (exp) {
      console.log(exp);
    }
  }
};
registerStepHook();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcEhvb2suQkhNYWdvcTAuanMiLCJzb3VyY2VzIjpbIi4uL3Jvb3Qvc3JjMi9Ib29rUmVnaXN0cnkudHMiLCIuLi9yb290L3NyYzIvc3RlcEhvb2sudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElTdGF0ZSBmcm9tIFwiLi4vc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9zdGF0ZS9JU3RhdGVcIjtcclxuaW1wb3J0IElSZW5kZXJGcmFnbWVudCBmcm9tIFwiLi4vc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9zdGF0ZS9yZW5kZXIvSVJlbmRlckZyYWdtZW50XCI7XHJcbmltcG9ydCBJSG9va1JlZ2lzdHJ5IGZyb20gXCIuLi9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3dpbmRvdy9JSG9va1JlZ2lzdHJ5XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb29rUmVnaXN0cnkgaW1wbGVtZW50cyBJSG9va1JlZ2lzdHJ5IHtcclxuXHJcbiAgICBwcml2YXRlIHN0ZXBIb29rOiAoKHN0YXRlOiBJU3RhdGUsIHN0ZXA6IElSZW5kZXJGcmFnbWVudCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJTdGVwSG9vayhob29rOiAoc3RhdGU6IElTdGF0ZSwgc3RlcDogSVJlbmRlckZyYWdtZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcEhvb2sgPSBob29rO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleGVjdXRlU3RlcEhvb2soXHJcbiAgICAgICAgc3RhdGU6IElTdGF0ZSxcclxuICAgICAgICBzdGVwOiBJUmVuZGVyRnJhZ21lbnRcclxuICAgICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGVwSG9vaykge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGVwSG9vayhcclxuICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgc3RlcFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSVN0YXRlIGZyb20gXCIuLi9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL0lTdGF0ZVwiO1xyXG5pbXBvcnQgZ1N0YXRlQ29kZSBmcm9tIFwiLi4vc3JjL21vZHVsZXMvZ2xvYmFsL2NvZGUvZ1N0YXRlQ29kZVwiO1xyXG5pbXBvcnQgSVJlbmRlckZyYWdtZW50IGZyb20gXCIuLi9zcmMvbW9kdWxlcy9pbnRlcmZhY2VzL3N0YXRlL3JlbmRlci9JUmVuZGVyRnJhZ21lbnRcIjtcclxuaW1wb3J0IElIb29rUmVnaXN0cnkgZnJvbSBcIi4uL3NyYy9tb2R1bGVzL2ludGVyZmFjZXMvd2luZG93L0lIb29rUmVnaXN0cnlcIjtcclxuaW1wb3J0IEhvb2tSZWdpc3RyeSBmcm9tIFwiLi9Ib29rUmVnaXN0cnlcIlxyXG5pbXBvcnQgSURpc3BsYXlDaGFydCBmcm9tIFwiLi4vc3JjL21vZHVsZXMvaW50ZXJmYWNlcy9zdGF0ZS9kaXNwbGF5L0lEaXNwbGF5Q2hhcnRcIjtcclxuaW1wb3J0IElTdHJpbmdPdXRwdXQgZnJvbSBcIi4vSVN0cmluZ091dHB1dFwiO1xyXG5pbXBvcnQgZ1V0aWxpdGllcyBmcm9tIFwiLi4vc3JjL21vZHVsZXMvZ2xvYmFsL2dVdGlsaXRpZXNcIjtcclxuXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcblxyXG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcblxyXG4gICAgICAgIEhvb2tSZWdpc3RyeTogSUhvb2tSZWdpc3RyeVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByZWdpc3RlclN0ZXBIb29rID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgIGlmICghd2luZG93Lkhvb2tSZWdpc3RyeSkge1xyXG5cclxuICAgICAgICB3aW5kb3cuSG9va1JlZ2lzdHJ5ID0gbmV3IEhvb2tSZWdpc3RyeSgpO1xyXG4gICAgICAgIHdpbmRvdy5Ib29rUmVnaXN0cnkucmVnaXN0ZXJTdGVwSG9vayhzdGVwSG9vay5wcm9jZXNzU3RlcCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBQUk9DRVNTX1NURVAgPSAnPHA+UFJPQ0VTU19TVEVQPC9wPic7XHJcblxyXG5jb25zdCBydW5Qcm9jZXNzU3RlcCA9IChzdGVwOiBJUmVuZGVyRnJhZ21lbnQpOiBib29sZWFuID0+IHtcclxuXHJcbiAgICBsZXQgc3RlcFRleHQgPSBzdGVwLnZhbHVlO1xyXG4gICAgbGV0IGZpcnN0bGluZUVuZEluZGV4ID0gc3RlcFRleHQuaW5kZXhPZignXFxuJyk7XHJcbiAgICBsZXQgZmlyc3RMaW5lID0gJyc7XHJcblxyXG4gICAgaWYgKGZpcnN0bGluZUVuZEluZGV4ID09PSAtMSkge1xyXG5cclxuICAgICAgICBmaXJzdExpbmUgPSBzdGVwVGV4dDtcclxuICAgICAgICBzdGVwVGV4dCA9ICcnXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmaXJzdExpbmUgPSBzdGVwVGV4dC5zdWJzdHJpbmcoMCwgZmlyc3RsaW5lRW5kSW5kZXgpO1xyXG4gICAgICAgIHN0ZXBUZXh0ID0gc3RlcFRleHQuc3Vic3RyaW5nKGZpcnN0bGluZUVuZEluZGV4ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpcnN0TGluZS50cmltKCkgPT09IFBST0NFU1NfU1RFUCkge1xyXG5cclxuICAgICAgICBzdGVwLnZhbHVlID0gc3RlcFRleHQ7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmNvbnN0IHByaW50U3RlcFZhcmlhYmxlcyA9IChcclxuICAgIHN0ZXA6IElSZW5kZXJGcmFnbWVudCxcclxuICAgIHN0cmluZ091dHB1dDogSVN0cmluZ091dHB1dFxyXG4pOiBzdHJpbmcgfCBudWxsID0+IHtcclxuXHJcbiAgICBpZiAoIXN0ZXAudmFyaWFibGVcclxuICAgICAgICB8fCBzdGVwLnZhcmlhYmxlLmxlbmd0aCA9PT0gMFxyXG4gICAgKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RlcFZhcmlhYmxlcyA9IHN0ZXAudmFyaWFibGU7XHJcbiAgICBjb25zdCBvcGVuVmFyaWFibGVzID0gc3RyaW5nT3V0cHV0Lm9wZW5WYXJpYWJsZXM7XHJcbiAgICBsZXQgdmFyaWFibGVPdXRwdXQgPSAnJztcclxuICAgIGxldCBvdXRwdXQgPSAnJztcclxuICAgIGxldCBzdGFydCA9ICcnO1xyXG4gICAgbGV0IGVuZCA9ICcnO1xyXG4gICAgbGV0IHZhcmlhYmxlTmFtZSA9ICcnO1xyXG5cclxuICAgIGNvbnN0IHVsVmFyaWFibGVzID0gW1xyXG4gICAgICAgIFwidG93ZXJMb2NhdGlvblwiLFxyXG4gICAgICAgIFwiZ3Jvd0Vhc3lcIixcclxuICAgICAgICBcImZyYW1lQ291bnRcIixcclxuICAgICAgICBcImZyYW1lXCIsXHJcbiAgICAgICAgXCJtb2R1bGVUeXBlXCIsXHJcbiAgICAgICAgXCJtb2R1bGVNb2RlbFwiLFxyXG4gICAgICAgIFwidHdpblwiLFxyXG4gICAgICAgIFwiaGVyYkJheVwiLFxyXG4gICAgICAgIFwiY3JvcENhdGVnb3J5XCJcclxuICAgIF1cclxuXHJcbiAgICBjb25zdCByZXNldFZhcmlhYmxlcyA9IFtcclxuICAgICAgICBcImRlbW9FbmRcIlxyXG4gICAgXVxyXG5cclxuICAgIGZvciAoY29uc3QgdmFyaWFibGUgb2Ygc3RlcFZhcmlhYmxlcykge1xyXG5cclxuICAgICAgICBzdGFydCA9ICc8bGk+JztcclxuICAgICAgICBlbmQgPSAnPC9saT4nO1xyXG5cclxuICAgICAgICBpZiAodmFyaWFibGUubGVuZ3RoID09PSAxKSB7XHJcblxyXG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB2YXJpYWJsZVswXS50cmltKClcclxuICAgICAgICAgICAgdmFyaWFibGVPdXRwdXQgPSBgJHt2YXJpYWJsZU5hbWV9ID0gJHtzdGVwLnNlbGVjdGVkPy5vcHRpb24udHJpbSgpID8/ICdubyBvcHRpb24gc2VsZWN0ZWQnfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB2YXJpYWJsZVswXS50cmltKClcclxuICAgICAgICAgICAgdmFyaWFibGVPdXRwdXQgPSBgJHt2YXJpYWJsZU5hbWV9ID0gJHt2YXJpYWJsZVsxXS50cmltKCl9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdHJpbmdPdXRwdXQubmVzdGluZ0xldmVsID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBzdHJpbmdPdXRwdXQubmVzdGluZ0xldmVsKys7XHJcbiAgICAgICAgICAgIHN0YXJ0ID0gYDx1bD4ke3N0YXJ0fWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzZXRWYXJpYWJsZXMuaW5jbHVkZXModmFyaWFibGVOYW1lKSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBvcGVuVmFyaWFibGVzLmxlbmd0aDsgaysrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBgPC91bD4ke3N0YXJ0fWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9wZW5WYXJpYWJsZXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgc3RyaW5nT3V0cHV0Lm5lc3RpbmdMZXZlbCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gb3BlblZhcmlhYmxlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3BlblZhcmlhYmxlc1tpXSA9PT0gdmFyaWFibGVOYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291bnRlcjsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGA8L3VsPiR7c3RhcnR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nT3V0cHV0Lm5lc3RpbmdMZXZlbC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlblZhcmlhYmxlcy5sZW5ndGggPSBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHVsVmFyaWFibGVzLmluY2x1ZGVzKHZhcmlhYmxlTmFtZSkgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBOZXh0IHZhcmlhYmxlIHdpbGwgYmUgd2l0aGluIHRoZSB1bCBmb3IgdGhzIHZhcmlhYmxlTmFtZVxyXG4gICAgICAgICAgICAgICAgZW5kID0gYCR7ZW5kfTx1bD5gO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nT3V0cHV0Lm9wZW5WYXJpYWJsZXMucHVzaCh2YXJpYWJsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nT3V0cHV0Lm5lc3RpbmdMZXZlbCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXJpYWJsZU91dHB1dCA9IGAke3N0YXJ0fSR7dmFyaWFibGVPdXRwdXR9JHtlbmR9YDtcclxuICAgICAgICBvdXRwdXQgPSBgJHtvdXRwdXR9JHt2YXJpYWJsZU91dHB1dH1cclxuYFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YXJpYWJsZU91dHB1dDtcclxufTtcclxuXHJcbmNvbnN0IHByaW50Q2hhaW5TdGVwVmFyaWFibGVzID0gKFxyXG4gICAgc3RhdGU6IElTdGF0ZSxcclxuICAgIHN0ZXA6IElSZW5kZXJGcmFnbWVudCB8IG51bGwgfCB1bmRlZmluZWQsXHJcbiAgICBzdHJpbmdPdXRwdXQ6IElTdHJpbmdPdXRwdXRcclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgaWYgKCFzdGVwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0ZXBWYXJpYWJsZSA9IHByaW50U3RlcFZhcmlhYmxlcyhcclxuICAgICAgICBzdGVwLFxyXG4gICAgICAgIHN0cmluZ091dHB1dFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoc3RlcFZhcmlhYmxlKSB7XHJcblxyXG4gICAgICAgIHN0cmluZ091dHB1dC5vdXRwdXQgPSBgJHtzdHJpbmdPdXRwdXQub3V0cHV0fVxyXG4ke3N0ZXBWYXJpYWJsZX1gXHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnRDaGFpblN0ZXBWYXJpYWJsZXMoXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgc3RlcC5saW5rPy5yb290LFxyXG4gICAgICAgIHN0cmluZ091dHB1dFxyXG4gICAgKTtcclxuXHJcbiAgICBwcmludENoYWluU3RlcFZhcmlhYmxlcyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICBzdGVwLnNlbGVjdGVkLFxyXG4gICAgICAgIHN0cmluZ091dHB1dFxyXG4gICAgKTtcclxufVxyXG5cclxuY29uc3QgcHJpbnRDaGFpblZhcmlhYmxlcyA9IChcclxuICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICBzdGVwOiBJUmVuZGVyRnJhZ21lbnRcclxuKTogdm9pZCA9PiB7XHJcblxyXG4gICAgY29uc3Qgcm9vdCA9IHN0YXRlLnJlbmRlclN0YXRlLmRpc3BsYXlHdWlkZT8ucm9vdDtcclxuXHJcbiAgICBpZiAoIXJvb3QpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHN0cmluZ091dHB1dDogSVN0cmluZ091dHB1dCA9IHtcclxuICAgICAgICBvdXRwdXQ6ICcnLFxyXG4gICAgICAgIG5lc3RpbmdMZXZlbDogMCxcclxuICAgICAgICBvcGVuVmFyaWFibGVzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICBwcmludENoYWluU3RlcFZhcmlhYmxlcyhcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgICByb290LFxyXG4gICAgICAgIHN0cmluZ091dHB1dFxyXG4gICAgKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZ091dHB1dC5uZXN0aW5nTGV2ZWw7IGkrKykge1xyXG5cclxuICAgICAgICBzdHJpbmdPdXRwdXQub3V0cHV0ID0gYCR7c3RyaW5nT3V0cHV0Lm91dHB1dH08L3VsPmA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcC52YWx1ZSA9IGAke3N0ZXAudmFsdWV9XHJcbiR7c3RyaW5nT3V0cHV0Lm91dHB1dH1gXHJcbn1cclxuXHJcblxyXG5jb25zdCBzdGVwSG9vayA9IHtcclxuXHJcbiAgICBwcm9jZXNzU3RlcDogKFxyXG4gICAgICAgIHN0YXRlOiBJU3RhdGUsXHJcbiAgICAgICAgc3RlcDogSVJlbmRlckZyYWdtZW50LFxyXG4gICAgKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJ1blByb2Nlc3M6IGJvb2xlYW4gPSBydW5Qcm9jZXNzU3RlcChzdGVwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcnVuUHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwcmludENoYWluVmFyaWFibGVzKFxyXG4gICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICBzdGVwXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleHApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXhwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3RlcEhvb2s7XHJcblxyXG5cclxucmVnaXN0ZXJTdGVwSG9vaygpO1xyXG5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLE1BQXFCLGFBQXNDO0FBQUEsRUFBM0Q7QUFFWSxvQ0FBb0U7QUFBQTtBQUFBLEVBRXJFLGlCQUFpQixNQUE0RDtBQUVoRixTQUFLLFdBQVc7QUFBQSxFQUNwQjtBQUFBLEVBRU8sZ0JBQ0gsT0FDQSxNQUNJO0FBRUosUUFBSSxLQUFLLFVBQVU7QUFFZixXQUFLO0FBQUEsUUFDRDtBQUFBLFFBQ0E7QUFBQSxNQUFBO0FBQUEsSUFFUjtBQUFBLEVBQ0o7QUFDSjtBQ1JBLE1BQU0sbUJBQW1CLE1BQVk7QUFFakMsTUFBSSxDQUFDLE9BQU8sY0FBYztBQUV0QixXQUFPLGVBQWUsSUFBSSxhQUFBO0FBQzFCLFdBQU8sYUFBYSxpQkFBaUIsU0FBUyxXQUFXO0FBQUEsRUFDN0Q7QUFDSjtBQUVBLE1BQU0sZUFBZTtBQUVyQixNQUFNLGlCQUFpQixDQUFDLFNBQW1DO0FBRXZELE1BQUksV0FBVyxLQUFLO0FBQ3BCLE1BQUksb0JBQW9CLFNBQVMsUUFBUSxJQUFJO0FBQzdDLE1BQUksWUFBWTtBQUVoQixNQUFJLHNCQUFzQixJQUFJO0FBRTFCLGdCQUFZO0FBQ1osZUFBVztBQUFBLEVBQ2YsT0FDSztBQUNELGdCQUFZLFNBQVMsVUFBVSxHQUFHLGlCQUFpQjtBQUNuRCxlQUFXLFNBQVMsVUFBVSxvQkFBb0IsQ0FBQztBQUFBLEVBQ3ZEO0FBRUEsTUFBSSxVQUFVLEtBQUEsTUFBVyxjQUFjO0FBRW5DLFNBQUssUUFBUTtBQUViLFdBQU87QUFBQSxFQUNYO0FBRUEsU0FBTztBQUNYO0FBRUEsTUFBTSxxQkFBcUIsQ0FDdkIsTUFDQSxpQkFDZ0I7QUR0RHBCO0FDd0RJLE1BQUksQ0FBQyxLQUFLLFlBQ0gsS0FBSyxTQUFTLFdBQVcsR0FDOUI7QUFDRSxXQUFPO0FBQUEsRUFDWDtBQUVBLFFBQU0sZ0JBQWdCLEtBQUs7QUFDM0IsUUFBTSxnQkFBZ0IsYUFBYTtB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
