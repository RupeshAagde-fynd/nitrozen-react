import React, { useState, useEffect } from "react";
import "./Code.scss";

export interface CodeProps {
  fields: 4 | 6;
  getCode: Function;
  label: string;
  codeId: string;
}

const Code = (props: CodeProps) => {
  const { fields, getCode, label, codeId, ...restProps } = props;
  const [labelFocus, setlabelFocus] = useState("");
  const [codeArr, setCodeArr] = useState<string[]>([]);

  // Once the component mounts set the state array with the number of prop fields
  useEffect(() => {
    let codeArrEnum = Array(fields).fill("");
    setCodeArr(codeArrEnum);
  }, []);

  function onInputChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) {
    // if the target event is empty then delete and go back
    if (event.target.value == "") {
      handleBackSpace(index);
    }
    // Replace the user input to allow only numbers
    let codeInput = event.target.value.replace(/[^0-9]+/g, "");
    // only if there is input with 1 digit
    if (codeInput && codeInput.length <= 1) {
      let tempCodeArr = [...codeArr];
      tempCodeArr[index] = codeInput;
      setCodeArr(tempCodeArr);
      getCode(tempCodeArr.join(""));
      goToNextField(index);
      setlabelFocus("n-code-focused-label");
    }
  }

  function goToNextField(currentIndex: number) {
    // if there is a field after the current index then shift focus on that
    if (currentIndex + 1 <= fields - 1) {
      let nextField = document.getElementById(
        `code-input-${codeId}-${currentIndex + 1}`
      );
      nextField?.focus();
    }
  }

  function handleBackSpace(currentIndex: number) {
    // if there is a field before the current index then delete and focus on that index
    if (currentIndex >= 0 && currentIndex <= fields - 1) {
      let tempCodeArr = [...codeArr];
      tempCodeArr[currentIndex] = "";
      setCodeArr(tempCodeArr);
      getCode(tempCodeArr.join(""));
      let prevField = document.getElementById(
        `code-input-${codeId}-${currentIndex - 1}`
      );
      prevField?.focus();
    }
  }

  // handle the focus of the label container
  function handleClick() {
    setlabelFocus("n-code-focused-label");
  }
  // handle the focus of the label container
  function handleBlur() {
    if (!codeArr.join("").length) {
      setlabelFocus("");
    }
  }
  return (
    <div className="n-code-main">
      <div className={`n-code-label-container ${labelFocus}`}>
        <label className="n-code-label">{label}</label>
      </div>
      <div className={`n-code-field-container`}>
        {codeArr.map((value, index) => {
          return (
            <input
              autoComplete="off"
              id={`code-input-${codeId}-` + index}
              value={value}
              type="text"
              onClick={handleClick}
              onBlur={handleBlur}
              onChange={(e) => onInputChange(e, index)}
              className={`n-code-input-field ${`n-code-${fields}`}`}
            />
          );
        })}
      </div>
    </div>
  );
};

Code.defaulProps = {
  fields: 4,
  label: "",
  codeId: "",
};

export default React.memo(Code);
