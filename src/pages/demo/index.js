import React, { useState, useImperativeHandle, useRef } from "react";
import Modal from 'components/modal'
import {useActionsheet} from 'uses/useActionsheet'
import "./index.scss"
function DemoApp() {
  const actionsheet = useActionsheet()
  const [text, setText] = useState('');
  
  return (
    <div className="scroll">
      <button onClick={() => {
        actionsheet.show({
          menus: [
            {
              text: 'hello',
              value: 0
            },
            {
              text: 'hello',
              value: 0
            }
          ]
        })
      }}>show</button>
    </div>
    )
}

export default DemoApp
