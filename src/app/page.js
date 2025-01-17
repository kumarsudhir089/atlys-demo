"use client";

import React, { useEffect, useState, useReducer } from "react";
import styles from "./page.module.css";
import FunctionCard from "./components/FunctionCard/FunctionCard";
import OutputBox from "./components/OutputBox/OutputBox";
import InputBox from "./components/InputBox/InputBox";

const initialState = {
  equations: ["", "", "", "", ""],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_EQUATION":
      const newEquations = [...state.equations];
      newEquations[action.index] = action.payload;
      return { ...state, equations: newEquations };
    default:
      return state;
  }
}

export default function Home() {

  // input value
  const [input, setinput] = useState(0)

  // final computed output value
  const [output, setoutput] = useState(0)

  // paths is svg path info between cards
  const [paths, setPaths] = useState([]);

  // this is path from inputnode to starting Node
  const [startPath, setstartPath] = useState(null)

  // this is path from last node to output node
  const [endPath, setendPath] = useState(null)


  // used useReducer here because i wanted to manange error state or other things in the single state only, but i managed error validations in FunctionCard component itself
  const [state, dispatch] = useReducer(reducer, initialState);
  const [allEquationValid, setallEquationValid] = useState(true);

  // we can use setter to change start input node
  const [startNode, setstartNode] = useState(0) // to identify which node is start of evaluation


  // this object can be moved to start variable if when we want to make the connections editable
  // here the key is input node and value is output node
  // null represent sink here ie. output node
  const nodeMappingOutput = {
    0: 1,
    1: 3,
    2: null,
    3: 4,
    4: 2
  }


  useEffect(() => {
    // if all equations are there and valid then compute the output
    if (allEquationValid && state.equations.every(equation => equation.length > 0)) {
      evaluateEquation(startNode, input);
    } else {
      // either a equation in not given or invalid
      setoutput("-")
    }
  }, [input, state.equations])

  // handle svg path creation
  useEffect(() => {
    // calculate path between two given nodes
    function createPaths(inputNodeId, outputNodeId) {
      const node2 = document.getElementById(outputNodeId);
      const node1 = document.getElementById(inputNodeId);

      if (node1 && node2) {
        const node1Rect = node1.getBoundingClientRect();
        const node2Rect = node2.getBoundingClientRect();

        const startX = node1Rect.right;
        const startY = node1Rect.top + node1Rect.height / 2;
        const endX = node2Rect.left;
        const endY = node2Rect.top + node2Rect.height / 2;

        const pathData = `M${startX},${startY} C${startX + 100},${startY} ${endX - 100},${endY} ${endX},${endY}`;

        return pathData
      }
    }

    // update paths when resize
    function updatePaths() {
      const tempPaths = [];
      for (let key in nodeMappingOutput) {
        if (nodeMappingOutput[key]) {
          tempPaths.push(createPaths("output-node-" + (Number(key) + 1), "input-node-" + (Number(nodeMappingOutput[key]) + 1)));
        }
      }
      setPaths([...tempPaths]);
      setstartPath(createPaths("start-node", "input-node-" + (startNode + 1)));
      for (let key in nodeMappingOutput) {
        if (nodeMappingOutput[key] === null) {
          setendPath(createPaths("output-node-" + (Number(key) + 1), "end-node"));
          break;
        }
      }
    }

    updatePaths();

    const handleResize = () => {
      updatePaths();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function evaluateEquation(equationId, x) {
    try {
      let replacedEquation = state.equations[equationId]
        .replace(/(\d)(x)/g, '$1*$2') // convert 2x into 2*x
        .replace(/x/g, x < 0 ? `(${x})` : x) // replace with actual value
        .replace(/\^/g, '**'); // handle 2^x

      // Evaluate the equation
      const result = new Function(`return ${replacedEquation}`)();

      // solve the equation using chaining
      if (nodeMappingOutput[equationId] !== null) {
        evaluateEquation(nodeMappingOutput[equationId], result);
      } else {
        // reached the sink
        setoutput(result);
      }
    } catch (error) {
      console.error("Invalid equation:", error);
      return null;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.cards}>
        <InputBox value={input} setValue={setinput} />

        {state.equations.map((equation, index) => (
          <FunctionCard
            key={`function-carr-${index}`}
            currentId={index + 1}
            inputNodeId={index}
            outputNodeId={nodeMappingOutput[index] ? nodeMappingOutput[index] + 1 : null}
            equation={equation}
            setEquation={(newEquation) => {
              dispatch({ type: "SET_EQUATION", index, payload: newEquation });
              setoutput("-")
            }}
            setallEquationValid={setallEquationValid}
          />
        ))}

        <OutputBox value={output} />
      </div>
      {
        paths.map((path, index) => <svg key={`svg-path-${index}`} className={styles.svgLine}>
          <path d={path} strokeLinecap="round" stroke="#0066FF4D" strokeWidth={7} fill="transparent" />
        </svg>)
      }

      {startPath && <svg key={`svg-path-start`} className={styles.svgLine}>
        <path d={startPath} strokeLinecap="round" stroke="#0066FF4D" strokeWidth={7} fill="transparent" />
      </svg>}

      {endPath && <svg key={`svg-path-end`} className={styles.svgLine}>
        <path d={endPath} strokeLinecap="round" stroke="#0066FF4D" strokeWidth={7} fill="transparent" />
      </svg>}
    </div>
  );
}
