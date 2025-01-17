import { useState } from 'react';
import styles from './FunctionCard.module.css';
const FunctionCard = ({
  currentId,
  inputNodeId,
  outputNodeId,
  equation,
  setEquation,
  setallEquationValid
}) => {

  const [error, seterror] = useState(null)

  function validateEquation(equation) {
    const regex = /^[x+\-*/^0-9\s]*$/;

    if (!regex.test(equation)) {
      seterror("equation is not valid!")
      setallEquationValid(false)
      return
    }

    // Check for invalid sequences of operators
    if (/[\+\-*/^]{2,}/.test(equation)) {
      seterror("equation is not valid!")
      setallEquationValid(false)
      return
    }

    seterror(null)
    setallEquationValid(true)
  }
  return (
    <div className={styles.functionCard}>
      <div className={styles.cardHeader}>
        <span className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grip-horizontal" viewBox="0 0 16 16">
            <path d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
        </span>
        <h3 className={styles.cardName}>Function: {currentId}</h3>
      </div>
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Equation</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => {
              const currentVal = (e.target.value)?.trim();
              validateEquation(currentVal)
              setEquation(currentVal)
            }}
          />
          {error && <span style={{ color: 'red', fontSize: '10px' }}>{error}</span>}
        </div>
        <div className={styles.field}>
          <label>Next Function</label>
          <select disabled>
            <option label={outputNodeId ? "Function " + outputNodeId : "-"} />
          </select>
        </div>
      </div>
      <div className={styles.connectors}>
        <div className={styles.inputConnector}>
          <span id={`input-node-${currentId}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#DBDBDB" className="bi bi-record-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            </svg>
          </span>
          input</div>
        <div className={styles.outputConnector}>output <span id={`output-node-${currentId}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#DBDBDB" className="bi bi-record-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          </svg>
        </span></div>
      </div>
    </div>
  );
};

export default FunctionCard;