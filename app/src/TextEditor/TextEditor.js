// Import React dependencies.
import React, { useEffect, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Transforms } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'


const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  useEffect(() => {
    if (!value) {
       //Transforms.deselect(editor);
       // or set selection to neutral state:
       // editor.selection = { anchor: { path: [0,0], offset:0 }, focus: { path: [0,0], offset: 0 } }
       Transforms.select(editor, {
         anchor: { path: [0, 0], offset: 0 },
         focus: { path: [0, 0], offset: 0 },
       })
    }
  }, [value]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
      <Editable
        onKeyDown={event => {

          if (event.key === '&') {

            // Prevent the ampersand character from being inserted.
            event.preventDefault()
            // Execute the `insertText` method when the event occurs.
            editor.insertText('and')
          }
        }}

      />
    </Slate>
  )
}

export default TextEditor
