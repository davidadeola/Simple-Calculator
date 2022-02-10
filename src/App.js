import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add__digit',
  CHOOSE_OPERATION: 'choose__operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete__digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          presentOutput: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.presentOutput === "0") {
        return state;
      }
      if (payload.digit === "." && state.presentOutput.includes(".")) 
        return state;
      

      return {
        ...state,
        presentOutput: `${state.presentOutput || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.presentOutput == null && state.previousOutput == null) {
        return state;
      }

      if (state.presentOutput == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOutput == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOutput: state.presentOutput,
          presentOutput: null,
        };
      }

      return {
        ...state,
        previousOutput: evaluate(state),
        operation: payload.operation,
        presentOutput: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          presentOutput: null
        }
      }
      if (state.presentOutput == null) return state
      if (state.presentOutput.length === 1) {
        return { ...state, presentOutput: null }
      }

      return {
        ...state,
        presentOutput: state.presentOutput.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.presentOutput == null ||
        state.previousOutput == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOutput: null,
        operation: null,
        presentOutput: evaluate(state),
      }
  }
}

function evaluate({ presentOutput, previousOutput, operation }) {
  const prev = parseFloat(previousOutput);
  const present = parseFloat(presentOutput);
  if (isNaN(prev) || isNaN(present)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + present;
      break;
    case "-":
      computation = prev - present;
      break;
    case "*":
      computation = prev * present;
      break;
    case "÷":
      computation = prev / present;
      break;
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOutput(output) {
  if (output == null) return
  const [integer, decimal] = output.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ presentOutput, previousOutput, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator__grid">
      <div className="output">
        <div className="previous__output">
          {formatOutput(previousOutput)} {operation}
        </div>
        <div className="present__output">{formatOutput(presentOutput)}</div>
      </div>
      <button
        className="span__two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton  operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span__two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
