import React from 'react'
import styles from "./OutputBox.module.css"

function OutputBox({
  value
}) {
  return (
    <div className={styles.outputBox}>
      <span className={styles.label}>
        Final Output y
      </span>
      <div className={styles.output}>
        <span className={styles.connector} id="end-node">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dbdbdb" className="bi bi-record-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          </svg>
        </span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  )
}

export default OutputBox